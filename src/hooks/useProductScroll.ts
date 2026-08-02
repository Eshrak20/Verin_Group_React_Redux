// src/hooks/useProductScroll.ts

import { useRef, useState, useEffect, useCallback } from "react";

const VISIBLE = 5;
const GAP = 12;

export function useProductScroll(productCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCardWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 170;
    const currentVisible = window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : VISIBLE;
    return (el.clientWidth - GAP * (currentVisible - 1)) / currentVisible;
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = getCardWidth();
    el.scrollBy({
      left: dir === "left" ? -(cardWidth + GAP) : cardWidth + GAP,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  }, [checkScroll, getCardWidth]);

  const stopAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    autoRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: getCardWidth() + GAP, behavior: "smooth" });
      }
      setTimeout(checkScroll, 350);
    }, 7000);
  }, [checkScroll, getCardWidth, stopAuto]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    if (productCount > 0) startAuto();
    return stopAuto;
  }, [productCount, checkScroll, startAuto, stopAuto]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight: canScrollRight && productCount > VISIBLE,
    checkScroll,
    scroll,
    stopAuto,
    startAuto,
    VISIBLE,
  };
}