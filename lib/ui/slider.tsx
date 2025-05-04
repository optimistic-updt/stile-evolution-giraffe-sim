"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number[]
  onValueChange: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min, max, step, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseFloat(e.target.value)
      onValueChange([newValue])
    }

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100">
          <div
            className="absolute h-full bg-[#00E676]"
            style={{
              width: `${(((value[0] || 0) - (min || 0)) / ((max || 100) - (min || 0))) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <div
          className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-[#00E676] bg-white"
          style={{
            left: `calc(${(((value[0] || 0) - (min || 0)) / ((max || 100) - (min || 0))) * 100}% - 10px)`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
    )
  },
)

Slider.displayName = "Slider"

export { Slider }
