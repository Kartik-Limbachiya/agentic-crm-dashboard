export interface Post {
  platform: string
  content: string
  image_idea?: string
  mediaUrl?: string
  scheduledDate?: string
  scheduledTime?: string
  status?: "draft" | "scheduled" | "published" | "failed"
}

export interface ExecutionResult {
  platform: string
  status: "success" | "error" | "pending" | "executing"
  id: string
  likes?: number
  shares?: number
  comments?: number
  impressions?: number
  reach?: number
  executedAt?: string
}

export interface CampaignData {
  plan: Post[]
  results: ExecutionResult[]
  report: string
  brandName?: string
  goal?: string
  audience?: string
  createdAt?: string
}

export interface LogEntry {
  timestamp: string
  message: string
  type?: "info" | "success" | "error" | "warning"
}

export interface HistoryItem {
  id: string
  goal: string
  date: string
  brandName: string
  status: string
  campaignData?: CampaignData
  audience?: string
}

export interface CalendarEvent {
  id: string
  platform: string
  content: string
  date: string
  time: string
  status: "scheduled" | "published" | "failed"
}
