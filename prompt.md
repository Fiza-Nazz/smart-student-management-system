You are a senior MERN Stack and AI Developer with 5+ years of 
experience. I need you to complete a full Backend and AI 
Evaluation Task for a company called Berry Solutions for the 
position of Backend MERN Stack and AI Development Intern.

Complete ALL 5 parts professionally with production-ready code 
and explanations.

---

TECH STACK TO USE:
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- WhatsApp: whatsapp-web.js (FREE library)
- AI Features: Propose using OpenAI / Hugging Face / LangChain
- Documentation: REST API format

---

PART 1: Student Management Backend

Create complete working code for:

1. MongoDB Schema for Student with these fields:
   - Student ID (auto generated)
   - Full Name
   - Date of Birth
   - Class
   - Section
   - Parent Name
   - Parent Phone Number
   - Address
   - RFID Card ID
   - Admission Date

2. REST APIs using Node.js and Express:
   - POST /students → Add Student
   - PUT /students/:id → Update Student
   - DELETE /students/:id → Delete Student
   - GET /students/:id → Get Student Details
   - GET /students/search?query= → Search Student

3. Full working code for each API with:
   - Proper error handling
   - Status codes
   - Validation using express-validator

---

PART 2: RFID Attendance System

Create complete working code for:

1. MongoDB Schema for Attendance with:
   - Student ID (reference)
   - RFID Card ID
   - Check-in Time
   - Check-out Time
   - Date
   - Status (Present / Late / Absent)
   - Late flag (if arrival after 8:00 AM = late)

2. API:
   - POST /attendance/rfid-scan → Record attendance on card scan

3. Logic:
   - If first scan of day = check-in
   - If second scan of day = check-out
   - If check-in after 8:00 AM = mark as Late

4. Brief explanation (3-4 lines):
   - How RFID reader communicates with backend system

---

PART 3: WhatsApp Parent Notifications

Use whatsapp-web.js library (FREE - no paid API needed)

Create:

1. WhatsApp client setup with QR code authentication

2. Three notification functions:
   - sendAbsenceNotification(parentPhone, studentName)
   - sendLateArrivalNotification(parentPhone, studentName, time)
   - sendMonthlyReportNotification(parentPhone, studentName, report)

3. API endpoint:
   - POST /notifications/send → Trigger WhatsApp message

4. Brief explanation:
   - How backend triggers WhatsApp messages
   - Why whatsapp-web.js is used
   - How it integrates with attendance system

---

PART 4: AI Integration

Propose 5 AI features for School Management Software.

For each feature write:
- Feature Name
- Problem it solves
- How it works (brief)
- AI Tools / Models to use
- How it integrates with backend

The 5 features should be:
1. AI Attendance Pattern Analysis
2. AI Student Performance Prediction
3. AI Chatbot for Parents
4. AI Automatic Report Generation
5. AI Behavior and Emotion Detection

---

PART 5: System Architecture

Write a clear explanation of:

1. Backend Architecture
   - How Express routes are organized
   - Middleware used
   - Folder structure

2. Database Design
   - Collections and their relationships
   - Why MongoDB is chosen

3. AI Integration Approach
   - How AI features connect with backend APIs

4. WhatsApp Communication Workflow
   - Step by step flow from attendance scan to parent notification

Also provide:
- Complete recommended folder structure
- List of all npm packages needed with install command

---

DELIVERABLES NEEDED:

1. Complete working code for all APIs
2. MongoDB Schemas
3. WhatsApp integration code
4. AI features proposal (detailed)
5. System architecture explanation
6. README.md content for GitHub
7. Postman API documentation format
8. Complete package.json with all dependencies

---

IMPORTANT NOTES:
- Code should be clean, professional, and well commented
- Use async/await everywhere
- Use proper error handling in all APIs
- Use environment variables for sensitive data (.env)
- Code should be ready to push on GitHub directly
- README should be impressive and professional