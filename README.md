# ER-FLOW AI: Next-Gen Trauma Orchestration System

ER-FLOW AI is a high-performance clinical decision support engine designed to orchestrate trauma response from the field to the operating room. It leverages advanced machine learning to automate triage, resource allocation, and medical documentation, specifically optimized for high-stakes emergency environments and Mass Casualty Incidents (MCI).

---

## 🏥 Project Overview

In high-pressure emergency departments, every second counts. ER-FLOW AI acts as a **Digital Trauma Lead**, bridging the gap between pre-hospital care (Ambulance) and definitive treatment (Operating Room). By using **Gemini 3.1 Pro**, the system transforms unstructured clinical data into actionable surgical protocols and resource locks in real-time.

### 🎯 Core Mission
- **Reduce Time-to-OR**: Automate surgical triggers and team activation.
- **Standardize Triage**: Eliminate human bias in ESI level assignment.
- **Disaster Readiness**: Provide a sandbox for simulating mass casualty events.

---

## 🚀 Key Modules

### 1. Single Patient Pipeline (The Core Engine)
A unified, automated flow that links every stage of emergency care:
- **Ambulance Intake**: Real-time voice-to-data transcription. Paramedics provide raw field reports which are instantly structured into clinical JSON.
- **AI Triage**: Uses Gemini 3.1 Pro to analyze vitals, GCS, and injury mechanisms. It predicts ESI (Emergency Severity Index) levels and trauma types.
- **Critical Care Orchestration**: If a patient is flagged as "Critical," the system automatically generates ATLS-compliant protocols and assigns a specialized surgical team.
- **Automated EMR**: Compiles the entire clinical journey into a structured Electronic Medical Record (EMR) ready for hospital integration.

### 2. Disaster Mode (MCI Simulation)
A specialized module for disaster preparedness and response:
- **Mass Casualty Scenarios**: Stress-test hospital response for explosions, earthquakes, and transportation disasters.
- **Realistic Victim Generation**: Uses probability distributions to generate dozens of victims with unique vitals and injury patterns.
- **Mass Triage Stream**: Visualizes the AI's ability to process a surge of victims, identifying "Red Tags" (Immediate) and "Black Tags" (Expectant) in seconds.
- **Impact Analytics**: Real-time Recharts integration to monitor triage distribution and resource depletion.

### 3. HL7/FHIR Real-time Monitoring
- **Live Vital Sync**: Integration with bedside monitors via HL7/FHIR standards.
- **Simulated FHIR Server**: A mock FHIR service that provides real-time `Observation` resources for BP, HR, SpO2, and Resp Rate.
- **Protocol-Driven Sync**: Automatic polling and synchronization of patient data to ensure the AI is always reasoning on the latest vitals.

### 4. AI Evaluation & Stress Testing
- **100-Case Simulation**: A benchmarking tool that runs 100 synthetic clinical cases to evaluate AI accuracy and OR activation efficiency.
- **Protocol-Driven Logic**: Encoded clinical triggers (e.g., Hypotension < 90, GCS < 8) ensure the AI remains grounded in medical standards.

---

## 🛠️ Tech Stack & Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for mission-critical type safety.
- **Styling**: Tailwind CSS with a "Glassmorphism" aesthetic for a modern, high-tech clinical feel.
- **Animations**: `motion/react` for fluid transitions between pipeline stages.
- **Icons**: Lucide React for a consistent, high-fidelity icon set.

### AI & Data Logic
- **LLM**: Google Gemini 3.1 Pro.
- **Interoperability**: HL7/FHIR v4.0 standard for clinical data exchange.
- **Orchestration**: A custom `AIOrchestrator` class that chains multiple LLM calls:
    1. `triagePatient()` -> Returns ESI and trauma type.
    2. `getCriticalActions()` -> Returns ATLS protocols based on triage.
    3. `assignTeam()` -> Maps surgical staff to the case.
    4. `generateEMR()` -> Summarizes the full context.
- **Rule Engine**: A hybrid approach where hard-coded clinical rules (e.g., BP < 90) can override AI suggestions to ensure 100% reliability for surgical triggers.

---

## 🛡️ Security, Compliance & Safety

- **PII Redaction**: The system is designed to process clinical data without requiring sensitive personal identifiers (Name/DOB).
- **Audit Trail**: Every AI decision is logged with a confidence score and a detailed justification.
- **Human-in-the-Loop**: The UI is designed to present AI suggestions as "Drafts" that require clinician confirmation before resource locking.
- **Rate Limit Resilience**: Built-in exponential backoff and recovery logic for AI API calls during high-volume simulations.

---

## 📈 Future Roadmap

- [ ] **Multi-Hospital Sync**: Orchestrating resources across a city-wide hospital network.
- [x] **Live Vitals Integration**: Connecting to real-time patient monitors via HL7/FHIR.
- [ ] **Predictive Bed Management**: Using ML to forecast bed availability based on current ER inflow.
- [ ] **Advanced MCI Training**: VR/AR integration for field paramedic training using the MCI generator.

---

## 📖 Getting Started for Developers

### Prerequisites
- Node.js 18+
- Gemini API Key (set as `GEMINI_API_KEY` in environment)

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

### Key Files
- `src/lib/ai-orchestrator.ts`: The core logic for chaining AI calls.
- `src/services/gemini.ts`: Direct interface with the Google Generative AI SDK.
- `src/components/Pipeline.tsx`: The primary UI for the unified patient flow.
- `src/components/DisasterSimulation.tsx`: The MCI simulation engine.

---
*This project was developed for the "Disaster Preparedness and Response using Machine Learning" initiative, focusing on high-performance clinical orchestration.*
