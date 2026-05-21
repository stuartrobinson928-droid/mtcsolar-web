import { ArrowRight, Sun, Zap, Battery } from "lucide-react";
import { useStore } from "@/context/store";

export function SummaryBar() {
  const { totals, clear } = useStore();
  const visible = totals.count > 0;

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border/60 glass px-3 py-2 shadow-gold">
        <div className="hidden items-center gap-4 px-2 text-xs sm:flex">
          {totals.panels > 0 && (
            <Chip icon={<Sun className="h-3.5 w-3.5" />} label={`${totals.panels} Panels`} />
          )}
          {totals.inverters > 0 && (
            <Chip icon={<Zap className="h-3.5 w-3.5" />} label={`${totals.inverters} Inverter${totals.inverters > 1 ? "s" : ""}`} />
          )}
          {totals.batteries > 0 && (
            <Chip icon={<Battery className="h-3.5 w-3.5" />} label={`${totals.batteries} Battery`} />
          )}
          <span className="ml-1 border-l border-border/60 pl-4 text-muted-foreground">
            Est. <span className="font-display text-sm font-semibold text-foreground">{totals.kw.toFixed(1)} kW</span>
          </span>
        </div>
        <button
          onClick={clear}
          className="hidden rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground sm:inline"
        >
          Clear
        </button>
        <button className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5">
          Checkout
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/80 px-2.5 py-1 text-[11px] font-medium text-foreground">
      <span className="text-gold">{icon}</span> {label}
    </span>
  );
}
