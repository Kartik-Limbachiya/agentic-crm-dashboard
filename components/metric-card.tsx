"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  trend: "up" | "down" | "flat"
  trendValue: string
  icon: React.ComponentType<{ className?: string }>
  color: "success" | "warning" | "destructive"
  data: number[]
}

const colorClasses = {
  success: {
    icon: "text-success",
    bg: "bg-success/10",
    bar: "bg-success",
    trend: "text-success",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/10",
    bar: "bg-warning",
    trend: "text-warning",
  },
  destructive: {
    icon: "text-destructive",
    bg: "bg-destructive/10",
    bar: "bg-destructive",
    trend: "text-destructive",
  },
}

function SimpleSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-0.5 h-12">
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100
        return (
          <div
            key={index}
            className={cn("flex-1 rounded-t transition-all", color)}
            style={{ height: `${Math.max(height, 10)}%`, opacity: 0.3 + (index / data.length) * 0.7 }}
          />
        )
      })}
    </div>
  )
}

export function MetricCard({ title, value, trend, trendValue, icon: Icon, color, data }: MetricCardProps) {
  const colors = colorClasses[color]

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
            <Icon className={cn("h-5 w-5", colors.icon)} />
          </div>
        </div>

        <SimpleSparkline data={data} color={colors.bar} />

        <div className="flex items-center gap-1 mt-3">
          {trend === "up" && <TrendingUp className={cn("h-4 w-4", colors.trend)} />}
          {trend === "down" && <TrendingDown className={cn("h-4 w-4", colors.trend)} />}
          {trend === "flat" && <Minus className={cn("h-4 w-4", colors.trend)} />}
          <span className={cn("text-sm font-medium", colors.trend)}>{trendValue}</span>
          <span className="text-sm text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  )
}
