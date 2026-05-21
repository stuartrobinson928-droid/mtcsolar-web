import { useEffect, useRef, useState, type ReactNode } from "react";

export function Carousel({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [centerIdx, setCenterIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const r = c as HTMLElement;
        const mid = r.offsetLeft + r.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setCenterIdx(best);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 py-2"
      style={{ scrollBehavior: "smooth" }}
    >
      {children.map((c, i) => (
        <div
          key={i}
          className={`shrink-0 snap-center transition-transform duration-500 ease-out ${
            i === centerIdx ? "scale-[1.02]" : "scale-100 opacity-80"
          }`}
          style={{ width: "min(320px, 80vw)" }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}
