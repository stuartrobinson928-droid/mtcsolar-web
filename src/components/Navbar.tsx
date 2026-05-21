import { useEffect, useState } from "react";
import { Sun, Moon, ShoppingCart } from "lucide-react";
import { useStore, useTheme } from "@/context/store";
import logoLight from "@/assets/mtc-logo-full.png";
import logoDark from "@/assets/mtc-logo-dark.png";

const links = [
  { href: "#panels", label: "Panels" },
  { href: "#inverters", label: "Inverters" },
  { href: "#batteries", label: "Storage" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { totals } = useStore();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
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
            aria-label="Cart"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-foreground transition-all hover:border-gold/50"
          >
            <ShoppingCart className="h-4 w-4" />
            {totals.count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 animate-gold-pulse place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-background shadow-gold">
                {totals.count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
