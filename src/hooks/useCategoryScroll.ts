

import { useRef, useEffect, useState, useCallback } from "react";

const CARD_WIDTH = 276;
const GAP = 16;
const SCROLL_AMOUNT = CARD_WIDTH + GAP;

export function useCategoryScroll(categoriesLength: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const startAutoPlay = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (autoRef.current) clearInterval(autoRef.current);
    
    autoRef.current = setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
      }
      setTimeout(checkScroll, 350);
    }, 6000);
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();
    if (categoriesLength > 0) {
      startAutoPlay();
    }
    return () => stopAuto();
  }, [categoriesLength, startAutoPlay, checkScroll]);

  const handleManualScroll = (dir: "left" | "right") => {
    stopAuto();
    scroll(dir);
    startAutoPlay();
  };

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    checkScroll,
    stopAuto,
    startAutoPlay,
    handleManualScroll,
  };
}