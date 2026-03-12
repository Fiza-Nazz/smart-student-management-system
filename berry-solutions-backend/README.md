# Berry Solutions: Intelligent School Management System 🚀

A production-ready Backend API for an automated School Management System featuring **RFID Attendance Tracking**, **Automated WhatsApp Notifications**, and **AI-Driven Analytics**.

---

## 🌟 Key Features
- **Student Management**: Full CRUD operations with auto-ID generation.
- **RFID Attendance System**: Instant check-in/out logic with "Late Arrival" detection.
- **WhatsApp Integration**: Automated notifications to parents via `whatsapp-web.js` (No API Fees).
- **AI-Ready Architecture**: Structured for integration with OpenAI and Hugging Face.
- **Industrial-Grade Security**: Helmet, Rate Limiting, and CORS protection.
- **Zero-Bugs Logging**: Winston-powered logging for production monitoring.

---

## 🛠 Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **WhatsApp Integration**: `whatsapp-web.js`
- **Validation**: `express-validator`
- **Logging**: `winston` + `morgan`
- **Standard**: RESTful API Design

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/berry-solutions/school-backend.git

# Enter the directory
cd berry-solutions-backend

# Install dependencies
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/berry_school_db
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
```

### 3. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 📡 API Documentation

### Student Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/students` | Add new student |
| `GET` | `/api/v1/students/search?query=name` | Search students |
| `GET` | `/api/v1/students/:id` | Get student details |
| `PUT` | `/api/v1/students/:id` | Update student profile |
| `DELETE` | `/api/v1/students/:id` | Remove student |

### Attendance System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/attendance/rfid-scan` | Record attendance via RFID |

### WhatsApp Notifications
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/notifications/send` | Trigger manual notification |

---

## 🏗 System Design
For a deep dive into the architecture, relationships, and AI strategy, please refer to:
- [Architecture Documentation](./ARCHITECTURE.md)
- [AI Strategy Proposal](./AI_PROPOSAL.md)

---

## 👨‍💻 Developed By
**Berry Solutions - Backend & AI Development Evaluation**
*Senior Developer Submission*
