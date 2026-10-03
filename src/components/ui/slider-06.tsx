"use client";

import React, { useRef, useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider-06-utils/slider";
import NumberFlow from "@number-flow/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/slider-06-utils/button";
import { cn } from "@/lib/utils";

export interface Slider06Props {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onValueChange?: (val: [number, number]) => void;
  className?: string;
  label?: string;
}

export default function Slider06({
  min = 0,
  max = 1000,
  step = 10,
  value: controlledValue,
  onValueChange: controlledOnChange,
  className = "",
  label = "Price Range",
}: Slider06Props) {
  const MIN = min;
  const MAX = Math.max(min + step, max);
  const STEP = step;
  const STEPS = 5;

  const LABELS: number[] = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < STEPS; i++) {
      const rawVal = MIN + (i * (MAX - MIN)) / (STEPS - 1);
      const roundedVal = Math.round((rawVal - MIN) / STEP) * STEP + MIN;
      if (!list.includes(roundedVal)) {
        list.push(roundedVal);
      }
    }
    return list;
  }, [MIN, MAX, STEP]);

  const defaultLow = Math.max(
    MIN,
    Math.min(MAX, Math.round((MIN + (MAX - MIN) * 0.15) / STEP) * STEP),
  );
  const defaultHigh = Math.max(
    MIN,
    Math.min(MAX, Math.round((MIN + (MAX - MIN) * 0.65) / STEP) * STEP),
  );

  const [internalRange, setInternalRange] = useState<number[]>([defaultLow, defaultHigh]);
  const [preview, setPreview] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const range = controlledValue ?? internalRange;
  const setRange = (newRange: number[]) => {
    if (controlledOnChange) {
      controlledOnChange([newRange[0], newRange[1]]);
    } else {
      setInternalRange(newRange);
    }
  };

  const [low, high] = Array.isArray(range) && range.length >= 2 ? range : [MIN, MAX];
  const safeLow = typeof low === 'number' && !isNaN(low) && isFinite(low) ? low : MIN;
  const safeHigh = typeof high === 'number' && !isNaN(high) && isFinite(high) ? high : MAX;
  const isDefault = safeLow === MIN && safeHigh === MAX;

  const toPct = (v: number) => {
    if (MAX === MIN) return 0;
    return ((v - MIN) / (MAX - MIN)) * 100;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const raw = ((e.clientX - rect.left) / rect.width) * (MAX - MIN) + MIN;
    setPreview(
      Math.max(MIN, Math.min(MAX, Math.round((raw - MIN) / STEP) * STEP + MIN)),
    );
  };

  const lowPct = toPct(safeLow);
  const highPct = toPct(safeHigh);
  const previewPct = preview !== null ? toPct(preview) : null;

  let ghostLeft = 0;
  let ghostWidth = 0;
  if (previewPct !== null) {
    if (previewPct < lowPct) {
      ghostLeft = previewPct;
      ghostWidth = lowPct - previewPct;
    } else if (previewPct > highPct) {
      ghostLeft = highPct;
      ghostWidth = previewPct - highPct;
    }
  }

  return (
    <div className={cn("w-full max-w-sm mx-auto space-y-5", className)}>
      {/* Header — label + price + clear all in one row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tabular-nums text-foreground">
              $<NumberFlow value={safeLow} />
            </span>
            <span className="text-muted-foreground">–</span>
            <span className="text-xl font-bold tabular-nums text-foreground">
              $<NumberFlow value={safeHigh} />
            </span>
          </div>
        </div>

        {/* Proper clear button — only visible when range is not default */}
        <Button
          variant="outline"
          size="xs"
          onClick={() => setRange([MIN, MAX])}
          disabled={isDefault}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <X className="size-3 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        <div
          ref={rootRef}
          className="relative w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPreview(null)}
        >
          <Slider
            value={range}
            onValueChange={(val) => setRange(Array.isArray(val) ? val : [val])}
            min={MIN}
            max={MAX}
            step={STEP}
            className="**:[[role=slider]]:transition-transform **:[[role=slider]]:hover:scale-125 **:data-[slot='slider-track']:h-2! **:data-[slot='slider-thumb']:size-5! **:data-[slot='slider-thumb']:border-2! **:data-[slot='slider-thumb']:border-primary! **:data-[slot='slider-thumb']:bg-background! **:data-[slot='slider-thumb']:shadow-md **:data-[slot='slider-thumb']:z-2"
          />

          {previewPct !== null && ghostWidth > 0 && (
            <div
              className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary/30 transition-[left,width] duration-75 z-1"
              style={{ left: `${ghostLeft}%`, width: `${ghostWidth}%` }}
            />
          )}
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[11px] font-medium text-muted-foreground/60 select-none">
          {LABELS.map((val) => (
            <span key={val}>${val.toLocaleString()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
