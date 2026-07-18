/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

interface ActiveCategoryContextType {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const ActiveCategoryContext = createContext<ActiveCategoryContextType | undefined>(undefined);

export function ActiveCategoryProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  return (
    <ActiveCategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
      {children}
    </ActiveCategoryContext.Provider>
  );
}

export const useActiveCategory = () => {
  const context = useContext(ActiveCategoryContext);
  if (!context) throw new Error("useActiveCategory must be used within an ActiveCategoryProvider");
  return context;
};