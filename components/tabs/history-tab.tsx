"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building2, ArrowRight, FileImage, Users, Target } from "lucide-react"
import type { HistoryItem } from "@/lib/types"

interface HistoryTabProps {
  history: HistoryItem[]
  onLoadCampaign: (item: HistoryItem) => void
}

export function HistoryTab({ history, onLoadCampaign }: HistoryTabProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileImage className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Campaign History</h2>
        <p className="text-muted-foreground max-w-md">Your completed campaigns will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign History</h1>
          <p className="text-muted-foreground mt-1">View and reload past campaigns</p>
        </div>
        <Badge variant="secondary">{history.length} campaigns</Badge>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {history.map((item) => (
          <Card key={item.id} className="border-border shadow-sm hover:border-primary/50 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-foreground text-lg">{item.goal}</h3>
                    <Badge
                      variant="secondary"
                      className={
                        item.status === "completed"
                          ? "bg-success/10 text-success shrink-0"
                          : item.status === "failed"
                            ? "bg-destructive/10 text-destructive shrink-0"
                            : "shrink-0"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {item.brandName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {item.audience && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span className="truncate max-w-[200px]">{item.audience}</span>
                      </span>
                    )}
                  </div>

                  {item.campaignData && (
                    <div className="flex items-center gap-3 pt-2">
                      <Badge variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {item.campaignData.plan?.length || 0} posts
                      </Badge>
                      {item.campaignData.results && (
                        <Badge variant="outline" className="text-xs text-success">
                          {item.campaignData.results.filter((r) => r.status === "success").length} published
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onLoadCampaign(item)}>
                    Load Campaign
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
