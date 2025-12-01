# Agentic CRM Dashboard 🤖📊

An AI-powered social media campaign management platform that leverages **LangGraph agents** to plan, schedule, execute, and analyze marketing campaigns automatically.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## 🚀 Overview

The **Agentic CRM Dashboard** streamlines the workflow for social media marketers by automating the entire campaign lifecycle. Instead of manually drafting and posting content, users simply define a **Brand Name**, **Goal**, and **Target Audience**.

The system's AI agents then collaborate to:
1.  **Plan** a strategic content schedule.
2.  **Generate** engaging posts for platforms like LinkedIn, YouTube, and Threads.
3.  **Schedule** these posts on an interactive calendar.
4.  **Execute** the posts (simulated live publishing).
5.  **Report** on performance metrics with AI-driven sentiment analysis.

## ✨ Key Features

* **🧠 AI Campaign Generator:** Inputs brand details to trigger a multi-agent workflow (Planner -> Content Generator).
* **📝 Smart Planner:** Review, edit, or "AI Rewrite" generated content before approval.
* **📅 Interactive Calendar:** Visual timeline view of all scheduled posts.
* **⚡ Real-time Execution:** Watch the "Executor Agent" publish posts live with status updates (Pending → Executing → Published).
* **📈 Comprehensive Reports:** Post-campaign analytics including impressions, engagement rates, and AI-generated executive summaries.
* **🕰️ Campaign History:** Archive, access, and reload past campaign data.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components
* **Icons:** Lucide React
* **Charts:** Recharts (for analytics visualization)
* **Backend Integration:** Connects to a custom Agentic CRM API (hosted on Render)

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages (layout.tsx, page.tsx)
├── components/           # React components
│   ├── tabs/             # Core logic tabs (Dashboard, Planner, Calendar, Reports)
│   ├── ui/               # Reusable UI components (Buttons, Cards, Inputs)
│   ├── campaign-dashboard.tsx # Main state management and layout controller
│   ├── sidebar.tsx       # Navigation and Agent Log Console
│   └── ...
├── lib/                  # Utilities (utils.ts) and TypeScript interfaces (types.ts)
├── public/               # Static assets (images, icons)
└── styles/               # Global styles (globals.css)
```
## Agent Workflow Explanation
**The dashboard visualizes a sophisticated chain of AI agents working in harmony:**
* **Planner Agent**: Analyzes the user's high-level goal and audience to create a detailed content strategy.
* **Content Agent**: Writes the specific post copy, selects hashtags, and suggests image ideas for each platform.
* **Executor Agent**: Simulates the API calls to social platforms (LinkedIn, YouTube, Threads) to publish content.
* **Reporter Agent**: Aggregates engagement data and writes a markdown summary of the campaign's success.

## Demo Inputs 
**1. TechNova Solutions (B2B SaaS)**
* 1.) Brand Name: TechNova Solutions 
* 2.) Campaign Goals: Generate 500 demo requests & 40% brand lift in Q1 2025 via AI-feature showcase. 
* 3.) Target Audience: Tech-savvy project managers and team leads at mid-to-large enterprises (Age: 28-45).

**2. EcoBloom Skincare (D2C Beauty)**
* 1.) Brand Name: EcoBloom Skincare 
* 2.) Campaign Goals: Sell 10,000 serum units & gain 50k followers in Month 1 for product launch. 
* 3.) Target Audience: Environmentally-conscious millennial and Gen-Z women (Age: 22-38).

**3. FitFusion Pro (Fitness & Wellness)**
* 1.) Brand Name: FitFusion Pro
* 2.) Campaign Goals: Drive 25k downloads (15% conversion) & 100k viral engagements via fitness challenges.
* 3.) Target Audience: Health-conscious professionals with limited gym time (Age: 25-50).

**4. BrightMinds Academy (EdTech)**
* 1.) Brand Name: BrightMinds Academy 
* 2.) Campaign Goals: Enroll 5,000 students in Data Science Bootcamp & generate $500k revenue in 60 days. 
* 3.) Target Audience: Career-switching professionals and recent graduates (Age: 21-35).

**5. UrbanNest Realty (Real Estate)**
* 1.) Brand Name: UrbanNest Realty 
* 2.) Campaign Goals: Generate 300 monthly leads & close 50 home sales in Q1 2025 via Virtual Tours. 
* 3.) Target Audience: First-time homebuyers and young families (Age: 28-42).
