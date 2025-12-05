# AssignmentHub Client

Frontend React application for the AssignmentHub platform, built with React.js, Tailwind CSS v4, and modern development tools.

## 🎨 Tech Stack

### Core Technologies
- **React.js 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **React Query v3** - Data fetching and caching
- **Tailwind CSS v4** - Utility-first styling
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications

### Development Tools
- **Create React App** - Build tooling
- **PostCSS** - CSS processing
- **Date-fns** - Date manipulation
- **React QR Code** - QR code generation

## 🏗 Project Structure

```
client/
├── public/                    # Static assets
│   ├── index.html            # HTML template
│   ├── favicon.ico           # App icon
│   └── manifest.json         # PWA manifest
├── src/
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   ├── index.css             # Global styles and Tailwind
│   ├── components/           # Reusable components
│   │   ├── Navbar.js         # Navigation bar
│   │   ├── ClassCard.js      # Class display card
│   │   ├── AssignmentCard.js # Assignment display card
│   │   ├── CountdownTimer.js # Deadline countdown
│   │   ├── LoadingSpinner.js # Loading indicator
│   │   └── ProtectedRoute.js # Route protection
│   ├── pages/                # Page components
│   │   ├── Home.js           # Landing page
│   │   ├── Login.js          # Teacher login
│   │   ├── Register.js       # Teacher registration
│   │   ├── Dashboard.js      # Teacher dashboard
│   │   ├── CreateClass.js    # Class creation form
│   │   ├── CreateAssignment.js # Assignment creation
│   │   ├── ClassView.js      # Class management view
│   │   ├── StudentClass.js   # Student class view
│   │   ├── PublicClasses.js  # Public class browser
│   │   └── PrintSlip.js      # Printable assignment slip
│   └── contexts/             # React contexts
│       ├── AuthContext.js    # Authentication state
│       └── ThemeContext.js   # Theme management
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── .env                      # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

### Environment Variables
Create a `.env` file in the client directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Optional: Analytics or other services
# REACT_APP_ANALYTICS_ID=your_analytics_id
```

## 🎨 Design System

### Color Palette (Tailwind v4)
```css
/* Primary Colors (Blue) */
blue-50: #eff6ff
blue-500: #3b82f6
blue-600: #2563eb
blue-700: #1d4ed8

/* Secondary Colors (Purple) */
purple-50: #faf5ff
purple-500: #8b5cf6
purple-600: #7c3aed
purple-700: #6d28d9

/* Status Colors */
green-500: #10b981   /* Success/Active */
yellow-500: #f59e0b  /* Warning/Pending */
red-500: #ef4444     /* Error/Expired */
```

### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** 
  - H1: `text-3xl md:text-6xl font-bold`
  - H2: `text-2xl md:text-3xl font-bold`
  - H3: `text-xl font-semibold`
- **Body Text:** `text-base text-gray-700`
- **Small Text:** `text-sm text-gray-600`

### Component Classes
```css
/* Buttons */
.btn-primary: Blue gradient with hover effects
.btn-secondary: Purple gradient with hover effects
.btn-outline: Outlined button with hover fill

/* Cards */
.card: White background with shadow and rounded corners
.card-header: Card header with bottom border

/* Forms */
.form-input: Styled input with focus states
.form-textarea: Styled textarea with focus states
.form-label: Consistent label styling
.form-error: Error message styling

/* Status Badges */
.status-active: Green badge for active items
.status-expired: Red badge for expired items
.status-pending: Yellow badge for pending items
```

## 📱 Components

### Navigation (`components/Navbar.js`)
Responsive navigation bar with:
- Logo and branding
- Navigation links
- User authentication status
- Mobile hamburger menu
- Theme toggle (light/dark)

**Props:** None (uses AuthContext)

### Class Card (`components/ClassCard.js`)
Displays class information in card format.

**Props:**
```javascript
{
  classData: {
    _id: String,
    name: String,
    subject: String,
    passcode: String,
    teacher: String,
    assignments: Array
  },
  isTeacher: Boolean // Changes available actions
}
```

### Assignment Card (`components/AssignmentCard.js`)
Shows assignment details with status and actions.

**Props:**
```javascript
{
  assignment: {
    _id: String,
    title: String,
    description: String,
    subject: String,
    deadline: Date,
    file: Object,
    submissionInstructions: String,
    teacherNotes: String
  },
  isStudent: Boolean // Hides teacher-only content
}
```

### Countdown Timer (`components/CountdownTimer.js`)
Real-time countdown to assignment deadline.

**Props:**
```javascript
{
  deadline: Date // Assignment deadline
}
```

**Features:**
- Live countdown (days, hours, minutes, seconds)
- Visual urgency indicators
- Automatic updates every second

### Loading Spinner (`components/LoadingSpinner.js`)
Consistent loading indicator across the app.

**Props:**
```javascript
{
  size: 'sm' | 'md' | 'lg' | 'xl', // Default: 'md'
  text: String // Default: 'Loading...'
}
```

### Protected Route (`components/ProtectedRoute.js`)
Wrapper for teacher-only routes.

**Props:**
```javascript
{
  children: ReactNode // Components to protect
}
```

## 📄 Pages

### Home Page (`pages/Home.js`)
Landing page with:
- Hero section with call-to-action
- Feature highlights
- How-it-works guide
- Responsive design

### Authentication Pages
- **Login** (`pages/Login.js`): Teacher login form
- **Register** (`pages/Register.js`): Teacher registration form

**Features:**
- Form validation
- Password visibility toggle
- Error handling
- Redirect after success

### Teacher Dashboard (`pages/Dashboard.js`)
Main teacher interface showing:
- Statistics cards (classes, assignments, active)
- Recent classes and assignments
- Quick action buttons
- Responsive grid layout

### Class Management
- **Create Class** (`pages/CreateClass.js`): Form to create new classes
- **Class View** (`pages/ClassView.js`): Detailed class management
- **Create Assignment** (`pages/CreateAssignment.js`): Assignment creation form

### Student Interface
- **Public Classes** (`pages/PublicClasses.js`): Browse all classes
- **Student Class** (`pages/StudentClass.js`): View class assignments
- **Print Slip** (`pages/PrintSlip.js`): Printable assignment slip

## 🔄 State Management

### Authentication Context (`contexts/AuthContext.js`)
Manages user authentication state and actions.

**State:**
```javascript
{
  user: Object | null,
  isAuthenticated: Boolean,
  loading: Boolean,
  error: String | null
}
```

**Actions:**
- `login(email, password)` - Authenticate user
- `register(name, email, password)` - Create account
- `logout()` - Clear authentication
- `clearError()` - Clear error state

### Theme Context (`contexts/ThemeContext.js`)
Manages light/dark theme preference.

**State:**
```javascript
{
  isDark: Boolean
}
```

**Actions:**
- `toggleTheme()` - Switch between light/dark

## 🌐 API Integration

### Axios Configuration
Base configuration for API calls:

```javascript
// Default base URL from environment
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Automatic token attachment
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### React Query Setup
Data fetching and caching configuration:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Common Query Keys
```javascript
// Authentication
['user'] - Current user data

// Classes
['classes'] - Teacher's classes
['class', classId] - Specific class
['publicClasses'] - All public classes

// Assignments
['assignments'] - Teacher's assignments
['classAssignments', classId] - Class assignments
['studentClass', passcode] - Student class view

// Print
['printSlip', classId] - Print slip data
```

## 🎯 Features

### For Teachers
1. **Authentication**
   - Secure login/registration
   - JWT token management
   - Protected routes

2. **Class Management**
   - Create classes with unique passcodes
   - View and edit class details
   - Generate random passcodes

3. **Assignment Management**
   - Create assignments with files
   - Set availability and expiration dates
   - Add submission instructions
   - Private teacher notes

4. **Sharing & Printing**
   - Generate QR codes
   - Printable assignment slips
   - Share class links

### For Students
1. **Class Access**
   - Enter passcode to access classes
   - Browse public classes
   - QR code scanning support

2. **Assignment Viewing**
   - See available assignments
   - Download attached files
   - Real-time countdown timers

3. **Local Features**
   - Bookmark favorite classes
   - Quick access to saved classes
   - Offline-friendly design

## 📱 Responsive Design

### Breakpoints (Tailwind)
- **sm:** 640px and up
- **md:** 768px and up
- **lg:** 1024px and up
- **xl:** 1280px and up

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement:

```css
/* Mobile first */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 3rem; }
}
```

### Touch-Friendly Design
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Swipe-friendly card layouts

## 🔧 Build & Deployment

### Development Scripts
```bash
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Build Configuration
The app uses Create React App's default build configuration with:
- Code splitting
- Asset optimization
- Service worker (PWA ready)
- Environment variable injection

### Environment-Specific Builds
```bash
# Development
REACT_APP_API_URL=http://localhost:5000 npm start

# Production
REACT_APP_API_URL=https://api.yourdomain.com npm run build
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build and deploy
npm run build
# Upload dist folder to Netlify
```

#### Traditional Hosting
```bash
# Build for production
npm run build

# Upload build/ folder to your web server
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Registration with validation
- [ ] Login with remember me
- [ ] Logout functionality
- [ ] Protected route access

**Teacher Features:**
- [ ] Class creation and editing
- [ ] Assignment creation with files
- [ ] Print slip generation
- [ ] Dashboard statistics

**Student Features:**
- [ ] Passcode entry and validation
- [ ] Assignment viewing and downloads
- [ ] Bookmarking functionality
- [ ] QR code access

**Responsive Design:**
- [ ] Mobile navigation
- [ ] Touch-friendly interactions
- [ ] Readable text on all devices
- [ ] Proper image scaling

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Performance Optimization

### Code Splitting
React Router automatically splits code by routes:
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Image Optimization
- Use appropriate image formats (WebP when possible)
- Implement lazy loading for images
- Optimize image sizes for different screen densities

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx serve -s build
```

### Caching Strategy
- React Query handles API response caching
- Browser caching for static assets
- Service worker for offline functionality

## 🔒 Security Considerations

### Authentication
- JWT tokens stored in localStorage
- Automatic token refresh
- Secure logout (token cleanup)

### Input Validation
- Client-side form validation
- XSS prevention through React's built-in escaping
- CSRF protection through SameSite cookies

### File Handling
- File type validation before upload
- Size restrictions on client side
- Secure file URLs from server

## 🎨 Customization

### Theme Customization
Modify `tailwind.config.js` to customize colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-color',
          // ... other shades
        }
      }
    }
  }
}
```

### Component Styling
Override default styles in `src/index.css`:

```css
@layer components {
  .btn-custom {
    @apply bg-gradient-to-r from-indigo-500 to-purple-600;
  }
}
```

## 📈 Analytics & Monitoring

### Error Tracking
Consider integrating error tracking services:
- Sentry for error monitoring
- LogRocket for session replay
- Google Analytics for usage tracking

### Performance Monitoring
- Web Vitals measurement
- Bundle size monitoring
- API response time tracking

---

**Client Documentation for AssignmentHub**
*Built with React.js and Tailwind CSS v4*