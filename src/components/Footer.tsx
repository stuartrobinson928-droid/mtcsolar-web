import { useTheme } from "@/context/store";
import logoLight from "@/assets/mtc-logo-full.png";
import logoDark from "@/assets/mtc-logo-dark.png";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <img
          src={theme === "dark" ? logoDark : logoLight}
          alt="MTC Solar"
          className="h-10 w-auto"
        />
        <p className="text-xs text-muted-foreground">
          © 2026 MTC Solar · Engineered solar hardware, shipped worldwide.
        </p>
      </div>
    </footer>
  );
}
