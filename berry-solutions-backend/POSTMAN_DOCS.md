# Berry Solutions: Postman API Documentation

Use this guide to test the API endpoints in Postman.

## 1. Student Management

### Add Student
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/students`
- **Body (JSON)**:
```json
{
  "fullName": "Zain Ahmed",
  "dateOfBirth": "2010-05-15",
  "class": "8th",
  "section": "A",
  "parentName": "Ahmed Khan",
  "parentPhoneNumber": "923001234567",
  "address": "DHA Phase 5, Lahore",
  "rfidCardId": "RFID-123456"
}
```

### Search Student
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/students/search?query=Zain`

### Get Student Details
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/students/:id`

### Update Student
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/v1/students/:id`
- **Body (JSON)**:
```json
{
  "section": "B",
  "address": "Model Town, Lahore"
}
```
*Note: All fields are optional for update.*

### Delete Student
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/v1/students/:id`
*Note: Permanently removes the student from the system.*

---

## 2. Attendance System

### RFID Card Scan
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/attendance/rfid-scan`
- **Body (JSON)**:
```json
{
  "rfidCardId": "RFID-123456"
}
```
*Note: First scan of the day marks check-in, second scan marks check-out.*

---

## 3. WhatsApp Notifications

### Send Manual Notification
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/notifications/send`
- **Body (JSON)**:
```json
{
  "type": "absence",
  "parentPhone": "923001234567",
  "studentName": "Zain Ahmed"
}
```
*Notification Types: `absence`, `late`, `report`*

---

## Environment Variables (Postman)
- **baseUrl**: `http://localhost:5000`
