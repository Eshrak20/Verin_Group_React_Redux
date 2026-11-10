import { formatPrice } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  currentMin?: string;
  currentMax?: string;
  onPriceChange: (min: string, max: string) => void;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  currentMin,
  currentMax,
  onPriceChange,
}) => {
  const rangeMin = Number.isFinite(min) ? min : 0;
  const rangeMax = Math.max(rangeMin + 1, Number.isFinite(max) ? max : rangeMin + 1);

  const parsedMin = currentMin !== undefined && currentMin !== "" ? Number(currentMin) : rangeMin;
  const parsedMax = currentMax !== undefined && currentMax !== "" ? Number(currentMax) : rangeMax;

  const initialMin = Math.min(rangeMax - 1, Math.max(rangeMin, Number.isFinite(parsedMin) ? parsedMin : rangeMin));
  const initialMax = Math.max(
    initialMin + 1,
    Math.min(rangeMax, Number.isFinite(parsedMax) ? parsedMax : rangeMax)
  );

  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(Math.max(initialMin + 1, initialMax));
  const valuesRef = useRef({ min: initialMin, max: Math.max(initialMin + 1, initialMax) });

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(rangeMin, Math.min(Number(e.target.value), valuesRef.current.max - 1));
    valuesRef.current = { ...valuesRef.current, min: value };
    setMinValue(value);
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(rangeMax, Math.max(Number(e.target.value), valuesRef.current.min + 1));
    valuesRef.current = { ...valuesRef.current, max: value };
    setMaxValue(value);
  };

  const handleMouseUpOrTouchEnd = () => {
    onPriceChange(String(valuesRef.current.min), String(valuesRef.current.max));
  };

  const minPercent = ((minValue - rangeMin) / (rangeMax - rangeMin)) * 100;
  const maxPercent = ((maxValue - rangeMin) / (rangeMax - rangeMin)) * 100;

  const thumbClasses = 
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-elec [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:cursor-grabbing " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-elec [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:cursor-grabbing";

  return (
    <div className="w-full min-w-0 max-w-full space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
          Price Range
        </h3>
      </div>

      <div className="relative flex h-6 w-full min-w-0 max-w-full items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-muted" />
        
        <div
          className="absolute h-1.5 rounded-full bg-elec"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={minValue}
          onChange={handleMinSliderChange}
          onMouseUp={handleMouseUpOrTouchEnd}
          onTouchEnd={handleMouseUpOrTouchEnd}
          onKeyUp={handleMouseUpOrTouchEnd}
          aria-label="Minimum price"
          className={`pointer-events-none absolute inset-x-0 m-0 block h-6 w-full min-w-0 max-w-full appearance-none bg-transparent ${thumbClasses}`}
        />

        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={maxValue}
          onChange={handleMaxSliderChange}
          onMouseUp={handleMouseUpOrTouchEnd}
          onTouchEnd={handleMouseUpOrTouchEnd}
          onKeyUp={handleMouseUpOrTouchEnd}
          aria-label="Maximum price"
          className={`pointer-events-none absolute inset-x-0 m-0 block h-6 w-full min-w-0 max-w-full appearance-none bg-transparent ${thumbClasses}`}
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-foreground shadow-sm">
          ৳{formatPrice(minValue)}
        </div>
        <span>to</span>
        <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-foreground shadow-sm">
          ৳{formatPrice(maxValue)}
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;