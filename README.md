# Intervize AI — AI-Powered Interview Preparation Platform

> A premium, production-quality SaaS app that helps software engineers crush technical interviews with AI feedback, mock interviews, progress tracking and leaderboards.

![Hero Screenshot Placeholder](./.github/screenshots/hero.png)

---

## ✨ Project Overview

**Intervize AI** is a full-stack interview preparation platform built for students, freshers and software engineers. It pairs a curated question bank across 13 categories with realistic mock interviews and an AI feedback engine that scores communication, technical depth, confidence and problem solving.

The app is designed to look and feel like a real, shipped SaaS product — suitable for both day-to-day use and a software engineering portfolio.

---

## 🚀 Features

### Landing
- Hero, Features, Categories, AI Feedback, Testimonials, FAQ, Contact and Footer
- Light / dark theme with no flash of unstyled content
- Smooth animations and glassmorphism

### Authentication
- Sign in / Sign up with email + password (with show/hide and validation)
- Google OAuth via Lovable Cloud Auth
- Forgot password & reset password flows
- Protected dashboard routes

### Dashboard
- Welcome dashboard with personalized greeting, streak, XP and study time
- Weekly activity chart (Recharts)
- Daily challenge card (deterministic per day)
- Continue learning / recent activity panels

### Question Module
- Search, category filter, difficulty filter
- Bookmark questions and mark as completed
- Per-question notes
- Pagination, skeleton loaders, empty states

### Mock Interview
- Configurable category + difficulty
- Random questions, live timer, previous / next navigation
- End early or finish to receive AI feedback
- Feedback includes communication, technical, confidence, problem solving, strengths, weaknesses and suggestions
- Results persisted to `mock_interviews` + `feedback` tables

### Leaderboard
- Global / weekly / top learners tabs
- Podium for top 3 and full ranking table
- Your row is highlighted

### Settings
- Edit profile (name, bio)
- Change password
- Theme toggle
- Notification preferences (daily, tips, achievements)

### Quality of life
- Toast notifications (Sonner)
- Loading skeletons, empty states, error and 404 pages
- Responsive sidebar with mobile drawer
- Breadcrumb navigation, search bar, smooth page transitions

---

## 🛠 Tech Stack

**Frontend**
- React + TypeScript
- TanStack Router (file-based routing) & TanStack Query
- Tailwind CSS v4 with custom oklch design tokens
- Framer Motion–style transitions via CSS keyframes
- Recharts for analytics
- shadcn/ui components

**Backend (Lovable Cloud + Supabase)**
- Supabase Auth (email + Google OAuth)
- Supabase Postgres database with RLS-friendly tables
- Tables: `profiles`, `interview_categories`, `questions`, `bookmarks`, `progress`, `mock_interviews`, `feedback`, `achievements`

---

## 📦 Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd intervize-ai

# 2. Install dependencies
npm install

# 3. Configure environment
# Connect Supabase via Lovable Cloud (recommended) OR provide:
#   VITE_SUPABASE_URL=...
#   VITE_SUPABASE_PUBLISHABLE_KEY=...

# 4. Run the dev server
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections (Hero, Features, FAQ, …)
│   ├── dashboard/        # Reusable dashboard pieces (Shell, StatCard, Chart…)
│   ├── ui/               # shadcn/ui primitives
│   └── Logo.tsx
├── hooks/
│   ├── use-auth.ts       # Supabase session hook
│   └── use-theme.ts      # Light/dark theme toggle
├── integrations/
│   ├── supabase/         # Auto-generated Supabase client + types
│   └── lovable/          # Lovable Cloud auth helpers
├── lib/
│   └── categories.ts     # Category → icon mapping
├── routes/               # TanStack Router file routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── auth.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── dashboard.tsx          # Protected layout
│   ├── dashboard.index.tsx
│   ├── dashboard.questions.tsx
│   ├── dashboard.mock.tsx
│   ├── dashboard.leaderboard.tsx
│   └── dashboard.settings.tsx
└── styles.css            # Tailwind v4 design system tokens + utilities
```

---

## 🌱 Future Improvements

- Real LLM-powered feedback via a Supabase Edge Function
- Voice-based mock interviews with transcription
- Spaced-repetition study queue
- Team / cohort leaderboards
- Resume parser → personalized question recommendations
- Public profile pages with achievement showcase

---

## 🖼 Screenshots

> Add real screenshots once deployed.

| Landing | Dashboard | Mock Interview |
| --- | --- | --- |
| ![](./.github/screenshots/landing.png) | ![](./.github/screenshots/dashboard.png) | ![](./.github/screenshots/mock.png) |

---

## 📝 License

MIT — built for learning and portfolio use.
