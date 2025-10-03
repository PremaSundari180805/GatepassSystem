import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage.jsx';
import LoginPage from './components/LoginPage.jsx';
import CollegeAdminPage from './components/CollegeAdminPage.jsx';
import ParentDashboard from './parent/ParentDashboard.jsx';
import StudentDashboard from './student/StudentDashboard.jsx';
import HODDashboard from './tutor/HODDashboard.jsx';
import TutorDashboard from './tutor/TutorDashboard.jsx';
import WardenDashboard from './warden/WardenDashboard.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  console.log('Rendering App, currentPage:', currentPage);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<CollegeAdminPage />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/hod-dashboard" element={<HODDashboard />} />
          <Route path="/warden-dashboard" element={<WardenDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
