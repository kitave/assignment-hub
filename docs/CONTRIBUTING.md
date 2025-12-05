# Contributing to AssignmentHub

Thank you for your interest in contributing to AssignmentHub! This document provides guidelines and information for contributors.

## 🌟 Welcome Contributors

AssignmentHub is an open-source project designed to help Kenyan high school teachers share assignments with students during holidays. We welcome contributions from developers, designers, educators, and anyone passionate about improving education technology.

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Report bugs through GitHub Issues
- Provide detailed reproduction steps
- Include screenshots or error messages
- Specify your environment (OS, browser, Node.js version)

### 💡 Feature Requests
- Suggest new features via GitHub Issues
- Explain the use case and benefits
- Consider the impact on both teachers and students
- Provide mockups or detailed descriptions

### 🔧 Code Contributions
- Fix bugs and implement features
- Improve performance and security
- Add tests and documentation
- Enhance user experience

### 📚 Documentation
- Improve existing documentation
- Add tutorials and guides
- Translate content to local languages
- Create video tutorials

### 🎨 Design Contributions
- UI/UX improvements
- Mobile responsiveness enhancements
- Accessibility improvements
- Icon and graphic design

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- MongoDB (local or cloud)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/assignmenthub.git
   cd assignmenthub
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all project dependencies
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit with your local configuration
   nano server/.env
   nano client/.env
   ```

4. **Start Development Servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   ```

5. **Verify Setup**
   - Backend: http://localhost:5000/api
   - Frontend: http://localhost:5173

## 📋 Development Guidelines

### Code Style

#### JavaScript/React
- Use ES6+ features
- Follow React Hooks patterns
- Use functional components
- Implement proper error boundaries

```javascript
// Good
const MyComponent = ({ data }) => {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <div>{data.name}</div>;
};

// Avoid
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }
}
```

#### Node.js/Express
- Use async/await over callbacks
- Implement proper error handling
- Follow RESTful API conventions
- Use middleware for common functionality

```javascript
// Good
const createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);
    res.status(201).json({ message: 'Success', class: classData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Avoid
const createClass = (req, res) => {
  Class.create(req.body, (err, classData) => {
    if (err) return res.status(400).json({ error: err });
    res.json(classData);
  });
};
```

### File Organization

#### Frontend Structure
```
client/src/
├── components/          # Reusable components
│   ├── common/         # Generic components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── styles/             # Global styles
```

#### Backend Structure
```
server/
├── controllers/        # Route handlers
├── middleware/         # Custom middleware
├── models/            # Database models
├── routes/            # Route definitions
├── services/          # Business logic
├── utils/             # Utility functions
└── tests/             # Test files
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.js`)
- **Components**: PascalCase (`UserProfile.jsx`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Database Models**: PascalCase (`User`, `Assignment`)

### Git Workflow

#### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

#### Commit Messages
Follow conventional commits format:

```bash
# Format
type(scope): description

# Examples
feat(auth): add password reset functionality
fix(api): resolve file upload validation error
docs(readme): update installation instructions
style(ui): improve mobile responsiveness
refactor(db): optimize user query performance
test(auth): add login integration tests
```

#### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/assignment-templates
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Run tests
   npm test
   
   # Test manually
   npm run dev
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(assignments): add template functionality"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/assignment-templates
   # Create PR on GitHub
   ```

## 🧪 Testing Guidelines

### Frontend Testing
```bash
cd client
npm test
```

#### Test Structure
```javascript
// components/__tests__/ClassCard.test.js
import { render, screen } from '@testing-library/react';
import ClassCard from '../ClassCard';

describe('ClassCard', () => {
  const mockClass = {
    name: 'Form 4 East',
    subject: 'Mathematics',
    passcode: 'MATH01'
  };

  test('renders class information', () => {
    render(<ClassCard classData={mockClass} />);
    expect(screen.getByText('Form 4 East')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
  });
});
```

### Backend Testing
```bash
cd server
npm test
```

#### Test Structure
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('POST /api/auth/register', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.token).toBeDefined();
  });
});
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Simplicity**: Keep interfaces clean and intuitive
- **Accessibility**: Ensure usability for all users
- **Mobile-First**: Design for mobile devices first
- **Consistency**: Maintain consistent patterns

### Color Palette
```css
/* Primary Colors */
--blue-500: #3B82F6;    /* Primary actions */
--purple-500: #8B5CF6;  /* Secondary actions */

/* Status Colors */
--green-500: #10B981;   /* Success/Active */
--yellow-500: #F59E0B;  /* Warning/Pending */
--red-500: #EF4444;     /* Error/Expired */

/* Neutral Colors */
--gray-50: #F9FAFB;     /* Background */
--gray-900: #111827;    /* Text */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold (600-700 weight)
- **Body Text**: Regular (400 weight)
- **Line Height**: 1.5 for body, 1.2 for headings

### Component Guidelines

#### Buttons
```jsx
// Primary button
<button className="btn-primary">
  Create Assignment
</button>

// Secondary button
<button className="btn-secondary">
  Save Draft
</button>

// Outline button
<button className="btn-outline">
  Cancel
</button>
```

#### Cards
```jsx
<div className="card">
  <div className="card-header">
    <h3>Assignment Title</h3>
  </div>
  <div className="card-body">
    <p>Assignment content...</p>
  </div>
</div>
```

## 🌍 Internationalization

### Adding New Languages

1. **Create Language Files**
   ```javascript
   // client/src/locales/sw.json (Swahili)
   {
     "common": {
       "login": "Ingia",
       "register": "Jisajili",
       "dashboard": "Dashibodi"
     },
     "assignments": {
       "create": "Unda Kazi",
       "deadline": "Muda wa Mwisho"
     }
   }
   ```

2. **Update i18n Configuration**
   ```javascript
   // client/src/i18n.js
   import sw from './locales/sw.json';
   
   const resources = {
     en: { translation: en },
     sw: { translation: sw }
   };
   ```

### Translation Guidelines
- Use clear, simple language
- Consider cultural context
- Test with native speakers
- Maintain consistent terminology

## 🔒 Security Guidelines

### Frontend Security
- Validate all user inputs
- Sanitize data before display
- Use HTTPS in production
- Implement proper authentication

```javascript
// Input validation example
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### Backend Security
- Use parameterized queries
- Implement rate limiting
- Validate file uploads
- Secure environment variables

```javascript
// Input sanitization
const sanitizeInput = (input) => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

## 📱 Mobile Development

### Responsive Design
- Use Tailwind's responsive utilities
- Test on multiple device sizes
- Ensure touch-friendly interactions
- Optimize for slow connections

```css
/* Mobile-first responsive design */
.container {
  @apply px-4;          /* Mobile */
  @apply md:px-6;       /* Tablet */
  @apply lg:px-8;       /* Desktop */
}
```

### Performance Optimization
- Lazy load components
- Optimize images
- Minimize bundle size
- Use service workers

## 🚀 Performance Guidelines

### Frontend Performance
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize bundle splitting
- Cache API responses

```javascript
// Component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Complex rendering */}</div>;
});
```

### Backend Performance
- Use database indexes
- Implement caching
- Optimize queries
- Monitor response times

```javascript
// Database indexing
const ClassSchema = new mongoose.Schema({
  passcode: { type: String, index: true, unique: true },
  teacher: { type: ObjectId, index: true }
});
```

## 🔍 Code Review Process

### Review Checklist

#### Functionality
- [ ] Code works as expected
- [ ] Edge cases are handled
- [ ] Error handling is implemented
- [ ] Tests pass

#### Code Quality
- [ ] Code is readable and well-documented
- [ ] Follows project conventions
- [ ] No code duplication
- [ ] Performance considerations addressed

#### Security
- [ ] Input validation implemented
- [ ] No sensitive data exposed
- [ ] Authentication/authorization correct
- [ ] SQL injection prevention

#### UI/UX
- [ ] Responsive design
- [ ] Accessibility compliance
- [ ] Consistent with design system
- [ ] Good user experience

### Review Comments
- Be constructive and specific
- Explain the "why" behind suggestions
- Acknowledge good practices
- Suggest alternatives when possible

## 🏆 Recognition

### Contributors Hall of Fame
We recognize contributors in several ways:
- GitHub contributors page
- Monthly contributor highlights
- Special mentions in release notes
- Contributor badges and certificates

### Contribution Levels
- **First-time Contributor**: Welcome badge
- **Regular Contributor**: 5+ merged PRs
- **Core Contributor**: 20+ merged PRs
- **Maintainer**: Trusted with review privileges

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat (link in README)
- **Email**: maintainers@assignmenthub.com

### Mentorship Program
New contributors can request mentorship:
- Pair programming sessions
- Code review guidance
- Architecture discussions
- Career advice

## 📅 Release Process

### Version Numbering
We follow Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Schedule
- **Major releases**: Quarterly
- **Minor releases**: Monthly
- **Patch releases**: As needed

### Release Notes
Each release includes:
- New features
- Bug fixes
- Breaking changes
- Migration guides
- Contributor acknowledgments

## 🎓 Educational Impact

### Success Metrics
We track our impact through:
- Number of teachers using the platform
- Students reached
- Assignments shared
- User feedback and testimonials

### Case Studies
We document success stories:
- School implementations
- Teacher testimonials
- Student feedback
- Usage statistics

## 🌱 Future Roadmap

### Short-term Goals (3-6 months)
- Mobile app development
- Offline functionality
- Advanced analytics
- Multi-language support

### Long-term Vision (1-2 years)
- Integration with school systems
- Parent portal
- Grade tracking
- Video assignment support

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race
- Ethnicity
- Age
- Religion
- Nationality

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment or discriminatory language
- Personal attacks or insults
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## 📄 License

By contributing to AssignmentHub, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AssignmentHub!**

*Together, we're making education more accessible for Kenyan students and teachers.*

## 🤝 Quick Start Checklist

Ready to contribute? Here's your quick start checklist:

- [ ] Fork the repository
- [ ] Set up development environment
- [ ] Read the contributing guidelines
- [ ] Pick an issue or create a feature request
- [ ] Create a feature branch
- [ ] Make your changes
- [ ] Add tests
- [ ] Update documentation
- [ ] Submit a pull request
- [ ] Respond to code review feedback
- [ ] Celebrate your contribution! 🎉

Welcome to the AssignmentHub community!