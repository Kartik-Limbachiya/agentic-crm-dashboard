import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agentic CRM - AI Social Media Campaign Manager",
  description:
    "AI-powered social media campaign management platform using LangGraph agents. Plan, schedule, execute, and analyze campaigns across LinkedIn, YouTube, and Threads.",
  keywords: ["AI", "CRM", "Social Media", "Campaign Manager", "LangGraph", "Agentic AI"],
  authors: [{ name: "Agentic CRM" }],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
