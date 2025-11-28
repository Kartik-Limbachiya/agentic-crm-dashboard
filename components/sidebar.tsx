"use client"

import { useEffect, useRef } from "react"
import { LayoutDashboard, Calendar, Send, BarChart3, History, Zap, X, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LogEntry } from "@/lib/types"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  logs: LogEntry[]
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "planner", label: "Planner", icon: Calendar },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "execution", label: "Execution", icon: Send },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "history", label: "History", icon: History },
]

const logTypeColors: Record<string, string> = {
  info: "text-primary",
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
}

export function Sidebar({ activeTab, setActiveTab, logs, isOpen, onClose }: SidebarProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Agentic CRM</h1>
            <p className="text-xs text-sidebar-foreground/60">AI Campaign Manager</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 hover:bg-sidebar-accent rounded">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                onClose()
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Agent Log Console */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">Agent Log</span>
        </div>
        <div className="h-48 overflow-y-auto log-scrollbar bg-sidebar-accent/50 rounded-lg p-3 space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="text-xs font-mono">
              <span className={cn("font-medium", logTypeColors[log.type || "info"])}>[{log.timestamp}]</span>{" "}
              <span className="text-sidebar-foreground/80">{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </aside>
  )
}
