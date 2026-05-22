import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useTheme } from "@/context/store";
import logoLight from "@/assets/mtc-logo-full.png";
import logoDark from "@/assets/mtc-logo-dark.png";

const products = [
  { label: "Solar Panels", href: "#panels" },
  { label: "Hybrid Inverters", href: "#inverters" },
  { label: "On-Grid Inverters", href: "#inverters" },
  { label: "Lithium Batteries", href: "#batteries" },
];

const corporate = [
  { label: "Customer Support", href: "#contact" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Admin Portal", href: "/admin" },
];

const socials = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: MessageCircle, href: "#", label: "WhatsApp" },
];

const linkClass =
  "text-sm text-muted-foreground transition-colors duration-200 hover:text-gold";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer id="contact" className="relative mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src={theme === "dark" ? logoDark : logoLight}
              alt="MTC Solar"
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Engineered solar hardware for serious homes and industries — sized, shipped, supported.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-all duration-200 hover:border-gold/50 hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
              Core Products
            </h3>
            <ul className="mt-5 space-y-3">
              {products.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
              Corporate
            </h3>
            <ul className="mt-5 space-y-3">
              {corporate.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
              Store Info
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+923000000000" className="transition-colors hover:text-gold">
                  +92 300 000 0000
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:hello@mtcsolar.pk" className="transition-colors hover:text-gold">
                  hello@mtcsolar.pk
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>MTC Solar HQ, Main Boulevard, Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 MTC Solar. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative grid h-2.5 w-2.5 place-items-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>System Status: <span className="font-medium text-emerald-400">Optimal</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
