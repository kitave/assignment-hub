# AssignmentHub API Documentation

Complete API reference for the AssignmentHub backend server.

## 🌐 Base URL

```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle
- **Expiration:** 7 days
- **Refresh:** Automatic on valid requests
- **Storage:** Client-side (localStorage recommended)

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error message",
  "statusCode": 400
}
```

## 🛣 Endpoints

## Authentication Endpoints

### POST `/auth/register`
Register a new teacher account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, 1-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Validation errors or email already exists
- `500`: Server error

---

### POST `/auth/login`
Authenticate teacher and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `500`: Server error

---

### GET `/auth/me`
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "classes": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Form 4 East",
      "subject": "Mathematics",
      "passcode": "MATH01"
    }
  ],
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
- `401`: Invalid or missing token
- `500`: Server error

## Class Management Endpoints (Protected)

### GET `/classes`
Get all classes for the authenticated teacher.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01",
    "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
    "assignments": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
        "title": "Holiday Assignment 1",
        "deadline": "2024-01-15T23:59:59.000Z"
      }
    ],
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

---

### POST `/classes`
Create a new class.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Form 4 East",
  "subject": "Mathematics",
  "passcode": "MATH01"
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters
- `subject`: Required, 1-50 characters
- `passcode`: Required, 4-8 characters, unique, uppercase

**Success Response (201):**
```json
{
  "message": "Class created successfully",
  "class": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01",
    "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
    "assignments": [],
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation errors or passcode already exists
- `401`: Unauthorized
- `500`: Server error

---

### GET `/classes/:id`
Get a specific class with its assignments.

**Parameters:**
- `id`: Class ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
  "name": "Form 4 East",
  "subject": "Mathematics",
  "passcode": "MATH01",
  "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
  "assignments": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "title": "Holiday Assignment 1",
      "description": "Complete exercises 1-10",
      "deadline": "2024-01-15T23:59:59.000Z",
      "file": {
        "filename": "assignment-123456.pdf",
        "originalName": "exercises.pdf"
      }
    }
  ],
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
- `404`: Class not found or not owned by user
- `401`: Unauthorized
- `500`: Server error

---

### PUT `/classes/:id`
Update class information.

**Parameters:**
- `id`: Class ID

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Form 4 West",
  "subject": "Advanced Mathematics"
}
```

**Success Response (200):**
```json
{
  "message": "Class updated successfully",
  "class": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Form 4 West",
    "subject": "Advanced Mathematics",
    "passcode": "MATH01",
    "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### DELETE `/classes/:id`
Delete a class and all its assignments.

**Parameters:**
- `id`: Class ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Class deleted successfully"
}
```

**Error Responses:**
- `404`: Class not found or not owned by user
- `401`: Unauthorized
- `500`: Server error

---

### POST `/classes/generate-passcode`
Generate a unique random passcode.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "passcode": "XYZ789"
}
```

## Assignment Management Endpoints (Protected)

### GET `/assignments`
Get all assignments for the authenticated teacher.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `classId` (optional): Filter by specific class

**Success Response (200):**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "title": "Holiday Assignment 1",
    "description": "Complete exercises 1-10 from the textbook",
    "subject": "Mathematics",
    "deadline": "2024-01-15T23:59:59.000Z",
    "availableFrom": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-20T23:59:59.000Z",
    "file": {
      "filename": "assignment-123456.pdf",
      "originalName": "exercises.pdf",
      "mimetype": "application/pdf",
      "size": 1024000
    },
    "submissionInstructions": "Submit via email to teacher@school.com",
    "teacherNotes": "Focus on algebraic expressions",
    "class": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Form 4 East",
      "subject": "Mathematics",
      "passcode": "MATH01"
    },
    "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

---

### POST `/assignments`
Create a new assignment with optional file upload.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
title: "Holiday Assignment 1"
description: "Complete exercises 1-10 from the textbook"
subject: "Mathematics"
deadline: "2024-01-15T23:59:59.000Z"
availableFrom: "2024-01-01T00:00:00.000Z"
expiresAt: "2024-01-20T23:59:59.000Z"
submissionInstructions: "Submit via email"
teacherNotes: "Focus on algebraic expressions"
classId: "60f7b3b3b3b3b3b3b3b3b3b4"
file: <binary_file_data>
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Required, 1-2000 characters
- `subject`: Required, 1-50 characters
- `deadline`: Required, must be in the future
- `expiresAt`: Required, must be after deadline
- `classId`: Required, must be owned by teacher
- `file`: Optional, max 10MB, allowed types: images, PDFs, documents

**Success Response (201):**
```json
{
  "message": "Assignment created successfully",
  "assignment": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "title": "Holiday Assignment 1",
    "description": "Complete exercises 1-10 from the textbook",
    "subject": "Mathematics",
    "deadline": "2024-01-15T23:59:59.000Z",
    "availableFrom": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-20T23:59:59.000Z",
    "file": {
      "filename": "assignment-123456.pdf",
      "originalName": "exercises.pdf",
      "path": "uploads/assignment-123456.pdf",
      "mimetype": "application/pdf",
      "size": 1024000
    },
    "submissionInstructions": "Submit via email",
    "teacherNotes": "Focus on algebraic expressions",
    "class": "60f7b3b3b3b3b3b3b3b3b3b4",
    "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation errors or file upload issues
- `404`: Class not found
- `401`: Unauthorized
- `500`: Server error

---

### GET `/assignments/class/:classId`
Get all assignments for a specific class.

**Parameters:**
- `classId`: Class ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "title": "Holiday Assignment 1",
    "description": "Complete exercises 1-10",
    "deadline": "2024-01-15T23:59:59.000Z",
    "file": {
      "filename": "assignment-123456.pdf",
      "originalName": "exercises.pdf"
    }
  }
]
```

---

### GET `/assignments/:id`
Get a specific assignment.

**Parameters:**
- `id`: Assignment ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
  "title": "Holiday Assignment 1",
  "description": "Complete exercises 1-10 from the textbook",
  "subject": "Mathematics",
  "deadline": "2024-01-15T23:59:59.000Z",
  "availableFrom": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2024-01-20T23:59:59.000Z",
  "file": {
    "filename": "assignment-123456.pdf",
    "originalName": "exercises.pdf",
    "mimetype": "application/pdf",
    "size": 1024000
  },
  "submissionInstructions": "Submit via email",
  "teacherNotes": "Focus on algebraic expressions",
  "class": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01"
  },
  "teacher": "60f7b3b3b3b3b3b3b3b3b3b3",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

---

### PUT `/assignments/:id`
Update an assignment.

**Parameters:**
- `id`: Assignment ID

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:** (Same as POST, all fields optional except required validations)

**Success Response (200):**
```json
{
  "message": "Assignment updated successfully",
  "assignment": { ... }
}
```

---

### DELETE `/assignments/:id`
Delete an assignment.

**Parameters:**
- `id`: Assignment ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Assignment deleted successfully"
}
```

## Student Access Endpoints (Public)

### GET `/student/class/:passcode`
Get class information and available assignments by passcode.

**Parameters:**
- `passcode`: Class passcode (case-insensitive)

**Success Response (200):**
```json
{
  "class": {
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01",
    "teacher": "John Doe"
  },
  "assignments": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "title": "Holiday Assignment 1",
      "description": "Complete exercises 1-10",
      "subject": "Mathematics",
      "deadline": "2024-01-15T23:59:59.000Z",
      "availableFrom": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-20T23:59:59.000Z",
      "file": {
        "filename": "assignment-123456.pdf",
        "originalName": "exercises.pdf"
      },
      "submissionInstructions": "Submit via email"
    }
  ]
}
```

**Notes:**
- Only returns assignments that are currently available (between `availableFrom` and `expiresAt`)
- Teacher notes are excluded from the response
- Passcode lookup is case-insensitive

**Error Responses:**
- `404`: Class not found with the provided passcode
- `500`: Server error

---

### GET `/student/classes/public`
Get a list of all public classes.

**Success Response (200):**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01",
    "teacher": {
      "name": "John Doe"
    }
  },
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "name": "Form 3 West",
    "subject": "Physics",
    "passcode": "PHYS01",
    "teacher": {
      "name": "Jane Smith"
    }
  }
]
```

## Print & Utility Endpoints (Protected)

### GET `/print/slip/:classId`
Generate printable slip with QR code for a class.

**Parameters:**
- `classId`: Class ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "class": {
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01",
    "teacher": "John Doe"
  },
  "assignments": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "title": "Holiday Assignment 1",
      "description": "Complete exercises 1-10",
      "deadline": "2024-01-15T23:59:59.000Z",
      "submissionInstructions": "Submit via email"
    }
  ],
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "classUrl": "http://localhost:3000/class/MATH01",
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Notes:**
- QR code is generated as a base64-encoded PNG image
- Only includes currently active assignments
- Designed for printing/PDF generation

---

### GET `/print/assignment/:assignmentId`
Generate printable slip for a specific assignment.

**Parameters:**
- `assignmentId`: Assignment ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "assignment": {
    "title": "Holiday Assignment 1",
    "description": "Complete exercises 1-10",
    "subject": "Mathematics",
    "deadline": "2024-01-15T23:59:59.000Z",
    "submissionInstructions": "Submit via email"
  },
  "class": {
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01"
  },
  "teacher": "John Doe",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "classUrl": "http://localhost:3000/class/MATH01",
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Notification Endpoints (Protected)

### POST `/notify/sms`
Send SMS notifications (requires Twilio configuration).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phoneNumbers": ["+254700000000", "+254700000001"],
  "message": "New assignment posted for Form 4 East Mathematics!",
  "classId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "assignmentId": "60f7b3b3b3b3b3b3b3b3b3b5"
}
```

**Success Response (200):**
```json
{
  "message": "SMS notifications processed",
  "results": [
    {
      "phoneNumber": "+254700000000",
      "status": "sent",
      "messageId": "SM1234567890abcdef"
    },
    {
      "phoneNumber": "+254700000001",
      "status": "failed",
      "error": "Invalid phone number"
    }
  ]
}
```

**Notes:**
- Requires Twilio credentials in environment variables
- If Twilio is not configured, returns 400 error
- Automatically appends class/assignment information to message
- Processes each phone number individually

**Error Responses:**
- `400`: SMS service not configured or validation errors
- `401`: Unauthorized
- `500`: Server error

## File Access

### GET `/uploads/:filename`
Access uploaded files.

**Parameters:**
- `filename`: File name as stored on server

**Success Response (200):**
- Returns the file with appropriate Content-Type header
- Supports common file types: images, PDFs, documents

**Error Responses:**
- `404`: File not found
- `403`: Access denied (if implemented)

## Health Check

### GET `/health`
Check server health and status.

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "AssignmentHub server is running!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Codes Reference

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `413`: Payload Too Large (file size exceeded)
- `422`: Unprocessable Entity (validation failed)
- `500`: Internal Server Error

### Common Error Messages
```json
// Validation Error
{
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}

// Authentication Error
{
  "message": "No token provided, authorization denied"
}

// Not Found Error
{
  "message": "Class not found with this passcode"
}

// File Upload Error
{
  "message": "File size exceeds 10MB limit"
}

// Duplicate Error
{
  "message": "Passcode already exists. Please choose another."
}
```

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended for production:

- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute
- General API endpoints: 100 requests per minute

## API Versioning

Current API version: `v1`

Future versions will be accessible via:
```
/api/v2/endpoint
```

---

**Complete API Documentation for AssignmentHub**
*RESTful API built with Node.js and Express.js*