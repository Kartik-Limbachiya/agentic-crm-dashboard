"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Linkedin, Youtube, AtSign, CalendarDays, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CampaignData, Post } from "@/lib/types"

interface CalendarTabProps {
  campaignData: CampaignData | null
  updatePost: (index: number, updatedPost: Partial<Post>) => void
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Threads: AtSign,
}

const platformColors: Record<string, string> = {
  LinkedIn: "bg-blue-600",
  YouTube: "bg-red-600",
  Threads: "bg-foreground",
}

export function CalendarTab({ campaignData, updatePost }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }, [currentDate])

  const scheduledPosts = useMemo(() => {
    if (!campaignData?.plan) return {}

    const posts: Record<string, Post[]> = {}
    campaignData.plan.forEach((post) => {
      if (post.scheduledDate) {
        if (!posts[post.scheduledDate]) {
          posts[post.scheduledDate] = []
        }
        posts[post.scheduledDate].push(post)
      }
    })
    return posts
  }, [campaignData])

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    return `${year}-${month}-${dayStr}`
  }

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (!campaignData || campaignData.plan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Scheduled Posts</h2>
        <p className="text-muted-foreground max-w-md">
          Generate a campaign plan first to see scheduled posts on the calendar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Campaign Calendar</h1>
        <p className="text-muted-foreground mt-1">View and manage your scheduled posts</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="xl:col-span-2 border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day, index) => {
                const dateKey = day ? formatDateKey(day) : ""
                const postsForDay = day ? scheduledPosts[dateKey] || [] : []
                const hasPost = postsForDay.length > 0

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[80px] p-2 rounded-lg border transition-colors",
                      day ? "border-border hover:border-primary/50 cursor-pointer" : "border-transparent",
                      isToday(day || 0) && "bg-primary/5 border-primary",
                      hasPost && "bg-muted/50",
                    )}
                  >
                    {day && (
                      <>
                        <span className={cn("text-sm font-medium", isToday(day) ? "text-primary" : "text-foreground")}>
                          {day}
                        </span>
                        {/* Post indicators */}
                        <div className="mt-1 space-y-1">
                          {postsForDay.slice(0, 2).map((post, i) => {
                            const Icon = platformIcons[post.platform] || AtSign
                            const bgColor = platformColors[post.platform] || "bg-gray-500"
                            return (
                              <div key={i} className="flex items-center gap-1 text-xs">
                                <div className={cn("w-4 h-4 rounded flex items-center justify-center", bgColor)}>
                                  <Icon className="h-2.5 w-2.5 text-white" />
                                </div>
                                <span className="truncate text-muted-foreground">{post.scheduledTime}</span>
                              </div>
                            )
                          })}
                          {postsForDay.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{postsForDay.length - 2} more</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Posts List */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaignData.plan.map((post, index) => {
              const Icon = platformIcons[post.platform] || AtSign
              const bgColor = platformColors[post.platform] || "bg-gray-500"

              return (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", bgColor)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {post.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.scheduledDate}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{post.content.substring(0, 80)}...</p>
                      {post.scheduledTime && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                          <Clock className="h-3 w-3" />
                          {post.scheduledTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
