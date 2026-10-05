# ADR Quest — Learn. Detect. Report. Save Lives.

ADR Quest is a premium, production-ready, gamified educational EdTech platform designed for medical students, clinical pharmacists, nurses, and researchers to master Adverse Drug Reaction (ADR) identification, causality assessment, and pharmacovigilance safety reporting.

Built using **100% Vanilla HTML5, CSS3, and modern ES6+ JavaScript**, this project requires no external frameworks, dependencies, or compilers. It is designed to look like a premium SaaS application with high-fidelity components, custom canvas analytics charts, interactive game rooms, and a print-friendly medical certificate generator.

---

## 🚀 Features Overview

### 1. Landing Page
- **Hero & Call to Action**: Sleek gradients, custom medical SVGs, and responsive headers.
- **Statistics Counter**: Interactive training statistics (trained clinicians, mock reports, safety rates).
- **Interactive FAQ Accordion**: Fully animated custom vanilla dropdown controls.
- **Testimonials & Contact**: Clean forms with validation feedbacks.

### 2. Authentication UI & Validation
- Fully responsive **Login**, **Registration**, and **Forgot Password** modules.
- Strict JavaScript-based input sanitization and form validation (email pattern validation, password length thresholds, matching confirmations).

### 3. User Dashboard
- **Welcome Banner**: Displays customized greetings and dynamic Knowledge Score percentages.
- **Quest Ranks**: Dynamic level displays and interactive XP progress bars tracking next level requirements.
- **Streak Tracker**: Increments active daily streaks using local persistence.
- **Daily Challenge**: Toggles clinical questions based on date indexes, offering instant detailed explanations.

### 4. Interactive Learning Modules
- **8 Core Safety Modules**:
  1. *Introduction to Pharmacovigilance*
  2. *Mechanisms of ADR Classifications*
  3. *High-Risk Drug Classes*
  4. *Vulnerable Patient Populations*
  5. *Clinical Detection & Causality*
  6. *Safety Reporting & Standards*
  7. *Prevention & Risk Mitigation*
  8. *Complex Case Studies & Signal Detection*
- **Interactive Quizzes**: Multiple choice checks with pass requirements of 80% to mark modules complete.

### 5. Clinical Case Simulator
- Interactive emergency patient files.
- Live vital monitors checking **Heart Rate**, **Blood Pressure**, **Temperature**, and **Oxygen Saturation** (vitals turn red if toxicity values drop).
- Direct causality-based action trees with instant clinical rationale explanations.

### 6. Serious Mini-Games Lab
1. **Quiz Battle**: Round-based card duel where player health and "Dr. Bot" health are tracked based on speed and accuracy.
2. **Match the Drug**: Interactive connection board linking high-risk agents (like Heparin or Amiodarone) to their signature adverse reactions (HIT, Pulmonary Fibrosis).
3. **True or False**: Fast-paced rapid-fire verification cards.
4. **Time Attack**: Solves safety scenarios against a ticking 30-second countdown clock.
5. **ADR Detective**: Investigative diagnosis case files where players act as toxicologists.

### 7. Adverse Reaction Reporting Practice
- Interactive simulated **MedWatch / Yellow Card** adverse event reporting form.
- Full validations of suspected agent, patient demographics, reaction description, and onset times.
- Successful submission triggers a detailed verification report modal showing case reference numbers and rewarding **+100 XP** and the **Safety Advocate** badge.

### 8. Analytics & Canvas Charts
- Built using **HTML5 Canvas context API** (no chart libraries).
- Renders:
  - Cumulative XP training timeline (Line chart with gradient fills).
  - Module completion distributions (Radial circle progress).
  - Quiz score averages (3D-like column charts).

### 9. Admin Panel Terminal
- Dynamic tabular views listing system users, search functions, and simulated reported cases logs.
- Export options compiling platform records into downloadable **CSV spreadsheets** using data URI links.

### 10. Verification Certificate
- High-fidelity clinical certificate layout with a gold seal, verification hash, and signature blocks.
- Styled with dedicated CSS `@media print` parameters, allowing seamless print formatting or saving as a clean PDF using browser print controls (`Ctrl + P`).

---

## 📂 Project Structure

```bash
site anna/
│
├── index.html        # Main semantic SPA layout shell and views structure
├── style.css         # Custom stylesheet, layout grids, dark theme overrides, animations
├── script.js         # State machine, mock DB registries, router, charts, and game loops
└── package.json      # Local dev server command script configuration
```

---

## 🛠️ How to Run Locally

### Option A: Double-Click (Direct Launch)
Since this is a vanilla static site, you can run it immediately by locating the files and double-clicking:
- **`index.html`** in any standard modern web browser.

### Option B: Local Dev Node Server (Recommended)
To run with standard server protocols (especially for testing dynamic asset loading and clean header requests):
1. Ensure Node.js is installed.
2. Open terminal in the directory `site anna`.
3. Run the following command:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the address:
   `http://localhost:3000`

---

## 🔒 State Persistence
All statistics, completed modules, unlocked badges, streaks, and user credentials are saved in **`localStorage`**. Your progress is automatically retained when refreshing the page or returning to the site!
