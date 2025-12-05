# AssignmentHub - MERN Application

A complete full-stack MERN application designed for Kenyan high school teachers to share assignments with students during holidays. Features a modern light blue and purple theme with production-ready UI components.

# Deployment link:
*https://assignment-hub-eight.vercel.app*

## 🌟 Features

### For Teachers (Authenticated Users)
- 🔐 **Secure Authentication** - JWT-based login system
- 📚 **Class Management** - Create classes with unique passcodes
- 📝 **Assignment Creation** - Post assignments with file uploads
- ⏰ **Scheduling** - Set availability and expiration dates
- 📄 **Print Slips** - Generate QR code-enabled assignment slips
- 📱 **SMS Notifications** - Optional Twilio integration
- 🔒 **Private Notes** - Add teacher-only notes to assignments

### For Students (Anonymous Access)
- 🔑 **Passcode Access** - Enter class passcode to view assignments
- 📋 **Assignment Viewing** - See all available assignments and deadlines
- ⏳ **Countdown Timers** - Real-time deadline tracking
- 📥 **File Downloads** - Download assignment files and resources
- 🔖 **Local Bookmarking** - Save favorite classes for quick access
- 📱 **QR Code Support** - Scan QR codes for instant class access
- 🌐 **Public Browse** - Explore all available classes

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Twilio** - SMS notifications (optional)
- **QRCode** - QR code generation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS v4** - Utility-first styling
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Date-fns** - Date manipulation
- **Axios** - HTTP client

## 🎨 Design System

### Color Palette
- **Primary (Blue)**: `#3B82F6` - Main actions, headers
- **Secondary (Purple)**: `#8B5CF6` - Accents, secondary actions
- **Success (Green)**: `#10B981` - Success states, active items
- **Warning (Yellow)**: `#F59E0B` - Warnings, pending states
- **Danger (Red)**: `#EF4444` - Errors, expired items

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight
- **Code**: Monospace fallback

## 📁 Project Structure

```
assignment-hub/
├── README.md                   # Main documentation
├── package.json               # Root dependencies
├── server/                    # Backend application
│   ├── README.md             # Server documentation
│   ├── server.js             # Entry point
│   ├── package.json          # Server dependencies
│   ├── .env                  # Environment variables
│   ├── models/               # Database models
│   │   ├── User.js          # Teacher model
│   │   ├── Class.js         # Class model
│   │   └── Assignment.js    # Assignment model
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication
│   │   ├── classes.js       # Class management
│   │   ├── assignments.js   # Assignment CRUD
│   │   ├── student.js       # Student access
│   │   ├── print.js         # Print slip generation
│   │   └── notify.js        # SMS notifications
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # JWT verification
│   │   └── upload.js        # File upload handling
│   └── uploads/              # File storage directory
├── client/                   # Frontend application
│   ├── README.md            # Client documentation
│   ├── package.json         # Client dependencies
│   ├── .env                 # Client environment
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # Entry point
│   │   ├── index.css        # Global styles
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── ClassCard.js
│   │   │   ├── AssignmentCard.js
│   │   │   ├── CountdownTimer.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateClass.js
│   │   │   ├── CreateAssignment.js
│   │   │   ├── ClassView.js
│   │   │   ├── StudentClass.js
│   │   │   ├── PublicClasses.js
│   │   │   └── PrintSlip.js
│   │   └── contexts/        # React contexts
│   │       ├── AuthContext.js
│   │       └── ThemeContext.js
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
└── docs/                    # Additional documentation
    ├── API.md              # API documentation
    ├── DEPLOYMENT.md       # Deployment guide
    └── CONTRIBUTING.md     # Contribution guidelines
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **MongoDB** (local or cloud)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment-hub
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies for both server and client
   npm install
   
   # Install all project dependencies
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/assignmenthub
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   CLIENT_URL=http://localhost:3000
   
   # Optional: Twilio SMS Configuration
   # TWILIO_ACCOUNT_SID=your_twilio_account_sid
   # TWILIO_AUTH_TOKEN=your_twilio_auth_token
   # TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

   Create `client/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This starts both servers:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

## 📱 Usage Guide

### For Teachers

1. **Registration & Login**
   - Visit `/register` to create an account
   - Login at `/login` with your credentials

2. **Create Classes**
   - Go to `/create-class`
   - Enter class name, subject, and passcode
   - Use the generate button for random passcodes

3. **Post Assignments**
   - Navigate to `/create-assignment`
   - Fill in assignment details and deadlines
   - Upload files (images, PDFs, documents)
   - Set availability and expiration dates

4. **Manage Classes**
   - View all classes from the dashboard
   - Click "View Class" to see assignments
   - Generate print slips with QR codes
   - Share passcodes with students

### For Students

1. **Access Classes**
   - Visit `/classes` to browse all classes
   - Enter passcode in the quick access box
   - Or scan QR code with phone camera

2. **View Assignments**
   - See all available assignments
   - Check countdown timers for deadlines
   - Download attached files
   - Follow submission instructions

3. **Bookmark Classes**
   - Click bookmark icon to save classes
   - Quick access to frequently visited classes

## 🔧 Configuration

### SMS Notifications (Optional)

To enable SMS features:

1. **Sign up for Twilio**
   - Create account at https://www.twilio.com
   - Get Account SID, Auth Token, and phone number

2. **Update server/.env**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. **Features Enabled**
   - Send assignment notifications
   - Share class passcodes via SMS
   - Deadline reminders

### File Upload Limits

- **Maximum file size**: 10MB
- **Allowed types**: Images (JPG, PNG, GIF), PDFs, Documents (DOC, DOCX), Text files
- **Storage**: Local filesystem (`server/uploads/`)

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Teacher registration
- `POST /api/auth/login` - Teacher login
- `GET /api/auth/me` - Get current user

### Class Management (Protected)
- `GET /api/classes` - Get teacher's classes
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `POST /api/classes/generate-passcode` - Generate random passcode

### Assignment Management (Protected)
- `GET /api/assignments` - Get teacher's assignments
- `POST /api/assignments` - Create assignment (with file upload)
- `GET /api/assignments/class/:classId` - Get class assignments
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Student Access (Public)
- `GET /api/student/class/:passcode` - Get class by passcode
- `GET /api/student/classes/public` - Get all public classes

### Utilities
- `GET /api/print/slip/:classId` - Generate printable slip
- `POST /api/notify/sms` - Send SMS notifications
- `GET /api/health` - Health check

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **File Validation** - Type and size restrictions
- **Input Sanitization** - Prevent injection attacks
- **CORS Configuration** - Cross-origin request handling
- **Environment Variables** - Sensitive data protection

## 🌐 Deployment

### Backend Deployment (Railway/Render)
1. Create account on Railway or Render
2. Connect your repository
3. Set environment variables
4. Deploy the `server` folder

### Frontend Deployment (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect your repository
3. Set build directory to `client`
4. Set environment variables
5. Deploy

### Environment Variables for Production
```env
# Server
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.com

# Client
REACT_APP_API_URL=https://your-backend-domain.com
```

## 🧪 Testing

### Manual Testing Checklist

**Teacher Flow:**
- [ ] Registration and login
- [ ] Class creation with passcode
- [ ] Assignment creation with files
- [ ] Print slip generation
- [ ] SMS notifications (if configured)

**Student Flow:**
- [ ] Passcode entry and class access
- [ ] Assignment viewing and file download
- [ ] Countdown timer functionality
- [ ] Bookmarking classes
- [ ] QR code scanning

**Security:**
- [ ] Protected routes require authentication
- [ ] File upload restrictions work
- [ ] Invalid passcodes are rejected

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
- Check existing [Issues](../../issues)
- Create a new issue with detailed description
- Contact the development team

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Basic MERN stack setup
- [x] Teacher authentication
- [x] Class and assignment management
- [x] Student anonymous access
- [x] File upload system
- [x] Print slip generation

### Phase 2 (Planned)
- [ ] Assignment submission portal
- [ ] Grade tracking system
- [ ] Parent portal access
- [ ] Push notifications
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Integration with school systems
- [ ] Video assignment support

## 🙏 Acknowledgments

- Built for the Kenyan education system
- Inspired by the need for accessible holiday assignments
- Thanks to all teachers and students who provided feedback
- Special thanks to the open-source community

---

**Built with ❤️ for Kenyan Education**

*AssignmentHub - Making education accessible, one assignment at a time.*
