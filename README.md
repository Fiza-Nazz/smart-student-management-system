# Smart Student Management System 🚀

A comprehensive, production-grade **Full-Stack School Management Suite** designed for Berry Solutions. This project integrates RFID-based attendance tracking, automated parent communication via WhatsApp, and AI-driven predictive analytics.

---

## 🏗️ Project Architecture

The system is split into two main components:

1.  **[Backend API (MERN Stack)](./berry-solutions-backend)**
    *   **Runtime:** Node.js & Express.js
    *   **Database:** MongoDB (Mongoose ODM)
    *   **Features:** RESTful Student CRUD, RFID Logic, WhatsApp Integration.
    *   **Security:** Helmet, Rate-Limiting, CORS, and industrial-grade logging.

2.  **[Frontend Dashboard (Next.js)](./berry-solutions-frontend)**
    *   **Framework:** Next.js (App Router)
    *   **Styling:** Tailwind CSS (Modern, Responsive UI)
    *   **Interactions:** Live dashboard for student registration, search, and real-time attendance visualization.

---

## 🌟 Key Features

### 1. Student Management
*   Complete CRUD operations for student profiles.
*   Automatic, unique Student ID generation (e.g., `STU-8B1A2C3D`).
*   Schema-based validation using `express-validator`.

### 2. RFID Attendance Tracking
*   Simulation-ready logic for RFID card scans.
*   **Intelligent Logic:** Automatically distinguishes between Check-in and Check-out.
*   **Late Detection:** Marks students as "Late" if they arrive after 8:00 AM.

### 3. Automated WhatsApp Notifications
*   **Tech:** Uses `whatsapp-web.js` (Free, no official API fees required).
*   **Automation:** Sends instant WhatsApp alerts to parents when a student is late or absent.
*   **Manual Control:** Admin can send monthly reports or custom notifications via the dashboard.

### 4. AI-Driven Strategy
*   **Predictive Analytics:** Forecasting student absenteeism patterns.
*   **Performance Prediction:** Using LLMs (OpenAI GPT) to analyze student progress.
*   **RAG-Chatbot:** Proposal for a parent inquiry bot using school policy data.
*   *See [AI_PROPOSAL.md](./berry-solutions-backend/AI_PROPOSAL.md) for full details.*

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   A WhatsApp account (for notification scanning)

### 1. Backend Setup
```bash
cd berry-solutions-backend
npm install
# Configure your .env (see .env.example)
npm run dev
```

### 2. Frontend Setup
```bash
cd berry-solutions-frontend
npm install
npm run dev
```

---

## 🛡️ Industrial Standards
*   **Error Handling:** Global asynchronous error handling.
*   **Validation:** Strict input validation to prevent SQL/NoSQL injection.
*   **Logging:** Winston-powered logging with file-rotation for production monitoring.
*   **Architecture:** Modular folder structure (Controllers, Services, Models, Routes).

---

## 👨‍💻 Developed By
**Fiza Naz**  
*Full Stack & AI Developer Evaluation Task*
