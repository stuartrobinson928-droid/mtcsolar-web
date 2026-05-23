import { useEffect, useState } from "react";

const sections = [
  { id: "panels", label: "Panels" },
  { id: "inverters", label: "Inverters" },
  { id: "batteries", label: "Storage" },
  { id: "contact", label: "Contact" },
];

export function SideNav() {
  const [active, setActive] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
      let current = "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 160 && r.bottom > 160) current = s.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside
      aria-label="Section navigation"
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-full border border-gold/40 bg-surface/70 px-2 py-3 shadow-gold backdrop-blur-md transition-all duration-500 md:flex ${
        visible ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-4"
      }`}
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            aria-label={s.label}
            className="group relative grid h-4 w-4 place-items-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-3.5 w-3.5 bg-gold-gradient shadow-gold ring-2 ring-gold/40 animate-gold-pulse"
                  : "h-2 w-2 bg-gold/50 group-hover:h-3 group-hover:w-3 group-hover:bg-gold group-hover:shadow-gold"
              }`}
            />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-gold/40 bg-surface/95 px-2 py-1 text-xs font-medium text-gold opacity-0 shadow-gold backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
              {s.label}
            </span>
          </button>
        );
      })}
    </aside>

  );
}
