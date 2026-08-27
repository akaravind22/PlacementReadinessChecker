const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Certification = require('./models/Certification');
const Internship = require('./models/Internship');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const PlacementDrive = require('./models/PlacementDrive');
const Resource = require('./models/Resource');
const Notification = require('./models/Notification');
const { calculateReadinessScore } = require('./utils/scoreCalculator');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_readiness_db');
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Certification.deleteMany({});
    await Internship.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await PlacementDrive.deleteMany({});
    await Resource.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Cleared old collections...');

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: commonPassword,
      role: 'Admin',
      phone: '+91 9876543210'
    });

    // 2. Create Placement Officer
    const officer = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'officer@example.com',
      password: commonPassword,
      role: 'Placement Officer',
      phone: '+91 9876543211'
    });

    // 3. Create Demo Student 1 (High performer)
    const student1 = await User.create({
      name: 'Aarav Patel',
      email: 'student@example.com',
      password: commonPassword,
      role: 'Student',
      phone: '+91 9876543212'
    });

    await StudentProfile.create({
      userId: student1._id,
      college: 'National Institute of Technology',
      department: 'Computer Science & Engineering',
      year: '4th Year',
      cgpa: 8.8,
      backlogs: 0,
      github: 'https://github.com/aaravpatel',
      linkedin: 'https://linkedin.com/in/aaravpatel',
      readinessScore: 88
    });

    await Skill.insertMany([
      { studentId: student1._id, skillName: 'Data Structures & Algorithms', level: 'Expert' },
      { studentId: student1._id, skillName: 'React.js', level: 'Advanced' },
      { studentId: student1._id, skillName: 'Node.js & Express', level: 'Advanced' },
      { studentId: student1._id, skillName: 'MongoDB', level: 'Intermediate' },
      { studentId: student1._id, skillName: 'Java Programming', level: 'Advanced' }
    ]);

    await Project.insertMany([
      {
        studentId: student1._id,
        title: 'Placement Readiness Checker MERN App',
        description: 'Full-stack platform to calculate placement score and provide dynamic feedback.',
        technology: 'React, Node, Express, MongoDB',
        githubLink: 'https://github.com/aaravpatel/placement-checker',
        liveLink: 'https://placement-checker.demo.app'
      },
      {
        studentId: student1._id,
        title: 'AI Smart Resume Parser',
        description: 'NLP based document extraction tool for HR recruitment portals.',
        technology: 'Python, Flask, Spacy, React',
        githubLink: 'https://github.com/aaravpatel/resume-parser',
        liveLink: 'https://resumeparser.demo.app'
      }
    ]);

    await Certification.insertMany([
      {
        studentId: student1._id,
        courseName: 'AWS Certified Developer Associate',
        provider: 'Amazon Web Services',
        completionDate: '2025-11-15',
        certificateURL: 'https://aws.amazon.com/verify/123456'
      },
      {
        studentId: student1._id,
        courseName: 'Meta Front-End Developer Specialization',
        provider: 'Coursera / Meta',
        completionDate: '2025-08-20',
        certificateURL: 'https://coursera.org/verify/meta789'
      }
    ]);

    await Internship.insertMany([
      {
        studentId: student1._id,
        company: 'Microsoft India Tech',
        role: 'Software Engineering Intern',
        duration: '3 Months (Summer 2025)',
        description: 'Worked on cloud microservices telemetry monitoring using Azure and Node.js.'
      }
    ]);

    // 4. Create Demo Student 2 (Average / Needs Improvement)
    const student2 = await User.create({
      name: 'Riya Verma',
      email: 'riya@example.com',
      password: commonPassword,
      role: 'Student',
      phone: '+91 9876543213'
    });

    await StudentProfile.create({
      userId: student2._id,
      college: 'City Engineering College',
      department: 'Information Technology',
      year: '3rd Year',
      cgpa: 6.4,
      backlogs: 1,
      github: '',
      linkedin: 'https://linkedin.com/in/riyaverma',
      readinessScore: 42
    });

    await Skill.insertMany([
      { studentId: student2._id, skillName: 'HTML & CSS', level: 'Intermediate' },
      { studentId: student2._id, skillName: 'Python Basics', level: 'Beginner' }
    ]);

    // Calculate score for student 1 and 2
    await calculateReadinessScore(student1._id);
    await calculateReadinessScore(student2._id);

    // 5. Create Quizzes & Questions
    const quiz1 = await Quiz.create({
      title: 'Full Stack Web Development & Core CS',
      category: 'Technical',
      totalMarks: 100
    });

    await Question.insertMany([
      {
        quizId: quiz1._id,
        question: 'Which HTTP status code indicates a successful resource creation?',
        options: ['200 OK', '201 Created', '204 No Content', '400 Bad Request'],
        correctAnswer: 1
      },
      {
        quizId: quiz1._id,
        question: 'What is the primary function of the Event Loop in Node.js?',
        options: ['Execute blocking CPU operations', 'Handle non-blocking asynchronous I/O callbacks', 'Compile JavaScript to bytecode', 'Manage database schemas'],
        correctAnswer: 1
      },
      {
        quizId: quiz1._id,
        question: 'Which MongoDB method is used to insert a single document into a collection?',
        options: ['collection.addOne()', 'collection.insertOne()', 'collection.append()', 'collection.saveOne()'],
        correctAnswer: 1
      },
      {
        quizId: quiz1._id,
        question: 'What hook is used in React to manage side effects like data fetching?',
        options: ['useState', 'useContext', 'useEffect', 'useReducer'],
        correctAnswer: 2
      }
    ]);

    const quiz2 = await Quiz.create({
      title: 'Quantitative Aptitude & Logical Reasoning',
      category: 'Aptitude',
      totalMarks: 100
    });

    await Question.insertMany([
      {
        quizId: quiz2._id,
        question: 'If a train runs at 60 km/h, how many meters per second is that?',
        options: ['16.67 m/s', '15.00 m/s', '18.33 m/s', '20.00 m/s'],
        correctAnswer: 0
      },
      {
        quizId: quiz2._id,
        question: 'If 6 men can complete a project in 12 days, how many days will 8 men take?',
        options: ['9 days', '8 days', '10 days', '6 days'],
        correctAnswer: 0
      }
    ]);

    // 6. Create Placement Drives
    await PlacementDrive.insertMany([
      {
        company: 'Google India',
        role: 'Associate Software Engineer (ASE)',
        package: '22 LPA',
        eligibility: 'CGPA >= 8.0, 0 Active Backlogs',
        location: 'Bengaluru / Hyderabad',
        deadline: '2026-08-30',
        description: 'Opportunity for final year CSE/IT students skilled in Data Structures, Algorithms, and System Design.',
        applyLink: 'https://careers.google.com'
      },
      {
        company: 'Tata Consultancy Services (TCS)',
        role: 'Digital & Ninja Developer',
        package: '7.5 LPA - 11.5 LPA',
        eligibility: 'CGPA >= 6.5, Max 1 Backlog',
        location: 'Pan India',
        deadline: '2026-09-15',
        description: 'Mass recruitment drive for 2026 graduating batch across technical streams.',
        applyLink: 'https://tcs.com/careers'
      },
      {
        company: 'Amazon Web Services (AWS)',
        role: 'Cloud Support Associate',
        package: '14 LPA',
        eligibility: 'CGPA >= 7.5, Strong Networking & OS Skills',
        location: 'Gurugram / Remote',
        deadline: '2026-08-20',
        description: 'Work with cloud architecture, DevOps automation tools, and enterprise customers.',
        applyLink: 'https://amazon.jobs'
      }
    ]);

    // 7. Create Learning Resources
    await Resource.insertMany([
      {
        title: 'Top 50 Data Structures & Algorithms Questions for Campus Placements',
        type: 'PDF',
        url: 'https://example.com/resources/dsa-top50.pdf',
        description: 'Curated list of arrays, linked lists, trees, graphs, and dynamic programming questions.',
        uploadedBy: officer._id
      },
      {
        title: 'Complete System Design & Microservices Crash Course',
        type: 'Video',
        url: 'https://youtube.com/watch?v=demo-system-design',
        description: 'Video tutorial covering load balancers, caching, DB sharding, and message queues.',
        uploadedBy: officer._id
      },
      {
        title: 'Aptitude & Verbal Mastery Handbook',
        type: 'Article',
        url: 'https://example.com/resources/aptitude-handbook',
        description: 'Comprehensive shortcuts and formulas for quantitative aptitude and logical reasoning.',
        uploadedBy: officer._id
      }
    ]);

    // 8. Create Notifications
    await Notification.create({
      studentId: student1._id,
      message: 'New Placement Drive posted: Google India (22 LPA). Deadline: Aug 30, 2026.',
      isRead: false
    });

    await Notification.create({
      studentId: student2._id,
      message: 'Placement Officer Dr. Rajesh Sharma recommends adding at least 2 full-stack projects to your profile.',
      isRead: false
    });

    console.log('[Seed] Database populated successfully!');
    console.log(`-------------------------------------------------`);
    console.log(`DEMO LOGIN CREDENTIALS:`);
    console.log(`Admin:             admin@example.com   / password123`);
    console.log(`Placement Officer: officer@example.com / password123`);
    console.log(`Student (High):    student@example.com / password123`);
    console.log(`Student (Needs Imp): riya@example.com   / password123`);
    console.log(`-------------------------------------------------`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDB();
