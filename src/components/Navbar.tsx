import { useEffect, useRef, useState } from "react";
import { Sun, Moon, ShoppingCart, User, ShieldCheck, LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useStore, useTheme } from "@/context/store";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/products.functions";
import logoLight from "@/assets/mtc-logo-full.png";
import logoDark from "@/assets/mtc-logo-dark.png";

const links = [
  { href: "#panels", label: "Panels" },
  { href: "#inverters", label: "Inverters" },
  { href: "#batteries", label: "Storage" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { totals, toggleCart, bounceKey } = useStore();
  const { theme, toggle } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });
  const [activeHash, setActiveHash] = useState<string>("");
  const navigate = useNavigate();
  const isAdminFn = useServerFn(checkIsAdmin);
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const refresh = async (session: { user: { email?: string | null } } | null) => {
      if (!session) {
        if (mounted) { setUser(null); setIsAdmin(false); }
        return;
      }
      if (mounted) setUser({ email: session.user.email ?? null });
      try {
        const res = await isAdminFn({});
        if (mounted) setIsAdmin(!!res.isAdmin);
      } catch {
        if (mounted) setIsAdmin(false);
      }
    };
    supabase.auth.getSession().then(({ data }) => refresh(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => refresh(session));
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [isAdminFn]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Track active section
      let current = "";
      for (const l of links) {
        const el = document.querySelector(l.href);
        if (el) {
          const r = (el as HTMLElement).getBoundingClientRect();
          if (r.top <= 140 && r.bottom > 140) current = l.href;
        }
      }
      setActiveHash(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Position pill on active link when no hover
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeHash) { setPill((p) => ({ ...p, opacity: 0 })); return; }
    const el = nav.querySelector<HTMLAnchorElement>(`a[data-href="${activeHash}"]`);
    if (!el) return;
    const nr = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ left: r.left - nr.left, width: r.width, opacity: 1 });
  }, [activeHash, scrolled]);

  const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    setPill({ left: r.left - nr.left, width: r.width, opacity: 1 });
  };
  const onLeaveNav = () => {
    if (!activeHash) setPill((p) => ({ ...p, opacity: 0 }));
    else {
      const nav = navRef.current;
      const el = nav?.querySelector<HTMLAnchorElement>(`a[data-href="${activeHash}"]`);
      if (el && nav) {
        const r = el.getBoundingClientRect();
        const nr = nav.getBoundingClientRect();
        setPill({ left: r.left - nr.left, width: r.width, opacity: 1 });
      }
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "glass border-b border-border/40 py-2.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center">
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="MTC Solar"
            className={`w-auto transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`}
          />
        </a>

        <nav
          ref={navRef}
          onMouseLeave={onLeaveNav}
          className="relative hidden items-center gap-1 md:flex"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-gold/15 ring-1 ring-gold/30 transition-all duration-300 ease-out"
            style={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
          />
          {links.map((l) => {
            const active = activeHash === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                data-href={l.href}
                onMouseEnter={onEnter}
                className={`relative z-10 px-4 py-2 text-sm transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-muted-foreground transition-all hover:text-foreground hover:border-gold/50"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleCart}
            aria-label="Cart"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-foreground transition-all hover:border-gold/50"
          >
            <span key={`icon-${bounceKey}`} className="inline-flex animate-cart-bounce">
              <ShoppingCart className="h-4 w-4" />
            </span>
            {totals.count > 0 && (
              <span
                key={`badge-${bounceKey}`}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 animate-cart-bounce place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-background shadow-gold"
              >
                {totals.count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
