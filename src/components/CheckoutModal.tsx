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
    const html = buildInvoiceHTML({
      orderId, name, email, phone, address, city,
      items: items.map(({ product, qty }) => ({
        name: product.name, qty, unit: priceFor(product),
      })),
      subtotal, shipCost, shipping, tax, grand, pay,
    });
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${orderId}-invoice.html`; a.click();
      URL.revokeObjectURL(url);
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
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
                          className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface-elevated/60 p-3 sm:flex-row sm:items-center sm:gap-4"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 flex-none rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-sm font-semibold">{product.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {fmt(priceFor(product))} each · {fmt(priceFor(product) * qty)} total
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface p-0.5">
                              <button
                                onClick={() => remove(product.id)}
                                aria-label="Decrease quantity"
                                className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(product.id, parseInt(e.target.value, 10) || 0)}
                                className="w-9 bg-transparent text-center text-xs font-semibold tabular-nums focus:outline-none"
                              />
                              <button
                                onClick={() => setQty(product.id, qty + 1)}
                                aria-label="Increase quantity"
                                className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeAll(product.id)}
                              aria-label={`Remove ${product.name}`}
                              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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

// ─────────────────────────────────────────────────────────────
// Invoice HTML (matches MTC Solar PDF layout + "ECOMMERCE ORDERED" stamp)
// ─────────────────────────────────────────────────────────────
function numberToWordsPKR(n: number): string {
  if (!n || n <= 0) return "Zero Rupees Only";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x: number): string =>
    x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? " " + a[x % 10] : "");
  const three = (x: number): string => {
    const h = Math.floor(x / 100), r = x % 100;
    return (h ? a[h] + " Hundred" + (r ? " " : "") : "") + (r ? two(r) : "");
  };
  let num = Math.floor(n);
  const parts: string[] = [];
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000); num %= 100000;
  const thou = Math.floor(num / 1000); num %= 1000;
  const rest = num;
  if (crore) parts.push(three(crore) + " Crore");
  if (lakh) parts.push(two(lakh) + " Lakh");
  if (thou) parts.push(two(thou) + " Thousand");
  if (rest) parts.push(three(rest));
  return parts.join(" ").trim() + " Rupees Only";
}

interface InvoiceData {
  orderId: string;
  name: string; email: string; phone: string; address: string; city: string;
  items: Array<{ name: string; qty: number; unit: number }>;
  subtotal: number; shipCost: number; shipping: string; tax: number; grand: number;
  pay: Pay;
}

function buildInvoiceHTML(d: InvoiceData): string {
  const money = (n: number) => "Rs. " + n.toLocaleString("en-PK");
  const date = new Date().toLocaleDateString("en-GB");
  const totalQty = d.items.reduce((s, i) => s + i.qty, 0);
  const rows = d.items.map((it, i) => `
    <tr>
      <td>${i + 1}</td>
      <td class="left">${escapeHtml(it.name)}</td>
      <td>${it.qty}</td>
      <td class="right">${money(it.unit)}</td>
      <td class="right">${money(it.unit * it.qty)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>Invoice ${escapeHtml(d.orderId)} — MTC Solar</title>
<style>
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#f3f4f6;margin:0;padding:24px}
  .page{max-width:820px;margin:0 auto;background:#fff;padding:40px 44px;box-shadow:0 4px 24px rgba(0,0,0,.08);position:relative;overflow:hidden}
  .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #d4a017;padding-bottom:16px}
  .brand{font-family:Georgia,serif;font-size:28px;font-weight:700;color:#0b2a4a}
  .brand small{display:block;font-family:Arial;font-size:11px;color:#6b7280;font-weight:400;margin-top:4px}
  .title{text-align:right}
  .title h1{margin:0;font-size:26px;letter-spacing:3px;color:#0b2a4a}
  .paid{display:inline-block;border:2px solid #16a34a;color:#16a34a;font-weight:700;padding:2px 10px;border-radius:4px;margin-top:6px;font-size:12px;letter-spacing:2px}
  .meta{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:13px}
  .meta .box{background:#f9fafb;border-left:3px solid #d4a017;padding:10px 14px}
  .meta b{color:#0b2a4a}
  .addr{margin-top:18px;font-size:12px;color:#374151;line-height:1.55}
  .addr .row{margin-top:4px}
  .billto{margin-top:18px;background:#0b2a4a;color:#fff;padding:10px 14px;border-radius:4px;font-size:13px}
  .billto .lbl{font-size:10px;letter-spacing:2px;color:#d4a017;font-weight:700}
  table.items{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px}
  table.items th{background:#0b2a4a;color:#fff;padding:10px;text-align:center;font-weight:600}
  table.items td{padding:10px;border-bottom:1px solid #e5e7eb;text-align:center}
  table.items td.left{text-align:left}
  table.items td.right{text-align:right}
  .grid2{display:grid;grid-template-columns:1.2fr 1fr;gap:18px;margin-top:18px}
  .words{background:#fef3c7;border-left:4px solid #d4a017;padding:12px 14px;font-size:12px}
  .words .lbl{font-size:10px;letter-spacing:2px;color:#92400e;font-weight:700;margin-bottom:4px}
  .totals{border:1px solid #e5e7eb}
  .totals .r{display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;border-bottom:1px solid #f3f4f6}
  .totals .r:last-child{border-bottom:0}
  .totals .grand{background:#0b2a4a;color:#fff;font-weight:700;font-size:15px}
  .totals .paidrow{background:#dcfce7;color:#166534;font-weight:600}
  .banks{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .bank{border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;font-size:12px}
  .bank h4{margin:0;background:#0b2a4a;color:#fff;padding:8px 12px;font-size:12px;letter-spacing:1px}
  .bank .row{display:flex;justify-content:space-between;padding:6px 12px;border-top:1px solid #f3f4f6}
  .bank .row b{color:#0b2a4a;font-weight:600}
  .terms{margin-top:20px;font-size:11px;color:#4b5563;line-height:1.6}
  .terms h4{font-size:12px;letter-spacing:2px;color:#0b2a4a;margin:0 0 6px}
  .sig{margin-top:24px;display:flex;justify-content:space-between;font-size:11px;color:#6b7280;border-top:1px dashed #d1d5db;padding-top:14px}
  .foot{margin-top:18px;text-align:center;font-size:11px;color:#6b7280;border-top:2px solid #d4a017;padding-top:10px}
  .stamp{position:absolute;top:38%;right:8%;transform:rotate(-18deg);border:4px double #16a34a;color:#16a34a;padding:10px 22px;font-weight:800;font-size:22px;letter-spacing:4px;border-radius:8px;opacity:.85;font-family:Arial;pointer-events:none;text-transform:uppercase}
  .stamp small{display:block;font-size:10px;letter-spacing:3px;text-align:center;margin-top:2px;font-weight:600}
  .actions{max-width:820px;margin:0 auto 16px;display:flex;gap:8px;justify-content:flex-end}
  .actions button{background:#0b2a4a;color:#fff;border:0;padding:8px 18px;border-radius:4px;cursor:pointer;font-size:13px}
  @media print{body{background:#fff;padding:0}.page{box-shadow:none;padding:24px}.actions{display:none}}
</style></head>
<body>
  <div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div>
  <div class="page">
    <div class="stamp">Ecommerce Ordered<small>${escapeHtml(d.orderId)}</small></div>

    <div class="top">
      <div>
        <div class="brand">MTC Solar<small>Solar Panels • Inverters • Batteries • Energy Solutions</small></div>
      </div>
      <div class="title">
        <h1>SALE INVOICE</h1>
        <div class="paid">PAID</div>
      </div>
    </div>

    <div class="meta">
      <div class="box"><b>Invoice #</b> ${escapeHtml(d.orderId)}</div>
      <div class="box"><b>Date</b> ${date}</div>
      <div class="box"><b>Payment</b> ${escapeHtml(payLabel(d.pay).toUpperCase())}</div>
      <div class="box"><b>Shipping</b> ${escapeHtml(d.shipping.toUpperCase())}</div>
    </div>

    <div class="addr">
      <div class="row"><b>PK Office:</b> Shop No 5, Ground Floor Mall Mansion, 30 Mall Road, Opp. State Bank of Pakistan, Lahore, PK</div>
      <div class="row"><b>CN Office:</b> 7th Floor, Building 1, Intelligent Park, New Energy Road, Baolong Street, Longgang, Shenzhen, CN</div>
      <div class="row">+92 321 8347174 • awaismalik.mtc1@gmail.com</div>
    </div>

    <div class="billto">
      <div class="lbl">BILL TO</div>
      <div><b>${escapeHtml(d.name)}</b> • ${escapeHtml(d.phone)} • ${escapeHtml(d.email)}</div>
      <div style="font-size:12px;opacity:.9;margin-top:2px">${escapeHtml(d.address)}, ${escapeHtml(d.city)}</div>
    </div>

    <table class="items">
      <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="grid2">
      <div class="words">
        <div class="lbl">AMOUNT IN WORDS</div>
        ${escapeHtml(numberToWordsPKR(d.grand))}
      </div>
      <div class="totals">
        <div class="r"><span>Items / Qty</span><span>${d.items.length} / ${totalQty}</span></div>
        <div class="r"><span>Subtotal</span><span>${money(d.subtotal)}</span></div>
        <div class="r"><span>Shipping (${escapeHtml(d.shipping)})</span><span>${money(d.shipCost)}</span></div>
        <div class="r"><span>GST (5%)</span><span>${money(d.tax)}</span></div>
        <div class="r grand"><span>Grand Total</span><span>${money(d.grand)}</span></div>
        <div class="r paidrow"><span>Paid</span><span>${money(d.grand)}</span></div>
        <div class="r"><span>Balance Due</span><span>Rs. 0</span></div>
      </div>
    </div>

    <div class="banks">
      <div class="bank">
        <h4>BANK DETAILS — MEEZAN BANK</h4>
        <div class="row"><b>Title</b><span>MUHAMMAD AWAIS TALIB</span></div>
        <div class="row"><b>A/C #</b><span>02300103300491</span></div>
        <div class="row"><b>IBAN</b><span>PK57MEZN0002300103300491</span></div>
        <div class="row"><b>Branch</b><span>Hall Road, Lahore</span></div>
      </div>
      <div class="bank">
        <h4>BANK DETAILS — BANK ALFALAH</h4>
        <div class="row"><b>Title</b><span>MTC SOLAR</span></div>
        <div class="row"><b>A/C #</b><span>03701008467343</span></div>
        <div class="row"><b>IBAN</b><span>PK54ALFH0370001008467343</span></div>
        <div class="row"><b>Branch</b><span>Hall Road, Lahore</span></div>
      </div>
    </div>

    <div class="terms">
      <h4>TERMS &amp; CONDITIONS</h4>
      <ol style="margin:0;padding-left:18px">
        <li>All goods remain the property of MTC Solar until full payment is received.</li>
        <li>Prices are subject to change without prior notice; quotations valid for 15 days only.</li>
        <li>Responsibility for goods ceases upon handover to the carrier/transporter.</li>
        <li>Any claims for damage, shortage, or loss must be lodged with the transporter directly.</li>
        <li>Cartage, freight, and forwarding charges are on the buyer's account unless agreed otherwise.</li>
        <li>No returns or exchanges after 7 days of delivery unless goods are defective.</li>
        <li>Warranty claims require original invoice and are subject to manufacturer terms.</li>
        <li>This invoice is electronically generated and is valid without signature.</li>
      </ol>
    </div>

    <div class="sig"><span>Created By: MTC Solar E-Commerce</span><span>Authorized Signature ____________________</span></div>
    <div class="foot">MTC Solar • +92 321 8347174 • awaismalik.mtc1@gmail.com — Thank you for your business!</div>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));
}
