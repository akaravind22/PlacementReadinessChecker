import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  FaChartPie, FaUser, FaCode, FaFolderOpen, FaCertificate, 
  FaBriefcase, FaQuestionCircle, FaBuilding, FaBook, 
  FaBell, FaUsers, FaPlusCircle, FaFileUpload, FaChartBar, FaShieldAlt, FaClipboardList
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(ThemeContext);

  if (!user) return null;

  const role = user.role;

  return (
    <div className="sidebar-container rounded-4 mb-4 mb-lg-0">
      <div className="text-uppercase text-muted fw-bold mb-3 px-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
        {role} Navigation
      </div>

      <nav className="nav nav-pills flex-column gap-1">
        {role === 'Student' && (
          <>
            <NavLink to="/student-dashboard" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaChartPie size={16} /> <span>{t('Dashboard')}</span>
            </NavLink>
            <NavLink to="/student/profile" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaUser size={16} /> <span>{t('My Profile')}</span>
            </NavLink>
            <NavLink to="/student/skills" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaCode size={16} /> <span>{t('Technical Skills')}</span>
            </NavLink>
            <NavLink to="/student/projects" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaFolderOpen size={16} /> <span>{t('Projects')}</span>
            </NavLink>
            <NavLink to="/student/certifications" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaCertificate size={16} /> <span>{t('Certifications')}</span>
            </NavLink>
            <NavLink to="/student/internships" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaBriefcase size={16} /> <span>{t('Internships')}</span>
            </NavLink>
            <NavLink to="/student/quizzes" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaQuestionCircle size={16} /> <span>{t('Practice Quizzes')}</span>
            </NavLink>
            <NavLink to="/student/drives" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaBuilding size={16} /> <span>{t('Placement Drives')}</span>
            </NavLink>
            <NavLink to="/student/report" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaClipboardList size={16} /> <span>{t('Placement Report')}</span>
            </NavLink>
            <NavLink to="/student/resources" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaBook size={16} /> <span>{t('Study Resources')}</span>
            </NavLink>
            <NavLink to="/student/notifications" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaBell size={16} /> <span>{t('Notifications')}</span>
            </NavLink>
          </>
        )}

        {role === 'Placement Officer' && (
          <>
            <NavLink to="/officer-dashboard" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaChartPie size={16} /> <span>{t('Officer Dashboard')}</span>
            </NavLink>
            <NavLink to="/officer/students" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaUsers size={16} /> <span>{t('Student Directory')}</span>
            </NavLink>
            <NavLink to="/officer/post-drive" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaPlusCircle size={16} /> <span>{t('Post Placement Drive')}</span>
            </NavLink>
            <NavLink to="/officer/upload-resource" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaFileUpload size={16} /> <span>{t('Upload Resource')}</span>
            </NavLink>
            <NavLink to="/officer/reports" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaChartBar size={16} /> <span>{t('Reports & Analytics')}</span>
            </NavLink>
          </>
        )}

        {role === 'Admin' && (
          <>
            <NavLink to="/admin-dashboard" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaShieldAlt size={16} /> <span>{t('Admin Dashboard')}</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaUsers size={16} /> <span>{t('Manage Users')}</span>
            </NavLink>
            <NavLink to="/admin/quizzes" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaQuestionCircle size={16} /> <span>{t('Manage Quizzes')}</span>
            </NavLink>
            <NavLink to="/admin/drives" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaBuilding size={16} /> <span>{t('Manage Drives')}</span>
            </NavLink>
            <NavLink to="/admin/resources" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaBook size={16} /> <span>{t('Manage Resources')}</span>
            </NavLink>
            <NavLink to="/admin/reports" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded-3 ${isActive ? 'bg-primary text-white fw-bold' : 'text-body'}`}>
              <FaChartBar size={16} /> <span>{t('System Reports')}</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
