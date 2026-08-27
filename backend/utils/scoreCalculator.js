const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Internship = require('../models/Internship');
const QuizResult = require('../models/QuizResult');
const Suggestion = require('../models/Suggestion');

const calculateReadinessScore = async (userId) => {
  try {
    const profile = await StudentProfile.findOne({ userId });
    const skills = await Skill.find({ studentId: userId });
    const projects = await Project.find({ studentId: userId });
    const certs = await Certification.find({ studentId: userId });
    const internships = await Internship.find({ studentId: userId });
    const quizResults = await QuizResult.find({ studentId: userId });

    // 1. CGPA (Max 20 pts)
    const cgpa = profile ? profile.cgpa : 0;
    const backlogs = profile ? profile.backlogs : 0;
    let cgpaScore = (Math.min(cgpa, 10) / 10) * 20;
    // Deduct penalty for backlogs
    cgpaScore = Math.max(0, cgpaScore - (backlogs * 2));

    // 2. Skills (Max 20 pts)
    let skillScore = 0;
    skills.forEach(s => {
      if (s.level === 'Expert') skillScore += 5;
      else if (s.level === 'Advanced') skillScore += 4;
      else if (s.level === 'Intermediate') skillScore += 3;
      else skillScore += 2;
    });
    skillScore = Math.min(20, skillScore);

    // 3. Projects (Max 20 pts)
    let projectScore = projects.length * 7;
    // Bonus for live & github links
    projects.forEach(p => {
      if (p.githubLink) projectScore += 1;
      if (p.liveLink) projectScore += 1;
    });
    projectScore = Math.min(20, projectScore);

    // 4. Certifications (Max 15 pts)
    const certScore = Math.min(15, certs.length * 5);

    // 5. Internships (Max 10 pts)
    const internshipScore = Math.min(10, internships.length * 5);

    // 6. Quiz (Max 15 pts)
    let quizAvgPercentage = 0;
    if (quizResults.length > 0) {
      const sum = quizResults.reduce((acc, q) => acc + q.score, 0);
      quizAvgPercentage = sum / quizResults.length;
    }
    const quizScore = Math.min(15, (quizAvgPercentage / 100) * 15);

    const totalScore = Math.round(cgpaScore + skillScore + projectScore + certScore + internshipScore + quizScore);
    const normalizedScore = Math.min(100, Math.max(0, totalScore));

    // Determine category
    let category = 'Needs Improvement';
    if (normalizedScore >= 85) category = 'Excellent';
    else if (normalizedScore >= 70) category = 'Good';
    else if (normalizedScore >= 50) category = 'Average';

    // Update profile
    if (profile) {
      profile.readinessScore = normalizedScore;
      await profile.save();
    }

    // Auto-generate Suggestions
    const suggestionsList = [];
    if (cgpa < 7.0) {
      suggestionsList.push({
        message: 'Improve CGPA above 7.5 and clear backlogs to meet core campus drive eligibility criteria.',
        priority: 'High'
      });
    }
    if (skills.length < 3) {
      suggestionsList.push({
        message: 'Add at least 3-5 technical skills (e.g. Java, React, SQL, Data Structures) to enhance profile strength.',
        priority: 'High'
      });
    }
    if (projects.length < 2) {
      suggestionsList.push({
        message: 'Build 2+ full-stack projects with live demo and GitHub source code links.',
        priority: 'High'
      });
    }
    if (certs.length < 1) {
      suggestionsList.push({
        message: 'Earn industry certifications (AWS, Meta, Oracle) to demonstrate verified knowledge.',
        priority: 'Medium'
      });
    }
    if (internships.length < 1) {
      suggestionsList.push({
        message: 'Participate in internships or industrial projects for practical domain experience.',
        priority: 'Medium'
      });
    }
    if (quizAvgPercentage < 60) {
      suggestionsList.push({
        message: 'Complete technical and aptitude quizzes regularly to improve accuracy & test speed.',
        priority: 'High'
      });
    }
    if (suggestionsList.length === 0) {
      suggestionsList.push({
        message: 'Great job! Your profile looks competitive for campus placement drives. Keep practicing mock interviews.',
        priority: 'Low'
      });
    }

    // Refresh Suggestions in DB
    await Suggestion.deleteMany({ studentId: userId });
    for (const sug of suggestionsList) {
      await Suggestion.create({
        studentId: userId,
        message: sug.message,
        priority: sug.priority
      });
    }

    return {
      totalScore: normalizedScore,
      category,
      breakdown: {
        cgpaScore: Math.round(cgpaScore),
        skillScore: Math.round(skillScore),
        projectScore: Math.round(projectScore),
        certScore: Math.round(certScore),
        internshipScore: Math.round(internshipScore),
        quizScore: Math.round(quizScore)
      },
      suggestions: suggestionsList
    };
  } catch (error) {
    console.error('Error calculating readiness score:', error);
    return { totalScore: 0, category: 'Needs Improvement', breakdown: {}, suggestions: [] };
  }
};

module.exports = { calculateReadinessScore };
