# Placement Readiness Checker (MERN Web Application)

Placement Readiness Checker is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to evaluate and enhance college students' placement readiness based on academic performance, technical skills, projects, certifications, internships, and practice quiz scores.

---

## Key Features & Highlights

- **Role-Based Portals**:
  - **Student**: Profile management, resume upload, technical skills CRUD, project portfolio, certifications, internships, practice quizzes with auto-scoring, recommendations feed, campus placement drives, and notification center.
  - **Placement Officer**: Roster search and candidate filtering (CGPA & Readiness Score), detailed student file inspection, publishing placement drives, uploading learning resources, sending direct guidance notifications, and batch analytics reporting.
  - **System Admin**: User management & role modification, quiz master engine, placement drives audit, study resource management, and overall system dashboard metrics.
- **Dynamic Placement Readiness Score Engine**:
  - **CGPA & Backlog History**: 20%
  - **Technical Skills**: 20%
  - **Projects Portfolio & Demos**: 20%
  - **Certifications**: 15%
  - **Internships**: 10%
  - **Quizzes & Aptitude**: 15%
- **Automated Personal Recommendations**: Generates priority-based actionable advice (e.g. raise CGPA, add full-stack projects, earn cloud certifications, or take practice quizzes).
- **Modern Responsive UI**: Dark/Light mode theme switching, glassmorphism design aesthetic, circular score gauges, responsive sidebars, animated progress bars, and Bootstrap 5.

---

## Folder Structure

```
PlacementReadinessChecker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── adminController.js    # System stats & user management
│   │   ├── authController.js     # Register, Login, Passwords
│   │   ├── officerController.js  # Student tracking, drives, resources
│   │   ├── quizController.js     # Quiz & Question CRUD & submission
│   │   └── studentController.js # Profile, Skills, Projects, Score
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Verification
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   ├── uploadMiddleware.js   # Multer file upload
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js, StudentProfile.js, Skill.js, Project.js
│   │   ├── Certification.js, Internship.js, Quiz.js, Question.js
│   │   ├── QuizResult.js, PlacementDrive.js, Resource.js
│   │   └── Notification.js, Suggestion.js, Report.js
│   ├── routes/
│   │   ├── adminRoutes.js, authRoutes.js, driveRoutes.js
│   │   ├── officerRoutes.js, quizRoutes.js, resourceRoutes.js
│   │   └── studentRoutes.js
│   ├── utils/
│   │   └── scoreCalculator.js    # Readiness Score & Suggestions Engine
│   ├── uploads/                  # Uploaded resumes and files
│   ├── server.js                 # Express App entry point
│   ├── seed.js                   # Pre-populates database with demo users
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/           # CircularScoreChart, Navbar, Sidebar, Cards...
    │   ├── context/              # AuthContext, ThemeContext
    │   ├── pages/                # Landing, Dashboards, Student pages, Officer pages...
    │   ├── services/             # Axios API client
    │   ├── App.jsx               # Router & Protected routes setup
    │   ├── main.jsx              # React DOM entry point
    │   └── index.css             # Glassmorphism design system & variables
    └── package.json
```

---

## Quick Start & Installation

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed     # Populate database with sample users & quizzes
npm run dev      # Start Express backend on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Start Vite React App on http://localhost:5173
```

---

## Demo Test Credentials

After running `npm run seed` in the `backend/` directory, you can log in immediately:

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@example.com` | `password123` |
| **Placement Officer** | `officer@example.com` | `password123` |
| **Student (High Performer)** | `student@example.com` | `password123` |
| **Student (Needs Improvement)** | `riya@example.com` | `password123` |

---

## REST API Endpoints

### Authentication
- `POST /api/auth/register` - Student/User registration
- `POST /api/auth/login` - Authenticate user & get JWT token
- `POST /api/auth/change-password` - Update password
- `GET  /api/auth/me` - Get logged-in user profile

### Student Module
- `GET  /api/student/profile` & `PUT /api/student/profile` - Profile management
- `POST /api/student/upload-resume` - Upload PDF resume
- `GET  /api/student/readiness-score` - Compute readiness score breakdown
- `GET  /api/student/suggestions` - Get personalized recommendations
- `GET, POST, DELETE /api/student/skills` - Skill management
- `GET, POST, DELETE /api/student/projects` - Project portfolio
- `GET, POST, DELETE /api/student/certifications` - Certifications
- `GET, POST, DELETE /api/student/internships` - Internships

### Quiz Module
- `GET  /api/quizzes` - List practice quizzes
- `POST /api/quizzes/:id/start` - Fetch questions for quiz
- `POST /api/quizzes/:id/submit` - Submit answers & auto-calculate score
- `GET  /api/quizzes/results` - Student quiz history

### Placement Officer & Admin
- `GET  /api/officer/students` - Roster with search & filters
- `POST /api/drives` & `DELETE /api/drives/:id` - Placement drive CRUD
- `POST /api/resources` & `DELETE /api/resources/:id` - Learning resources CRUD
- `POST /api/officer/notifications` - Send targeted student notifications
- `POST /api/officer/reports` - Generate batch analytics report
- `GET  /api/admin/dashboard-stats` - Admin metrics summary
- `GET, DELETE, PUT /api/admin/users` - Manage user accounts & roles
