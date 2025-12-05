# AssignmentHub Server

Backend API server for the AssignmentHub application built with Node.js, Express.js, and MongoDB.

## 🏗 Architecture

### Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing
- **Twilio** - SMS notifications (optional)
- **QRCode** - QR code generation

### Project Structure
```
server/
├── server.js              # Entry point and server setup
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── models/                # Database models
│   ├── User.js           # Teacher model
│   ├── Class.js          # Class model
│   └── Assignment.js     # Assignment model
├── routes/                # API route handlers
│   ├── auth.js           # Authentication routes
│   ├── classes.js        # Class management
│   ├── assignments.js    # Assignment CRUD
│   ├── student.js        # Student access routes
│   ├── print.js          # Print slip generation
│   └── notify.js         # SMS notifications
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT verification
│   └── upload.js         # File upload configuration
└── uploads/               # File storage directory
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)
- npm or yarn

### Installation
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/assignmenthub

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# CORS
CLIENT_URL=http://localhost:3000

# Optional: Twilio SMS Configuration
# TWILIO_ACCOUNT_SID=your_twilio_account_sid
# TWILIO_AUTH_TOKEN=your_twilio_auth_token
# TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## 📊 Database Models

### User Model (Teachers)
```javascript
{
  name: String,           // Teacher's full name
  email: String,          // Unique email address
  password: String,       // Hashed password
  classes: [ObjectId],    // References to Class documents
  createdAt: Date         // Account creation timestamp
}
```

### Class Model
```javascript
{
  name: String,           // Class name (e.g., "Form 4 East")
  subject: String,        // Subject name
  passcode: String,       // Unique access code (uppercase)
  teacher: ObjectId,      // Reference to User document
  assignments: [ObjectId], // References to Assignment documents
  createdAt: Date         // Class creation timestamp
}
```

### Assignment Model
```javascript
{
  title: String,              // Assignment title
  description: String,        // Assignment description
  subject: String,            // Subject name
  deadline: Date,             // Submission deadline
  availableFrom: Date,        // When assignment becomes visible
  expiresAt: Date,           // When assignment expires
  file: {                    // Optional file attachment
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  },
  submissionInstructions: String, // How to submit
  teacherNotes: String,          // Private teacher notes
  class: ObjectId,               // Reference to Class document
  teacher: ObjectId,             // Reference to User document
  createdAt: Date               // Assignment creation timestamp
}
```

## 🛣 API Routes

### Authentication Routes (`/api/auth`)

#### POST `/register`
Register a new teacher account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/login`
Authenticate teacher and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/me` (Protected)
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### Class Routes (`/api/classes`) - Protected

#### GET `/`
Get all classes for authenticated teacher.

#### POST `/`
Create a new class.

**Request Body:**
```json
{
  "name": "Form 4 East",
  "subject": "Mathematics",
  "passcode": "MATH01"
}
```

#### GET `/:id`
Get specific class with assignments.

#### PUT `/:id`
Update class information.

#### DELETE `/:id`
Delete class and remove from teacher's classes.

#### POST `/generate-passcode`
Generate a unique random passcode.

### Assignment Routes (`/api/assignments`) - Protected

#### GET `/`
Get all assignments for authenticated teacher.

#### POST `/`
Create new assignment with optional file upload.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title`: Assignment title
- `description`: Assignment description
- `subject`: Subject name
- `deadline`: Deadline date (ISO string)
- `availableFrom`: Available from date (ISO string)
- `expiresAt`: Expiration date (ISO string)
- `submissionInstructions`: How to submit
- `teacherNotes`: Private notes
- `classId`: Class ID
- `file`: File attachment (optional)

#### GET `/class/:classId`
Get all assignments for a specific class.

#### GET `/:id`
Get specific assignment details.

#### PUT `/:id`
Update assignment (supports file upload).

#### DELETE `/:id`
Delete assignment and remove from class.

### Student Routes (`/api/student`) - Public

#### GET `/class/:passcode`
Get class information and available assignments by passcode.

**Response:**
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
      "title": "Holiday Assignment 1",
      "description": "Complete exercises 1-10",
      "deadline": "2024-01-15T23:59:59.000Z",
      "file": {
        "originalName": "exercises.pdf",
        "filename": "file-123456.pdf"
      }
    }
  ]
}
```

#### GET `/classes/public`
Get list of all public classes.

### Print Routes (`/api/print`) - Protected

#### GET `/slip/:classId`
Generate printable slip with QR code for a class.

**Response:**
```json
{
  "class": {
    "name": "Form 4 East",
    "subject": "Mathematics",
    "passcode": "MATH01",
    "teacher": "John Doe"
  },
  "assignments": [...],
  "qrCode": "data:image/png;base64,...",
  "classUrl": "http://localhost:3000/class/MATH01",
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

### Notification Routes (`/api/notify`) - Protected

#### POST `/sms`
Send SMS notifications (requires Twilio configuration).

**Request Body:**
```json
{
  "phoneNumbers": ["+254700000000", "+254700000001"],
  "message": "New assignment posted!",
  "classId": "class_id_here",
  "assignmentId": "assignment_id_here"
}
```

## 🔒 Middleware

### Authentication Middleware (`middleware/auth.js`)
Verifies JWT tokens and adds user information to request object.

```javascript
// Usage in routes
router.get('/protected-route', auth, (req, res) => {
  // req.user contains authenticated user info
});
```

### Upload Middleware (`middleware/upload.js`)
Handles file uploads with validation.

**Configuration:**
- **Storage:** Local filesystem (`uploads/` directory)
- **File size limit:** 10MB
- **Allowed types:** Images, PDFs, Documents, Text files
- **Naming:** Timestamp + random number + original extension

## 🔧 Configuration

### MongoDB Connection
The server automatically connects to MongoDB on startup using the `MONGODB_URI` environment variable.

### File Storage
Files are stored locally in the `uploads/` directory. For production, consider using cloud storage (AWS S3, Google Cloud Storage).

### CORS Configuration
CORS is configured to allow requests from the client URL specified in `CLIENT_URL` environment variable.

### Twilio SMS (Optional)
SMS functionality is optional and gracefully disabled if Twilio credentials are not provided.

## 🚨 Error Handling

### Global Error Handler
All routes use a global error handler that:
- Logs errors to console
- Returns appropriate HTTP status codes
- Provides user-friendly error messages
- Hides sensitive information in production

### Common Error Responses
```json
// Validation Error (400)
{
  "message": "Validation failed",
  "errors": ["Email is required", "Password too short"]
}

// Authentication Error (401)
{
  "message": "No token provided, authorization denied"
}

// Not Found Error (404)
{
  "message": "Resource not found"
}

// Server Error (500)
{
  "message": "Internal server error"
}
```

## 📁 File Upload System

### Supported File Types
- **Images:** JPEG, PNG, GIF
- **Documents:** PDF, DOC, DOCX, TXT
- **Size Limit:** 10MB per file

### File Access
Uploaded files are accessible via:
```
GET /uploads/:filename
```

### Security Considerations
- File type validation
- Size restrictions
- Unique filename generation
- Path traversal prevention

## 🔐 Security Features

### Password Security
- Bcrypt hashing with salt rounds
- Minimum password length validation
- Password confirmation on registration

### JWT Security
- Secure secret key requirement
- Token expiration (7 days)
- Authorization header validation

### Input Validation
- Mongoose schema validation
- Custom validation rules
- Sanitization of user inputs

### File Upload Security
- MIME type validation
- File size restrictions
- Secure filename generation

## 📈 Performance Considerations

### Database Optimization
- Indexed fields (email, passcode)
- Population of related documents
- Efficient query patterns

### File Handling
- Stream-based file uploads
- Proper error handling for large files
- Cleanup of failed uploads

## 🧪 Testing

### Manual Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create a class (with JWT token)
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Test Class","subject":"Mathematics","passcode":"TEST01"}'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## 🚀 Deployment

### Environment Setup
For production deployment, ensure all environment variables are properly set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assignmenthub
JWT_SECRET=your_production_jwt_secret_very_long_and_random
CLIENT_URL=https://your-frontend-domain.com
```

### Production Considerations
- Use a production MongoDB instance
- Set up proper logging
- Configure reverse proxy (nginx)
- Enable HTTPS
- Set up monitoring and alerts
- Configure backup strategies

### Deployment Platforms
- **Railway:** Easy deployment with automatic builds
- **Render:** Free tier available with good performance
- **Heroku:** Traditional PaaS with add-ons
- **DigitalOcean App Platform:** Scalable with managed databases

## 📝 Logging

The server includes basic console logging for:
- Server startup
- Database connections
- API requests (in development)
- Errors and exceptions

For production, consider implementing structured logging with tools like Winston or Bunyan.

## 🔄 Development Workflow

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Development Tips
- Use nodemon for automatic restarts
- Enable MongoDB logging for query debugging
- Use environment-specific configurations
- Implement proper error boundaries

---

**Server Documentation for AssignmentHub**
*Built with Node.js, Express.js, and MongoDB*