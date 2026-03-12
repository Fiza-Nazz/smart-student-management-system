# Berry Solutions: System Architecture & Design

## 1. Backend Architecture
The system follows a **Modular Layered Architecture** for scalability and maintainability.

### Folder Structure
```text
berry-solutions-backend/
├── src/
│   ├── config/         # Database and third-party configs
│   ├── controllers/    # Request handling logic
│   ├── middleware/     # Global/Route specific middleware
│   ├── models/         # Mongoose schemas (MongoDB)
│   ├── routes/         # API endpoint definitions
│   ├── services/       # External integrations (WhatsApp, AI)
│   ├── utils/          # Helper functions (Logger)
│   └── validators/     # Request validation rules
├── .env                # Environment variables
├── logs/               # Application performance/error logs
├── server.js           # Main application entry point
└── package.json        # Dependencies and scripts
```

### Core Middleware Stack
- **Helmet**: Security headers for HTTP protection.
- **CORS**: Cross-Origin Resource Sharing management.
- **Morgan + Winston**: Industrial-grade logging for tracking every request.
- **Express-Validator**: Schema-based incoming data validation.
- **Express-Async-Errors**: Elimination of try-catch blocks in routes.

## 2. Database Design (MongoDB)
**Why MongoDB?**
Schools handle unstructured or semi-structured data (student notes, varied parent info, dynamic attendance logs). MongoDB’s flexible schema allows Berry Solutions to iterate quickly without complex migrations.

### Collections:
- **Students**: Stores identity, RFID tags, and parent contact info.
- **Attendance**: Stores daily check-in/out logs linked to Students.
- **Users (Optional)**: For Admin/Teacher dashboard authentication.

## 3. WhatsApp Communication Workflow
1.  **RFID Scan**: Hardware scans student card and hits `POST /attendance/rfid-scan`.
2.  **Logic Trigger**: `attendanceController` verifies if it's the first scan of the day.
3.  **Check-In/Late Logic**: System marks entry. If `Time > 08:00 AM`, `isLate` is set to `true`.
4.  **Service Call**: `attendanceController` calls `whatsappService.sendLateArrivalNotification()`.
5.  **WhatsApp Delivery**: `whatsapp-web.js` sends an automated message to the `parentPhoneNumber` stored in the Student record.

## 4. AI Integration Approach
All AI features are designed as isolated services within the `src/services/` directory.
- **Asynchronous Processing**: Non-blocking calls to OpenAI/Hugging Face ensures the main API remains fast.
- **Contextual Data**: The backend aggregates MongoDB data (grades + attendance) before sending it to the LLM for analysis.

## 5. NPM Packages & Installation

### Production Dependencies
| Package | Purpose |
| :--- | :--- |
| `express` | Web framework for REST API |
| `mongoose` | MongoDB ODM for schema-based modeling |
| `dotenv` | Loads environment variables from `.env` |
| `cors` | Cross-Origin Resource Sharing |
| `helmet` | HTTP security headers |
| `morgan` | HTTP request logging |
| `winston` | Advanced application logging with file rotation |
| `express-validator` | Request body/query validation |
| `express-async-errors` | Auto-catches async errors (no try-catch needed) |
| `express-rate-limit` | API rate limiting to prevent abuse |
| `whatsapp-web.js` | FREE WhatsApp Web automation for parent notifications |
| `qrcode-terminal` | Displays QR code in terminal for WhatsApp auth |
| `openai` | OpenAI GPT API client for AI features |
| `uuid` | Generates unique Student IDs (STU-XXXXXXXX) |
| `jsonwebtoken` | JWT token generation/verification (auth ready) |
| `bcryptjs` | Password hashing (auth ready) |

### Dev Dependencies
| Package | Purpose |
| :--- | :--- |
| `nodemon` | Auto-restarts server on file changes |
| `jest` | Testing framework |
| `supertest` | HTTP assertion testing for APIs |
| `eslint` | Code linting and style enforcement |

### Install Commands
```bash
# Install all dependencies at once
npm install

# Or install manually — Production:
npm install express mongoose dotenv cors helmet morgan winston express-validator express-async-errors express-rate-limit whatsapp-web.js qrcode-terminal openai uuid jsonwebtoken bcryptjs

# Dev dependencies:
npm install --save-dev nodemon jest supertest eslint
```

---
© 2026 Berry Solutions | Senior Developer Evaluation
