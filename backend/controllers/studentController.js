const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Internship = require('../models/Internship');
const QuizResult = require('../models/QuizResult');
const Suggestion = require('../models/Suggestion');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { calculateReadinessScore } = require('../utils/scoreCalculator');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user.id }).populate('userId', 'name email phone role');
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user.id });
      profile = await StudentProfile.findById(profile._id).populate('userId', 'name email phone role');
    }
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { college, department, year, cgpa, backlogs, github, linkedin, name, phone } = req.body;
    
    // Update User Name & Phone if passed
    if (name || phone) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(name && { name }),
        ...(phone && { phone })
      });
    }

    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id });
    }

    if (college !== undefined) profile.college = college;
    if (department !== undefined) profile.department = department;
    if (year !== undefined) profile.year = year;
    if (cgpa !== undefined) profile.cgpa = parseFloat(cgpa);
    if (backlogs !== undefined) profile.backlogs = parseInt(backlogs, 10);
    if (github !== undefined) profile.github = github;
    if (linkedin !== undefined) profile.linkedin = linkedin;

    await profile.save();

    // Recalculate score
    await calculateReadinessScore(req.user.id);

    const updatedProfile = await StudentProfile.findOne({ userId: req.user.id }).populate('userId', 'name email phone role');
    res.json({ success: true, message: 'Profile updated successfully.', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const resumePath = `/uploads/${req.file.filename}`;
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id });
    }
    profile.resume = resumePath;
    await profile.save();

    await calculateReadinessScore(req.user.id);

    res.json({ success: true, message: 'Resume uploaded successfully.', resumeUrl: resumePath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Skills CRUD
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ studentId: req.user.id });
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { skillName, level } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }
    const newSkill = await Skill.create({
      studentId: req.user.id,
      skillName,
      level: level || 'Intermediate'
    });
    await calculateReadinessScore(req.user.id);
    res.status(201).json({ success: true, message: 'Skill added.', skill: newSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { skillName, level } = req.body;
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.id },
      { skillName, level },
      { new: true }
    );
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    await calculateReadinessScore(req.user.id);
    res.json({ success: true, message: 'Skill updated.', skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    await calculateReadinessScore(req.user.id);
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Projects CRUD
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ studentId: req.user.id });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addProject = async (req, res) => {
  try {
    const { title, description, technology, githubLink, liveLink } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Project title is required.' });

    const newProject = await Project.create({
      studentId: req.user.id,
      title,
      description: description || '',
      technology: technology || '',
      githubLink: githubLink || '',
      liveLink: liveLink || ''
    });
    await calculateReadinessScore(req.user.id);
    res.status(201).json({ success: true, message: 'Project added.', project: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    await calculateReadinessScore(req.user.id);
    res.json({ success: true, message: 'Project updated.', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    await calculateReadinessScore(req.user.id);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Certifications CRUD
exports.getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find({ studentId: req.user.id });
    res.json({ success: true, certifications: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addCertification = async (req, res) => {
  try {
    const { courseName, provider, completionDate, certificateURL } = req.body;
    if (!courseName || !provider) {
      return res.status(400).json({ success: false, message: 'Course name and provider are required.' });
    }
    const cert = await Certification.create({
      studentId: req.user.id,
      courseName,
      provider,
      completionDate: completionDate || '',
      certificateURL: certificateURL || ''
    });
    await calculateReadinessScore(req.user.id);
    res.status(201).json({ success: true, message: 'Certification added.', certification: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found.' });
    await calculateReadinessScore(req.user.id);
    res.json({ success: true, message: 'Certification deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Internships CRUD
exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ studentId: req.user.id });
    res.json({ success: true, internships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addInternship = async (req, res) => {
  try {
    const { company, role, duration, description } = req.body;
    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required.' });
    }
    const internship = await Internship.create({
      studentId: req.user.id,
      company,
      role,
      duration: duration || '',
      description: description || ''
    });
    await calculateReadinessScore(req.user.id);
    res.status(201).json({ success: true, message: 'Internship added.', internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found.' });
    await calculateReadinessScore(req.user.id);
    res.json({ success: true, message: 'Internship deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student Placement Report
exports.getStudentReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const profile = await StudentProfile.findOne({ userId });
    const skills = await Skill.find({ studentId: userId }).sort({ level: -1, skillName: 1 });
    const projects = await Project.find({ studentId: userId });
    const certifications = await Certification.find({ studentId: userId });
    const internships = await Internship.find({ studentId: userId });
    const quizResults = await QuizResult.find({ studentId: userId }).sort({ createdAt: -1 });
    const scoreData = await calculateReadinessScore(userId);

    const totalSkills = skills.length;
    const averageQuizScore = quizResults.length > 0
      ? Math.round(quizResults.reduce((acc, quiz) => acc + quiz.score, 0) / quizResults.length)
      : 0;

    const eligibleForCampusDrives = (profile?.cgpa || 0) >= 7.0 && (profile?.backlogs || 0) === 0;
    const eligibilityStatus = eligibleForCampusDrives
      ? 'Eligible for most campus placement drives'
      : 'Needs improvement to meet standard campus drive eligibility';

    const report = {
      user: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
      },
      profile,
      skills,
      projects,
      certifications,
      internships,
      quizResults,
      scoreData,
      metrics: {
        totalSkills,
        totalProjects: projects.length,
        totalCertifications: certifications.length,
        totalInternships: internships.length,
        averageQuizScore,
        topSkills: skills.slice(0, 5).map((skill) => skill.skillName),
        resumeUploaded: Boolean(profile?.resume),
        eligibilityStatus,
        reportDate: new Date()
      }
    };

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Readiness Score & Breakdown
exports.getReadinessScore = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ studentId: req.user.id });
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Suggestions Only
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark Notification as Read
exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.id },
      { isRead: true }
    );
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
