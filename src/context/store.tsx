import { createContext, useContext, useMemo, useReducer, useEffect, type ReactNode } from "react";

export type Category = "panel" | "inverter" | "battery";
export interface Product {
  id: string;
  name: string;
  category: Category;
  watts?: number; // panel: per panel watt; inverter: kW*1000; battery: Wh
  tags: string[];
  image: string;
  series?: string;
}

interface CartItem { product: Product; qty: number }
interface State { items: Record<string, CartItem> }
type Action =
  | { type: "add"; product: Product }
  | { type: "remove"; id: string }
  | { type: "clear" };

const initial: State = { items: {} };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const cur = state.items[action.product.id];
      return { items: { ...state.items, [action.product.id]: { product: action.product, qty: (cur?.qty ?? 0) + 1 } } };
    }
    case "remove": {
      const cur = state.items[action.id];
      if (!cur) return state;
      const next = { ...state.items };
      if (cur.qty <= 1) delete next[action.id];
      else next[action.id] = { ...cur, qty: cur.qty - 1 };
      return { items: next };
    }
    case "clear":
      return { items: {} };
  }
}

interface Ctx {
  state: State;
  add: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  totals: { panels: number; inverters: number; batteries: number; kw: number; count: number };
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const totals = useMemo(() => {
    let panels = 0, inverters = 0, batteries = 0, panelW = 0, inverterW = 0;
    for (const { product, qty } of Object.values(state.items)) {
      if (product.category === "panel") { panels += qty; panelW += (product.watts ?? 0) * qty; }
      if (product.category === "inverter") { inverters += qty; inverterW += (product.watts ?? 0) * qty; }
      if (product.category === "battery") { batteries += qty; }
    }
    const kw = Math.max(panelW, inverterW) / 1000;
    return { panels, inverters, batteries, kw, count: panels + inverters + batteries };
  }, [state]);

  const value: Ctx = {
    state,
    add: (p) => dispatch({ type: "add", product: p }),
    remove: (id) => dispatch({ type: "remove", id }),
    clear: () => dispatch({ type: "clear" }),
    totals,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

// Theme
type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, dispatch] = useReducer(
    (s: Theme) => (s === "dark" ? "light" : "dark"),
    "dark" as Theme,
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return <ThemeCtx.Provider value={{ theme, toggle: () => dispatch() }}>{children}</ThemeCtx.Provider>;
}
export function useTheme() {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme outside provider");
  return c;
}
