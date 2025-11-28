"use client"

import { useState, useCallback, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { DashboardTab } from "./tabs/dashboard-tab"
import { PlannerTab } from "./tabs/planner-tab"
import { CalendarTab } from "./tabs/calendar-tab"
import { ExecutionTab } from "./tabs/execution-tab"
import { ReportsTab } from "./tabs/reports-tab"
import { HistoryTab } from "./tabs/history-tab"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CampaignData, LogEntry, HistoryItem, Post, ExecutionResult } from "@/lib/types"

const API_URL = "https://agentic-crm-api.onrender.com"

export default function CampaignDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: new Date().toLocaleTimeString(), message: "System initialized", type: "info" },
    { timestamp: new Date().toLocaleTimeString(), message: "Connected to Agentic CRM API", type: "success" },
    { timestamp: new Date().toLocaleTimeString(), message: "Ready to run campaigns", type: "info" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [formData, setFormData] = useState({
    brandName: "",
    goal: "",
    audience: "",
  })
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      goal: "Q4 Product Launch Campaign",
      date: "2024-01-15",
      brandName: "TechCorp",
      status: "completed",
      audience: "Tech professionals aged 25-45",
    },
    {
      id: "2",
      goal: "Holiday Season Engagement",
      date: "2024-01-10",
      brandName: "ShopNow",
      status: "completed",
      audience: "Online shoppers interested in deals",
    },
    {
      id: "3",
      goal: "Brand Awareness Initiative",
      date: "2024-01-05",
      brandName: "StartupXYZ",
      status: "completed",
      audience: "Entrepreneurs and business owners",
    },
  ])

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      },
    ])
  }, [])

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`)
        if (response.ok) {
          const data = await response.json()
          addLog(`API Status: ${data.status} - ${data.service}`, "success")
        }
      } catch {
        addLog("Warning: Could not connect to backend API", "warning")
      }
    }
    checkHealth()
  }, [addLog])

  const runAgenticWorkflow = async () => {
    if (!formData.brandName || !formData.goal || !formData.audience) {
      addLog("Error: Please fill in all required fields", "error")
      return
    }

    setIsLoading(true)
    setCampaignData(null)
    addLog(`Starting agentic workflow for "${formData.brandName}"...`, "info")
    addLog("Agent: PLANNER initializing...", "info")

    try {
      const response = await fetch(`${API_URL}/campaign/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand_name: formData.brandName,
          goal: formData.goal,
          audience: formData.audience,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      addLog("Agent: PLANNER completed - Campaign plan generated", "success")
      addLog(`Generated ${data.plan?.length || 0} posts for campaign`, "info")

      const planWithSchedule = (data.plan || []).map((post: Post, index: number) => {
        const scheduledDate = new Date()
        scheduledDate.setDate(scheduledDate.getDate() + index + 1)
        return {
          ...post,
          scheduledDate: scheduledDate.toISOString().split("T")[0],
          scheduledTime: `${9 + index}:00`,
          status: "draft" as const,
        }
      })

      setCampaignData({
        plan: planWithSchedule,
        results: data.results || [],
        report: data.report || "No report generated",
        brandName: formData.brandName,
        goal: formData.goal,
        audience: formData.audience,
        createdAt: new Date().toISOString(),
      })

      addLog("Campaign plan ready for review", "success")
      setActiveTab("planner")
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveExecute = async () => {
    if (!campaignData) return

    setIsExecuting(true)
    addLog("Plan approved by user", "success")
    addLog("Agent: EXECUTOR initializing...", "info")
    setActiveTab("execution")

    const executionResults: ExecutionResult[] = []

    for (let i = 0; i < campaignData.plan.length; i++) {
      const post = campaignData.plan[i]

      setCampaignData((prev) => {
        if (!prev) return prev
        const newResults = [
          ...executionResults,
          {
            platform: post.platform,
            status: "executing" as const,
            id: `exec_${Date.now()}_${i}`,
          },
        ]
        return { ...prev, results: newResults }
      })

      addLog(`Executing ${post.platform} post...`, "info")

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result: ExecutionResult = {
        platform: post.platform,
        status: post.platform === "YouTube" ? "error" : "success",
        id: `post_${Date.now()}_${i}`,
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
        impressions: Math.floor(Math.random() * 5000) + 1000,
        reach: Math.floor(Math.random() * 3000) + 500,
        executedAt: new Date().toISOString(),
      }

      executionResults.push(result)

      if (result.status === "success") {
        addLog(`${post.platform} post published successfully`, "success")
      } else {
        addLog(`${post.platform} post failed (simulated error)`, "error")
      }

      setCampaignData((prev) => {
        if (!prev) return prev
        return { ...prev, results: [...executionResults] }
      })
    }

    addLog("Agent: EXECUTOR completed", "success")
    addLog("Agent: REPORTER generating analysis...", "info")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    addLog("Agent: REPORTER completed - Executive summary ready", "success")
    addLog("Campaign workflow completed successfully", "success")

    setHistory((prev) => [
      {
        id: Date.now().toString(),
        goal: formData.goal,
        date: new Date().toISOString().split("T")[0],
        brandName: formData.brandName,
        status: "completed",
        audience: formData.audience,
        campaignData: campaignData,
      },
      ...prev,
    ])

    setIsExecuting(false)
  }

  const updatePost = (index: number, updatedPost: Partial<Post>) => {
    setCampaignData((prev) => {
      if (!prev) return prev
      const newPlan = [...prev.plan]
      newPlan[index] = { ...newPlan[index], ...updatedPost }
      return { ...prev, plan: newPlan }
    })
    addLog(`Post ${index + 1} updated`, "info")
  }

  const handleAIRewrite = async (index: number) => {
    addLog(`AI rewriting post ${index + 1}...`, "info")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const enhancedContent =
      campaignData?.plan[index].content +
      "\n\n[AI Enhanced] Added engaging call-to-action and optimized hashtags for better reach."

    updatePost(index, { content: enhancedContent })
    addLog(`Post ${index + 1} rewritten by AI`, "success")
  }

  const loadCampaign = (item: HistoryItem) => {
    setFormData({
      brandName: item.brandName,
      goal: item.goal,
      audience: item.audience || "Previous campaign audience",
    })
    if (item.campaignData) {
      setCampaignData(item.campaignData)
    }
    addLog(`Loaded campaign: ${item.goal}`, "info")
    setActiveTab("dashboard")
  }

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            onRunWorkflow={runAgenticWorkflow}
            addLog={addLog}
            campaignData={campaignData}
          />
        )
      case "planner":
        return (
          <PlannerTab
            campaignData={campaignData}
            onApprove={handleApproveExecute}
            addLog={addLog}
            updatePost={updatePost}
            onAIRewrite={handleAIRewrite}
            isExecuting={isExecuting}
          />
        )
      case "calendar":
        return <CalendarTab campaignData={campaignData} updatePost={updatePost} />
      case "execution":
        return <ExecutionTab campaignData={campaignData} isExecuting={isExecuting} />
      case "reports":
        return <ReportsTab campaignData={campaignData} />
      case "history":
        return <HistoryTab history={history} onLoadCampaign={loadCampaign} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logs={logs}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">{renderTab()}</div>
      </main>
    </div>
  )
}
