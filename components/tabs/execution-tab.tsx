"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  Linkedin,
  Youtube,
  AtSign,
  FileImage,
  ThumbsUp,
  Share2,
  MessageCircle,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CampaignData } from "@/lib/types"

interface ExecutionTabProps {
  campaignData: CampaignData | null
  isExecuting: boolean
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

export function ExecutionTab({ campaignData, isExecuting }: ExecutionTabProps) {
  if (!campaignData || campaignData.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileImage className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Execution Data</h2>
        <p className="text-muted-foreground max-w-md">Approve the campaign plan to see execution status here.</p>
      </div>
    )
  }

  const completedCount = campaignData.results.filter((r) => r.status === "success" || r.status === "error").length
  const progress = (completedCount / campaignData.plan.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Execution</h1>
          <p className="text-muted-foreground mt-1">Real-time status of your campaign deployment</p>
        </div>
        <div className="flex items-center gap-3">
          {isExecuting && (
            <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Executing...
            </Badge>
          )}
          {!isExecuting && completedCount === campaignData.plan.length && (
            <Badge variant="secondary" className="bg-success/10 text-success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Execution Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {campaignData.plan.length} posts
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {campaignData.results.map((result, index) => {
            const Icon = platformIcons[result.platform] || AtSign
            const bgColor = platformColors[result.platform] || "bg-gray-500"
            const isSuccess = result.status === "success"
            const isError = result.status === "error"
            const isPending = result.status === "pending"
            const isExecutingNow = result.status === "executing"

            return (
              <div key={index} className="relative flex gap-4 pl-12">
                {/* Status indicator */}
                <div
                  className={cn(
                    "absolute left-4 w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                    isSuccess && "bg-success",
                    isError && "bg-destructive",
                    isPending && "bg-muted border-2 border-border",
                    isExecutingNow && "bg-primary",
                  )}
                >
                  {isSuccess && <CheckCircle className="h-3 w-3 text-success-foreground" />}
                  {isPending && <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />}
                  {isExecutingNow && <Loader2 className="h-3 w-3 text-primary-foreground animate-spin" />}
                  {isError && <AlertCircle className="h-3 w-3 text-destructive-foreground" />}
                </div>

                <Card
                  className={cn(
                    "flex-1 border-border shadow-sm transition-all",
                    isExecutingNow && "border-primary shadow-primary/10",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgColor)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{result.platform}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {campaignData.plan[index]?.content.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={isSuccess ? "default" : isError ? "destructive" : "secondary"}
                          className={cn(
                            isSuccess && "bg-success text-success-foreground",
                            isExecutingNow && "bg-primary text-primary-foreground animate-pulse",
                          )}
                        >
                          {isSuccess && "Published"}
                          {isError && "Failed"}
                          {isPending && "Pending"}
                          {isExecutingNow && "Executing"}
                        </Badge>
                      </div>

                      {isSuccess && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{result.likes?.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Likes</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{result.shares?.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Shares</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{result.comments?.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Comments</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{result.impressions?.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Impressions</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {isError && (
                        <p className="text-sm text-destructive">
                          Post failed to publish. This may be due to platform requirements (e.g., YouTube requires video
                          content).
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
