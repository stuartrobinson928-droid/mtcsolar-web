import { useEffect, useMemo, useState } from "react";
import {
  X, ArrowRight, ArrowLeft, Check, Download, Truck, User, Wallet,
  Banknote, Smartphone, ShieldCheck, ShoppingBag, ChevronDown, ChevronUp,
  Plus, Minus, Trash2,
} from "lucide-react";
import { priceFor, useStore } from "@/context/store";
import { createOrder } from "@/lib/orders.functions";
import { toast } from "sonner";

type Pay = "bank" | "cod" | "easypaisa" | "jazzcash";
type Step = 0 | 1 | 2 | 3;

const fmt = (n: number) => "Rs " + n.toLocaleString("en-PK");
const payToDb = (p: Pay): "bank_transfer" | "cod" | "easypaisa" | "jazzcash" =>
  p === "bank" ? "bank_transfer" : p;

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
const isPhone = (v: string) => /^[0-9+\-\s]{7,}$/.test(v.trim());

export function CheckoutModal() {
  const { checkoutOpen, closeCheckout, items, totals, clear, setQty, remove, removeAll } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [city, setCity] = useState("");
  const [shipping, setShipping] = useState<"standard" | "express" | "install">("standard");
  const [pay, setPay] = useState<Pay>("bank");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("MTC-PENDING");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [summaryOpen, setSummaryOpen] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((s, { product, qty }) => s + priceFor(product) * qty, 0),
    [items],
  );
  const shipCost = shipping === "express" ? 4500 : shipping === "install" ? 12500 : 2500;
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + shipCost + tax;

  useEffect(() => {
    if (!checkoutOpen) {
      const t = setTimeout(() => {
        setStep(0);
        setTouched({});
        setSummaryOpen(false);
      }, 300);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, [checkoutOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCheckout(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCheckout]);

  const errors = {
    name: name.trim().length < 2 ? "Please enter your full name." : "",
    email: !isEmail(email) ? "Enter a valid email address." : "",
    phone: !isPhone(phone) ? "Enter a valid phone number (7+ digits)." : "",
    city: city.trim().length < 2 ? "City is required." : "",
    address: address.trim().length < 6 ? "Please enter a detailed address." : "",
  };
  const step1Valid = !errors.name && !errors.email && !errors.phone && !errors.city && !errors.address;

  const canNext =
    step === 0 ? items.length > 0 :
    step === 1 ? step1Valid :
    step === 2 ? true : false;

  const next = () => {
    if (step === 1 && !step1Valid) {
      setTouched({ name: true, email: true, phone: true, city: true, address: true });
      return;
    }
    setStep((s) => (Math.min(3, s + 1)) as Step);
  };
  const back = () => setStep((s) => (Math.max(0, s - 1)) as Step);

  const downloadInvoice = () => {
    const lines: string[] = [];
    lines.push("MTC SOLAR — TAX INVOICE");
    lines.push("Order: " + orderId);
    lines.push("Date: " + new Date().toLocaleString());
    lines.push("");
    lines.push("Customer: " + name);
    lines.push("Email: " + email);
    lines.push("Phone: " + phone);
    lines.push("Address: " + address + ", " + city);
    lines.push("");
    lines.push("Items:");
    items.forEach(({ product, qty }) => {
      lines.push(`  ${qty} x ${product.name} @ ${fmt(priceFor(product))}  =  ${fmt(priceFor(product) * qty)}`);
    });
    lines.push("");
    lines.push("Subtotal:  " + fmt(subtotal));
    lines.push("Shipping:  " + fmt(shipCost) + "  (" + shipping + ")");
    lines.push("GST (5%):  " + fmt(tax));
    lines.push("GRAND TOTAL: " + fmt(grand));
    lines.push("");
    lines.push("Payment: " + payLabel(pay));
    lines.push("");
    lines.push("Thank you for choosing MTC Solar.");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${orderId}-invoice.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const confirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await createOrder({
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        city: city.trim(),
        delivery_address: address.trim(),
        permanent_address: permanentAddress.trim() || null,
        notes: `Shipping: ${shipping}. Subtotal ${subtotal}, ship ${shipCost}, tax ${tax}, total ${grand}`,
        payment_method: payToDb(pay),
        items: items.map(({ product, qty }) => ({
          product_id: null,
          product_name: product.name,
          quantity: qty,
          unit_price: priceFor(product),
        })),
      });
      setOrderId(res.order_number);
      toast.success("Order placed: " + res.order_number);
      setStep(3);
    } catch (e) {
      toast.error((e as Error).message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const finish = () => {
    clear();
    closeCheckout();
  };

  const Summary = (
    <>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Order summary</p>
      <h4 className="mt-1 font-display text-lg font-semibold">
        {totals.count} item{totals.count === 1 ? "" : "s"} · {totals.kw.toFixed(1)} kW
      </h4>
      <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-2 text-xs">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex justify-between gap-3 text-muted-foreground">
            <span className="truncate">{qty} × {product.name}</span>
            <span className="tabular-nums text-foreground">{fmt(priceFor(product) * qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
        <Row label="Subtotal" value={fmt(subtotal)} />
        <Row label={`Shipping (${shipping})`} value={fmt(shipCost)} />
        <Row label="GST (5%)" value={fmt(tax)} />
        <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Grand total</span>
          <span className="font-display text-2xl font-semibold text-gold">{fmt(grand)}</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        onClick={closeCheckout}
        className={`fixed inset-0 z-[80] bg-background/70 backdrop-blur-md transition-opacity duration-300 ${
          checkoutOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className={`fixed inset-0 z-[90] flex items-stretch justify-center p-0 sm:items-center sm:p-4 lg:p-6 transition-all duration-300 ${
          checkoutOpen ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
        }`}
      >
        <div className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden border border-border/60 bg-surface shadow-gold sm:h-auto sm:max-h-[92vh] sm:rounded-3xl">
          <header className="flex items-center justify-between border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-gold">Secure checkout</p>
              <h2 className="truncate font-display text-lg font-semibold tracking-tight sm:text-xl">
                Complete your order
              </h2>
            </div>
            <button
              onClick={closeCheckout}
              aria-label="Close checkout"
              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-border/60 text-muted-foreground hover:border-gold/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Stepper */}
          <div className="border-b border-border/60 px-5 py-3 sm:px-6 sm:py-4">
            <ol className="flex items-center gap-2 sm:gap-3">
              {["Cart", "Customer", "Shipping & Payment", "Done"].map((label, i) => {
                const done = step > i;
                const active = step === i;
                return (
                  <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
                    <div
                      className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[11px] font-semibold transition-all ${
                        done
                          ? "bg-gold-gradient text-background shadow-gold"
                          : active
                          ? "border border-gold/60 bg-gold/10 text-gold"
                          : "border border-border bg-surface-elevated text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span className={`hidden text-xs md:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                    {i < 3 && <span className={`h-px flex-1 ${done ? "bg-gold/60" : "bg-border"}`} />}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Mobile summary toggle */}
          {step !== 3 && items.length > 0 && (
            <div className="border-b border-border/60 bg-surface-elevated/50 lg:hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left"
              >
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <ShoppingBag className="h-4 w-4 text-gold" />
                  {summaryOpen ? "Hide" : "Show"} order summary · {totals.count} item{totals.count === 1 ? "" : "s"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-display text-base font-semibold text-gold">{fmt(grand)}</span>
                  {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>
              {summaryOpen && (
                <div className="border-t border-border/60 px-5 py-4">{Summary}</div>
              )}
            </div>
          )}

          {/* Body */}
          <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_360px]">
            <div className="overflow-y-auto px-5 py-6 sm:px-6">
              {step === 0 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <ShoppingBag className="h-4 w-4 text-gold" /> Review your system
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Confirm the items below before continuing to checkout.
                    </p>
                  </div>
                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/60 bg-surface-elevated/40 p-8 text-center">
                      <p className="font-display text-sm font-semibold">Your cart is empty</p>
                      <p className="mt-1 text-xs text-muted-foreground">Add hardware to continue.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {items.map(({ product, qty }) => (
                        <li
                          key={product.id}
                          className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface-elevated/60 p-3"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 flex-none rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-sm font-semibold">{product.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {qty} × {fmt(priceFor(product))}
                            </p>
                          </div>
                          <p className="font-display text-sm font-semibold tabular-nums">
                            {fmt(priceFor(product) * qty)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <User className="h-4 w-4 text-gold" /> Customer information
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We'll use these details to confirm and ship your order.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Full name" required value={name} onChange={setName}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      error={touched.name ? errors.name : ""}
                      placeholder="e.g. Ali Khan" autoComplete="name"
                    />
                    <Field
                      label="Email address" required type="email" value={email} onChange={setEmail}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      error={touched.email ? errors.email : ""}
                      placeholder="you@example.com" autoComplete="email"
                    />
                    <Field
                      label="Phone number" required type="tel" value={phone} onChange={setPhone}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      error={touched.phone ? errors.phone : ""}
                      placeholder="03xx-xxxxxxx" autoComplete="tel"
                    />
                    <Field
                      label="City" required value={city} onChange={setCity}
                      onBlur={() => setTouched((t) => ({ ...t, city: true }))}
                      error={touched.city ? errors.city : ""}
                      placeholder="e.g. Lahore" autoComplete="address-level2"
                    />
                    <Field
                      label="Detailed shipping address" required textarea value={address} onChange={setAddress}
                      onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                      error={touched.address ? errors.address : ""}
                      placeholder="House #, street, area, landmark…"
                      className="sm:col-span-2" autoComplete="street-address"
                    />
                    <Field
                      label="Permanent address" textarea value={permanentAddress} onChange={setPermanentAddress}
                      placeholder="Optional — if different from shipping"
                      className="sm:col-span-2"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <section>
                    <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
                      <Truck className="h-4 w-4 text-gold" /> Delivery & installation
                    </h3>
                    <p className="mb-4 text-xs text-muted-foreground">Choose how you'd like to receive your system.</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <ShipOption v="standard" cur={shipping} set={setShipping} title="Standard freight" sub="5–8 days · nationwide" price={2500} />
                      <ShipOption v="express" cur={shipping} set={setShipping} title="Express freight" sub="2–3 days · priority" price={4500} />
                      <ShipOption v="install" cur={shipping} set={setShipping} title="Install team" sub="Mount + commission" price={12500} />
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
                      <Wallet className="h-4 w-4 text-gold" /> Payment method
                    </h3>
                    <p className="mb-4 text-xs text-muted-foreground">Select your preferred way to pay.</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <PayOption v="bank" cur={pay} set={setPay} icon={<Banknote className="h-4 w-4" />} title="Direct Bank Transfer" sub="Meezan · HBL · UBL" />
                      <PayOption v="cod" cur={pay} set={setPay} icon={<ShieldCheck className="h-4 w-4" />} title="Cash on Delivery" sub="Verified before dispatch" />
                      <PayOption v="easypaisa" cur={pay} set={setPay} icon={<Smartphone className="h-4 w-4" />} title="EasyPaisa Wallet" sub="Instant confirmation" />
                      <PayOption v="jazzcash" cur={pay} set={setPay} icon={<Smartphone className="h-4 w-4" />} title="JazzCash Wallet" sub="Instant confirmation" />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border/60 bg-surface-elevated/40 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Shipping to</p>
                    <p className="mt-1 text-sm text-foreground">{name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{address || "—"}, {city || "—"}</p>
                    <p className="text-xs text-muted-foreground">{phone} · {email}</p>
                  </section>
                </div>
              )}

              {step === 3 && (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="relative mb-6 grid h-24 w-24 place-items-center rounded-full bg-gold-gradient shadow-gold animate-success-pop">
                    <svg viewBox="0 0 48 48" className="h-12 w-12">
                      <path
                        d="M12 24 L21 33 L36 16" fill="none"
                        stroke="oklch(0.18 0.02 260)" strokeWidth="4"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="48" className="animate-check-draw"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-semibold">Order confirmed</h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Thank you, {name || "customer"}. Order{" "}
                    <span className="font-mono text-gold">{orderId}</span> has been logged. Our team will reach out on{" "}
                    <span className="text-foreground">{phone}</span> shortly.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={downloadInvoice}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-5 py-2.5 text-xs font-semibold text-foreground hover:border-gold/50"
                    >
                      <Download className="h-3.5 w-3.5" /> Download invoice
                    </button>
                    <button
                      onClick={finish}
                      className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5"
                    >
                      Continue browsing
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary rail (desktop) */}
            {step !== 3 && (
              <aside className="hidden border-l border-border/60 bg-surface-elevated/60 px-6 py-6 lg:block">
                {Summary}
              </aside>
            )}
          </div>

          {/* Footer actions */}
          {step !== 3 && (
            <footer className="flex items-center justify-between gap-3 border-t border-border/60 bg-surface px-5 py-4 sm:px-6">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              {step < 2 ? (
                <button
                  onClick={next}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={confirm}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Placing…" : `Place order · ${fmt(grand)}`}{" "}
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </footer>
          )}
        </div>
      </div>
    </>
  );
}

function payLabel(p: Pay) {
  return p === "bank" ? "Direct Bank Transfer"
    : p === "cod" ? "Cash on Delivery"
    : p === "easypaisa" ? "EasyPaisa Wallet"
    : "JazzCash Wallet";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function Field({
  label, value, onChange, onBlur, error, placeholder, className = "",
  textarea = false, required = false, type = "text", autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  className?: string;
  textarea?: boolean;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const ring = error
    ? "border-destructive/70 focus:border-destructive focus:ring-destructive/20"
    : "border-border/60 focus:border-gold/60 focus:ring-gold/20";
  const base =
    `block w-full rounded-xl border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:ring-2 ${ring}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-gold">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id} value={value} rows={3}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
          placeholder={placeholder} autoComplete={autoComplete}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          id={id} type={type} value={value}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
          placeholder={placeholder} autoComplete={autoComplete}
          className={base}
        />
      )}
      {error && <p className="mt-1.5 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function ShipOption({
  v, cur, set, title, sub, price,
}: { v: "standard" | "express" | "install"; cur: string; set: (v: any) => void; title: string; sub: string; price: number }) {
  const active = cur === v;
  return (
    <button
      type="button"
      onClick={() => set(v)}
      className={`group relative flex flex-col rounded-2xl border p-4 text-left transition-all ${
        active ? "border-gold/60 bg-gold/5 shadow-gold" : "border-border/60 bg-surface hover:border-gold/40"
      }`}
    >
      <span className="pr-8 font-display text-sm font-semibold">{title}</span>
      <span className="mt-0.5 text-[11px] text-muted-foreground">{sub}</span>
      <span className="mt-2 font-display text-base font-semibold text-gold">{fmt(price)}</span>
      <span
        className={`absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border transition-all ${
          active ? "border-gold bg-gold-gradient" : "border-border"
        }`}
      >
        {active && <Check className="h-3 w-3 text-background" />}
      </span>
    </button>
  );
}

function PayOption({
  v, cur, set, title, sub, icon,
}: { v: Pay; cur: Pay; set: (v: Pay) => void; title: string; sub: string; icon: React.ReactNode }) {
  const active = cur === v;
  return (
    <button
      type="button"
      onClick={() => set(v)}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
        active ? "border-gold/60 bg-gold/5 shadow-gold" : "border-border/60 bg-surface hover:border-gold/40"
      }`}
    >
      <span className={`grid h-9 w-9 flex-none place-items-center rounded-full ${active ? "bg-gold-gradient text-background" : "bg-surface-elevated text-gold"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-semibold">{title}</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
      <span className={`grid h-5 w-5 flex-none place-items-center rounded-full border ${active ? "border-gold bg-gold-gradient" : "border-border"}`}>
        {active && <Check className="h-3 w-3 text-background" />}
      </span>
    </button>
  );
}
