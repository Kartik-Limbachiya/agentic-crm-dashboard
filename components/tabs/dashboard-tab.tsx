"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/metric-card"
import { Play, BrainCircuit, TrendingUp, Target, DollarSign, Loader2, CheckCircle, Users } from "lucide-react"
import type { CampaignData, LogEntry } from "@/lib/types"

interface DashboardTabProps {
  formData: {
    brandName: string
    goal: string
    audience: string
  }
  setFormData: (data: { brandName: string; goal: string; audience: string }) => void
  isLoading: boolean
  onRunWorkflow: () => void
  addLog: (message: string, type?: LogEntry["type"]) => void
  campaignData: CampaignData | null
}

export function DashboardTab({
  formData,
  setFormData,
  isLoading,
  onRunWorkflow,
  addLog,
  campaignData,
}: DashboardTabProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [audienceInsights, setAudienceInsights] = useState<string | null>(null)

  const handleAnalyzeAudience = async () => {
    if (!formData.audience) {
      addLog("Please enter a target audience first", "warning")
      return
    }

    setIsAnalyzing(true)
    addLog("AI analyzing target audience...", "info")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const insights = `High engagement potential detected. Recommended platforms: LinkedIn (B2B), Threads (viral content). Best posting times: 9-11 AM, 2-4 PM. Suggested content types: Educational posts, behind-the-scenes, success stories.`
    setAudienceInsights(insights)
    addLog("Audience analysis complete - insights available", "success")
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor performance and launch AI-powered campaigns</p>
        </div>
        {campaignData && (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active Campaign
          </Badge>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Leads Generated"
          value="5.2K"
          trend="up"
          trendValue="+12.5%"
          icon={TrendingUp}
          color="success"
          data={[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90]}
        />
        <MetricCard
          title="MQL to SQL Conversion"
          value="18%"
          trend="flat"
          trendValue="+0.5%"
          icon={Target}
          color="warning"
          data={[18, 17, 19, 18, 18, 19, 17, 18, 19, 18, 18, 18]}
        />
        <MetricCard
          title="Campaign ROI"
          value="+$12,500"
          trend="up"
          trendValue="+8.2%"
          icon={DollarSign}
          color="success"
          data={[8000, 9500, 8800, 10200, 9800, 11500, 10800, 12500, 11800, 13000, 12200, 12500]}
        />
        <MetricCard
          title="Audience Reach"
          value="48.7K"
          trend="up"
          trendValue="+15.3%"
          icon={Users}
          color="success"
          data={[35000, 38000, 40000, 42000, 45000, 44000, 46000, 48000, 47000, 48500, 48200, 48700]}
        />
      </div>

      {/* Campaign Generator Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BrainCircuit className="h-4 w-4 text-primary" />
            </div>
            Agentic Campaign Generator
            <Badge variant="outline" className="ml-2 text-xs">
              Powered by LangGraph
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-sm font-medium">
                Brand Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brandName"
                placeholder="Enter your brand name"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium">
                Campaign Goal <span className="text-destructive">*</span>
              </Label>
              <Input
                id="goal"
                placeholder="e.g., Increase brand awareness, Drive sales"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience" className="text-sm font-medium">
              Target Audience <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="audience"
              placeholder="Describe your target audience demographics, interests, and behaviors..."
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="min-h-[100px] bg-background resize-none"
            />
          </div>

          {audienceInsights && (
            <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
              <div className="flex items-center gap-2 text-secondary text-sm font-medium mb-2">
                <BrainCircuit className="h-4 w-4" />
                AI Audience Insights
              </div>
              <p className="text-sm text-muted-foreground">{audienceInsights}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleAnalyzeAudience}
              disabled={isAnalyzing || !formData.audience}
              className="flex-1 sm:flex-none border-secondary/50 text-secondary hover:bg-secondary/10 hover:text-secondary bg-transparent"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BrainCircuit className="h-4 w-4 mr-2" />
              )}
              Analyze Audience
            </Button>
            <Button
              onClick={onRunWorkflow}
              disabled={isLoading || !formData.brandName || !formData.goal || !formData.audience}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Workflow...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Agentic Workflow
                </>
              )}
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Workflow Pipeline:</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["Planner Agent", "Content Generator", "Scheduler", "Executor Agent", "Reporter Agent"].map(
                (step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {i + 1}. {step}
                    </Badge>
                    {i < 4 && <span className="text-muted-foreground">→</span>}
                  </div>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
