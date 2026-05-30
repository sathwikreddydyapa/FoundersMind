# FoundersMind (B2B SaaS) — AI-powered Business Memory Operating System

FoundersMind is a modern, state-of-the-art Business Memory Operating System that captures, codifies, and deploys institutional knowledge, founder experience, and historical standard operating procedures (SOPs). By pairing real-time employee expertise extractions with deep-learning AI modules, FoundersMind ensures that no enterprise decision, wisdom, or operational workflow is ever lost.

This repository contains the full front-end dashboard interface, styled beautifully with navy blues, emerald greens, slate accents, and dynamic visual micro-animations.

---

## Key Features & Modules

### 1. Successor Training System
* **Learning Portal:** An interactive training dashboard where next-generation leaders learn directly from the company's captured knowledge bases.
* **AI Tutor Experience:** Interactive, personalized educational paths based on historical business milestones and specific founder frameworks.

### 2. Employee Expertise Portal
* **Day-to-day Knowledge Capture:** Custom AI chat interface tailored specifically to capture and structure senior staff workflows as they complete weekly tasks.
* **Dynamic SOP Extractions:** Real-time generation of operational schemas, incident response rules, and standard escalation procedures directly from chat transcripts.
* **Soundwave Visualizer:** Beautiful, pulsing audio-recording simulation mimicking physical dictation capturing.

### 3. Strategy Map (Interactive Process Canvas)
* **High-Fidelity Process Nodes:** Interactive SVG network mapping key divisions like Operations, Suppliers, Risk Management, and Customer relations.
* **Fluid Bezier Connections:** Visualized dependencies with glowing terminal indicators and clean CSS hover effects.
* **Transform Scales:** Reactive **Zoom In**, **Zoom Out**, and **Recenter Canvas** utilities bound to local reactive states.
* **Search Filter:** A responsive filter bar allowing managers to highlight matching system nodes instantly.

### 4. Visionary Advisor & Decision Archive
* **Mode Toggle:** Seamlessly switch the entire dashboard environment between:
  * **Internal Memory:** Utilizes strictly company-internal SOPs, archived founder decisions, and localized knowledge.
  * **Visionary Mode:** Unlocks external decision frameworks, strategic business models, and market intelligence indexes.
* **Archived Decisions Log:** Filterable historical decision records detailing category, ROI impact, risk levels, and AI recommendations.

### 5. Reports & Analytics
* **KPI Deck:** High-visibility metric cards tracking total active digitizations, captured team hours, and resolved milestones.
* **Responsive Charts:** Visual representations of Decisions by Category (Donut chart) and Decision Volume Over Time (Area chart with custom gradient fills) powered by **Recharts**.
* **Institutional Gaps Board:** Track department digitization rates (e.g. Sales, Logistics) with progress bars to flag critical knowledge capture gaps.

---

## Tech Stack
* **Framework:** React 18 (TypeScript)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (Harmonious Slate, Navy, and Emerald palette)
* **Icons:** Lucide React
* **Charts:** Recharts
* **Diagrams & Visuals:** Inline SVGs with custom hardware-accelerated animations

---

## Quick Start (Local Development)

The frontend codebase is contained in the `STARTUP` subdirectory. To launch the application locally, run the following commands:

```bash
# Navigate to the React workspace
cd STARTUP

# Install all project dependencies
npm install

# Run the local Vite dev server
npm run dev
```

The Vite dev server will start, typically exposing the dashboard on [http://localhost:5173](http://localhost:5173).

---

## Build for Production

To generate a fully-optimized production bundle:

```bash
cd STARTUP
npm run build
```

The built and compiled files will be generated in `STARTUP/dist/`.

---

## License
Proprietary — Built exclusively for the **FoundersMind** Enterprise platform. All rights reserved.
