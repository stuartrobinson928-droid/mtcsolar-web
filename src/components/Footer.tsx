import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-gradient">
            <Zap className="h-4 w-4 text-background" strokeWidth={2.5} />
          </span>
          Helios<span className="text-gold">.</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 Helios Energy Systems · Engineered solar hardware, shipped worldwide.
        </p>
      </div>
    </footer>
  );
}
