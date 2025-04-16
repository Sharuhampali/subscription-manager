"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface MeteorsProps {
  number?: number
  className?: string
}

export const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<{ id: number; top: string; left: string; animationDelay: string; size: string }>>([])

  useEffect(() => {
    const styles = [...Array(number)].map((_, i) => ({
      id: i,
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      animationDelay: Math.random() * 10 + "s",
      size: Math.floor(Math.random() * 20 + 10) + "px",
    }))
    setMeteorStyles(styles)
  }, [number])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteorStyles.map((style) => (
        <span
          key={style.id}
          className="absolute inline-flex h-0.5 w-0.5 animate-meteor rounded-[9999px] bg-primary opacity-50 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: style.top,
            left: style.left,
            width: style.size,
            height: style.size,
            animationDelay: style.animationDelay,
            animationDuration: Math.floor(Math.random() * 10 + 5) + "s",
          }}
        >
          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[1px] w-[50px] -rotate-45 bg-gradient-to-r from-transparent to-primary opacity-30"></span>
        </span>
      ))}
    </div>
  )
}
