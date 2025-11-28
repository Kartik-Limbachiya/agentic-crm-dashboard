"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  Edit3,
  Sparkles,
  Linkedin,
  Youtube,
  AtSign,
  FileImage,
  Loader2,
  X,
  Save,
  Clock,
  CalendarDays,
} from "lucide-react"
import type { CampaignData, Post, LogEntry } from "@/lib/types"

interface PlannerTabProps {
  campaignData: CampaignData | null
  onApprove: () => void
  addLog: (message: string, type?: LogEntry["type"]) => void
  updatePost: (index: number, updatedPost: Partial<Post>) => void
  onAIRewrite: (index: number) => Promise<void>
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

export function PlannerTab({ campaignData, onApprove, addLog, updatePost, onAIRewrite, isExecuting }: PlannerTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null)

  const handleEdit = (index: number) => {
    if (campaignData) {
      setEditingIndex(index)
      setEditContent(campaignData.plan[index].content)
      addLog(`Editing post ${index + 1}`, "info")
    }
  }

  const handleSaveEdit = (index: number) => {
    updatePost(index, { content: editContent })
    setEditingIndex(null)
    setEditContent("")
    addLog(`Post ${index + 1} saved`, "success")
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditContent("")
  }

  const handleRewrite = async (index: number) => {
    setRewritingIndex(index)
    await onAIRewrite(index)
    setRewritingIndex(null)
  }

  const handleScheduleChange = (index: number, field: "scheduledDate" | "scheduledTime", value: string) => {
    updatePost(index, { [field]: value })
  }

  if (!campaignData || campaignData.plan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileImage className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Campaign Plan</h2>
        <p className="text-muted-foreground max-w-md">
          Run the agentic workflow from the Dashboard tab to generate a campaign plan.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Planner</h1>
          <p className="text-muted-foreground mt-1">Review, edit, and schedule posts before execution</p>
          {campaignData.brandName && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{campaignData.brandName}</Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {campaignData.goal}
              </Badge>
            </div>
          )}
        </div>
        <Button
          onClick={onApprove}
          disabled={isExecuting}
          className="bg-success hover:bg-success/90 text-success-foreground pulse-glow"
          size="lg"
        >
          {isExecuting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Execute
            </>
          )}
        </Button>
      </div>

      {/* Post Cards */}
      <div className="space-y-4">
        {campaignData.plan.map((post, index) => {
          const Icon = platformIcons[post.platform] || AtSign
          const bgColor = platformColors[post.platform] || "bg-gray-500"
          const isEditing = editingIndex === index
          const isRewriting = rewritingIndex === index

          return (
            <Card key={index} className="border-border shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Content Section */}
                  <div className="flex-1 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="font-medium">
                            {post.platform}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Post {index + 1}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          post.status === "scheduled" ? "border-success/50 text-success" : "border-muted-foreground/50"
                        }
                      >
                        {post.status || "Draft"}
                      </Badge>
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[150px] bg-background"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit(index)}>
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>
                    )}

                    {!isEditing && (
                      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            Date
                          </Label>
                          <Input
                            type="date"
                            value={post.scheduledDate || ""}
                            onChange={(e) => handleScheduleChange(index, "scheduledDate", e.target.value)}
                            className="h-8 text-xs bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Time
                          </Label>
                          <Input
                            type="time"
                            value={post.scheduledTime || ""}
                            onChange={(e) => handleScheduleChange(index, "scheduledTime", e.target.value)}
                            className="h-8 text-xs bg-background"
                          />
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(index)} className="text-xs">
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRewrite(index)}
                          disabled={isRewriting}
                          className="text-xs border-secondary/50 text-secondary hover:bg-secondary/10"
                        >
                          {isRewriting ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Sparkles className="h-3 w-3 mr-1" />
                          )}
                          AI Rewrite
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Image Preview */}
                  <div className="w-full lg:w-56 h-48 lg:h-auto bg-muted flex items-center justify-center border-t lg:border-t-0 lg:border-l border-border relative overflow-hidden">
                    <img
                      src={
                        post.mediaUrl ||
                        `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(post.image_idea || "campaign asset for " + post.platform)}`
                      }
                      alt="Campaign asset"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
