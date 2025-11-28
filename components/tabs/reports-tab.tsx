"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Eye,
  Heart,
  MessageSquare,
  FileImage,
  TrendingUp,
  Share2,
  BarChart3,
  Linkedin,
  Youtube,
  AtSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CampaignData } from "@/lib/types"

interface ReportsTabProps {
  campaignData: CampaignData | null
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Threads: AtSign,
}

const platformColors: Record<string, string> = {
  LinkedIn: "bg-blue-600",
  YouTube: "bg-red-600",
  Threads: "bg-gray-800",
}

function SimpleBarChart({ data }: { data: { platform: string; likes: number; shares: number; comments: number }[] }) {
  const maxValue = Math.max(...data.flatMap((d) => [d.likes, d.shares, d.comments]))

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item.platform}</span>
            <span className="text-muted-foreground">{item.likes + item.shares + item.comments} total</span>
          </div>
          <div className="flex gap-1 h-6">
            <div
              className="bg-primary rounded transition-all"
              style={{ width: `${(item.likes / maxValue) * 100}%` }}
              title={`Likes: ${item.likes}`}
            />
            <div
              className="bg-secondary rounded transition-all"
              style={{ width: `${(item.shares / maxValue) * 100}%` }}
              title={`Shares: ${item.shares}`}
            />
            <div
              className="bg-success rounded transition-all"
              style={{ width: `${(item.comments / maxValue) * 100}%` }}
              title={`Comments: ${item.comments}`}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Likes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span>Shares</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success" />
          <span>Comments</span>
        </div>
      </div>
    </div>
  )
}

function SimpleDonutChart({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = ["#3b82f6", "#ef4444", "#1f2937"]

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {
            data.reduce(
              (acc, item, index) => {
                const percentage = (item.value / total) * 100
                const offset = acc.offset
                acc.elements.push(
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={colors[index % colors.length]}
                    strokeWidth="20"
                    strokeDasharray={`${percentage * 2.51} 251`}
                    strokeDashoffset={-offset * 2.51}
                  />,
                )
                acc.offset += percentage
                return acc
              },
              { elements: [] as React.ReactNode[], offset: 0 },
            ).elements
          }
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{total}</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-medium">{((item.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple markdown renderer
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmedLine = line.trim()

        if (!trimmedLine) return <div key={index} className="h-2" />

        if (trimmedLine.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-semibold mt-4">
              {trimmedLine.slice(4)}
            </h3>
          )
        }
        if (trimmedLine.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl font-bold mt-4">
              {trimmedLine.slice(3)}
            </h2>
          )
        }
        if (trimmedLine.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-bold mt-4">
              {trimmedLine.slice(2)}
            </h1>
          )
        }

        if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
          return (
            <p key={index} className="font-semibold">
              {trimmedLine.slice(2, -2)}
            </p>
          )
        }

        if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
          return (
            <li key={index} className="ml-4 list-disc">
              {trimmedLine.slice(2)}
            </li>
          )
        }

        if (/^\d+\.\s/.test(trimmedLine)) {
          return (
            <li key={index} className="ml-4 list-decimal">
              {trimmedLine.replace(/^\d+\.\s/, "")}
            </li>
          )
        }

        return (
          <p key={index} className="text-muted-foreground leading-relaxed">
            {trimmedLine}
          </p>
        )
      })}
    </div>
  )
}

export function ReportsTab({ campaignData }: ReportsTabProps) {
  const totalImpressions =
    campaignData?.results.reduce((sum, r) => sum + (r.impressions || (r.likes || 0) * 15 + (r.shares || 0) * 50), 0) ||
    0
  const totalEngagements =
    campaignData?.results.reduce((sum, r) => sum + (r.likes || 0) + (r.shares || 0) + (r.comments || 0), 0) || 0
  const avgSentiment = 0.82

  const handleDownload = () => {
    if (!campaignData) return

    const fullReport = `# Campaign Performance Report

**Brand:** ${campaignData.brandName || "N/A"}
**Goal:** ${campaignData.goal || "N/A"}
**Target Audience:** ${campaignData.audience || "N/A"}
**Generated:** ${new Date().toLocaleDateString()}

---

## Performance Summary

Total Impressions: ${totalImpressions.toLocaleString()}
Total Engagements: ${totalEngagements.toLocaleString()}
Average Sentiment: ${(avgSentiment * 100).toFixed(0)}% Positive

---

## AI Executive Summary

${campaignData.report}
`
    const blob = new Blob([fullReport], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `campaign-report-${campaignData.brandName || "export"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!campaignData || !campaignData.report) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileImage className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Report Available</h2>
        <p className="text-muted-foreground max-w-md">
          Complete a campaign workflow to generate an AI executive summary.
        </p>
      </div>
    )
  }

  const engagementData = campaignData.results
    .filter((r) => r.status === "success")
    .map((r) => ({
      platform: r.platform,
      likes: r.likes || 0,
      shares: r.shares || 0,
      comments: r.comments || 0,
    }))

  const platformDistribution = campaignData.results
    .filter((r) => r.status === "success")
    .map((r) => ({
      name: r.platform,
      value: (r.likes || 0) + (r.shares || 0) + (r.comments || 0),
    }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Reports</h1>
          <p className="text-muted-foreground mt-1">AI-generated insights and performance analysis</p>
          {campaignData.brandName && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{campaignData.brandName}</Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold text-foreground">{totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Engagements</p>
                <p className="text-2xl font-bold text-foreground">{totalEngagements.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Sentiment</p>
                <p className="text-2xl font-bold text-foreground">{(avgSentiment * 100).toFixed(0)}% Positive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Engagement by Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={engagementData} />
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={platformDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Report Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">AI Executive Summary</CardTitle>
          <Badge variant="outline" className="text-xs">
            Generated by Reporter Agent
          </Badge>
        </CardHeader>
        <CardContent>
          <SimpleMarkdown content={campaignData.report} />
        </CardContent>
      </Card>

      {/* Platform breakdown */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Platform Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaignData.results
              .filter((r) => r.status === "success")
              .map((result, index) => {
                const Icon = platformIcons[result.platform] || AtSign
                const bgColor = platformColors[result.platform] || "bg-gray-500"
                return (
                  <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bgColor)}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{result.platform}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Likes</span>
                        <span className="font-medium">{result.likes?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shares</span>
                        <span className="font-medium">{result.shares?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Comments</span>
                        <span className="font-medium">{result.comments?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Impressions</span>
                        <span className="font-medium">{result.impressions?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
