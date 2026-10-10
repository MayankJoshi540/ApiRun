<div align="center">

<img src="./public/logo.png" alt="APIRun Logo" width="96" height="96" style="border-radius: 20px;" />

# APIRun

**A LeetCode-style platform for backend developers.**  
*Build and test live endpoints in Node.js, Go, and Python against automated contract, concurrency, and validation test suites.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-VS_Code-1E1E1E?style=for-the-badge&logo=visual-studio-code&logoColor=007ACC)](https://microsoft.github.io/monaco-editor/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

<br/>

[Explore Challenges](#-core-features) • [Platform Screenshots](#-platform-walkthrough) • [Why APIRun?](#-the-paradigm-shift-why-leetcode-isnt-enough-for-backend) • [Getting Started](#-getting-started)

</div>

---

## ⚡ Overview

Traditional coding platforms focus primarily on abstract algorithmic puzzles (inverting binary trees, dynamic programming grids, graph traversals). While valuable for algorithmic fundamentals, they don't prepare developers for production backend systems.

**APIRun** bridges this gap. It is an interactive engineering platform where you solve realistic backend challenges:

- 🛡️ **RFC-9110 HTTP & Schema Compliance**: Implement endpoints that validate strictly structured payloads, enforce headers, and return accurate HTTP semantics.
- 💥 **Automated Concurrency Fuzzing**: Test your services against simultaneous race conditions, double-spend operations, and deadlocks with automated multi-client harnesses.
- ⏳ **Rate Limiting & Idempotency**: Build token-bucket limiters, sliding-window algorithms, and safe idempotent payment mutations.
- 🔐 **Stateless & Statefull Auth**: Implement robust JWT rotation, session invalidation, and RBAC permission checks.
- ⚡ **Zero-Setup In-Browser Sandbox**: Code and test directly with the Monaco Editor (the engine powering VS Code) with sub-second feedback.

---

## 📸 Platform Walkthrough

<div align="center">

### 1. Modern High-Performance Landing Experience
*Interactive 3D language ticker, interactive challenge showcases, and real-world backend metrics.*

<img src="./public/reference.png" alt="APIRun Landing Page" width="100%" style="border-radius: 12px; border: 1px solid #27272a; margin-bottom: 24px;" />

<br/><br/>

### 2. Live Interactive Code Arena & Challenge Runner
*Full Monaco code editor with multi-file support, automated test execution, and live concurrency assertions.*

<img src="./public/new-editor.png" alt="APIRun Challenge Arena" width="100%" style="border-radius: 12px; border: 1px solid #27272a; margin-bottom: 24px;" />

<br/><br/>

### 3. Developer Progress & Mastery Dashboard
*Track completed challenges across concurrency, authentication, distributed systems, and real-time backend domains.*

<img src="./public/new-catalog.png" alt="APIRun Progress Tracker" width="100%" style="border-radius: 12px; border: 1px solid #27272a; margin-bottom: 24px;" />

</div>

---

## 🥊 The Paradigm Shift: Why LeetCode Isn't Enough for Backend

| Evaluation Vector | Traditional Algorithmic Platforms (LeetCode) | APIRun (Backend Engineering) |
| :--- | :--- | :--- |
| **Primary Focus** | Inverting binary trees, DP tables, graph DFS/BFS | HTTP contracts, RFC-9110 status codes, race conditions |
| **Concurrency & Locks** | Single-threaded synchronous execution | 50+ concurrent requests hitting shared mutable states |
| **Failures & Resilience** | Returns wrong boolean or timeout | Real 429 Too Many Requests, 409 Conflict, retry jitter |
| **Data Integrity** | Arrays & Linked Lists | Idempotency keys, atomic distributed locks, token buckets |
| **Real-World Relevance** | Algorithmic puzzle contests | Production API architecture & real backend scenarios |

---

## 🚀 Core Features

- **⚡ Real-World Challenge Catalog**: Challenges crafted around production scenarios — Token Bucket Rate Limiters, Distributed Locks, Webhook Dispatchers, and JWT Refresh Flows.
- **🛡️ Automated Assertion Harness**: Validates status codes, headers, response schemas, and latency benchmarks against strict specifications.
- **🔥 Race Condition & Fuzzing Engine**: Automated runner tests your endpoints with burst traffic to expose non-atomic state mutations.
- **💻 Monaco Editor (VS Code Engine)**: Code directly with full syntax highlighting, dark mode interface, and instant inline feedback.
- **📊 Real-Time Telemetry & Progress**: Track your solved challenges, category mastery, and benchmark times.
- **🎨 Modern Glassmorphic Dark UI**: Custom-designed with Plus Jakarta Sans typography and clean, high-contrast aesthetics.

---

## 🛠️ Supported Languages & Frameworks

APIRun supports writing backend solutions in any major runtime:

| Runtime / Ecosystem | Frameworks & Libraries |
| :--- | :--- |
| **Python** | FastAPI, Django Ninja, Flask, AsyncIO |
| **Go** | Gin, Fiber, Chi, Standard Library `net/http` |
| **TypeScript / Node.js** | Express, Fastify, NestJS, Hono, Bun |
| **Rust** | Axum, Actix Web, Tokio |
| **Java / Kotlin** | Spring Boot, Quarkus, Ktor |
| **C# / .NET** | ASP.NET Core, Minimal APIs |
| **Elixir** | Phoenix Framework, Plug |

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **Frontend Core**: [React 19](https://react.dev/), [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Animations & Physics**: [GSAP (GreenSock)](https://greensock.com/gsap/), ScrollTrigger
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & Persistence**: [Firebase Firestore](https://firebase.google.com/)

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MayankJoshi540/ApiRun.git
   cd ApiRun
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000) to start building and testing endpoints.

---

## 📂 Project Architecture

```
APIRun/
├── public/                       # Static branding & platform screenshot assets
│   ├── reference.png             # Landing page overview
│   ├── new-editor.png            # Challenge arena screenshot
│   ├── new-catalog.png           # Mastery dashboard screenshot
│   └── logo.png                  # APIRun platform logo
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── challenges/           # Challenge catalog & live IDE runner
│   │   ├── progress/             # Mastery score & metrics tracker
│   │   ├── feedback/             # Community suggestions & feedback
│   │   └── layout.tsx            # Global layout with Plus Jakarta Sans & AppNavbar
│   ├── components/               # UI components
│   │   ├── hero/                 # Hero section & CTA buttons
│   │   ├── ui/                   # Custom UI icons, badges & reveal utilities
│   │   ├── gsap/                 # GSAP animations & counter utilities
│   │   ├── AppNavbar.tsx         # Glassmorphic navigation header
│   │   ├── BackendTechMarquee.tsx# 3D dual-row language marquee
│   │   ├── ChallengeShowcaseScroll.tsx # Interactive dashboard preview
│   │   └── CodeEditorPanel.tsx   # Monaco editor & test execution console
│   ├── data/                     # Challenge fixtures, test contracts & specs
│   ├── lib/                      # Progress calculation, Firebase & client libs
│   └── utils/                    # Automated test assertion runner
└── package.json                  # Scripts & dependencies
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute new backend challenge specs, improve test harnesses, or enhance UI interactions:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/rate-limiter-challenge`)
3. Commit your Changes (`git commit -m 'Add Redis-backed Token Bucket challenge'`)
4. Push to the Branch (`git push origin feature/rate-limiter-challenge`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
