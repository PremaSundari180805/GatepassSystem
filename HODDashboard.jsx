import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './HODDashboard.css'; // Commented out to avoid import issues
import KRImage from '../assets/KR IMAGE.jpg';
import NecImage from '../assets/nec1.jpg';
import LeaveApproval from '../components/LeaveApproval';

const HODDashboard = () => {
  const [activeTab, setActiveTab] = useState('Leave Approvals');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    passedOutYear: '',
    date: '',
    month: '',
    year: '',
    status: '',
  });
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    if (activeTab === 'Leave Search') {
      const params = new URLSearchParams();
      if (filters.passedOutYear) params.append('passedOutYear', filters.passedOutYear);
      if (filters.date) params.append('date', filters.date);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.status) params.append('status', filters.status);

      api.get('/leaves/search?' + params.toString())
        .then(response => {
          if (response.data.success) {
            setLeaveData(response.data.leaves);
          } else {
            setLeaveData([]);
          }
        })
        .catch(error => {
          console.error('Error fetching leave search data:', error);
          setLeaveData([]);
        });
    }
  }, [activeTab, filters]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then(response => {
          if (response.data.success) {
            setProfileData(response.data.user);
            setLoading(false);
          } else {
            setError('Failed to fetch profile data');
            setLoading(false);
          }
        })
        .catch(err => {
          setError('Failed to fetch profile data');
          setLoading(false);
        });
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, []);


  const renderProfile = () => (
    <section className="profile-section">
      <h3 className="profile-header">
        Profile Information
        <span>Personal information and contact details</span>
      </h3>
      <div className="profile-main">
        <div className="profile-left">
          <div className="profile-name">{profileData?.name || profileData?.username || ''}</div>
          <div className="profile-id">{profileData?.username || ''}</div>
          <div className="profile-designation">{profileData?.role || 'HOD'}</div>
          <div className="profile-status">{profileData?.isActive ? 'Active' : 'Inactive'}</div>
        </div>
        <div className="profile-right">
          <div>
            <strong>Contact Information</strong>
            <div className="contact-info-section">
              <div className="contact-item">
                <span role="img" aria-label="email">📧</span> {profileData?.email || ''}
              </div>
              <div className="contact-item">
                <span role="img" aria-label="phone">📞</span> {profileData?.phone || ''}
              </div>
              <div className="contact-item">
                <span role="img" aria-label="address">📍</span> {profileData?.address || ''}
              </div>
              <div className="contact-item">
                <span role="img" aria-label="department">🏢</span> {profileData?.department || ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderLeaveSearch = () => {
    const filteredData = leaveData.filter(item => {
      const leaveDate = new Date(item.leaveDate);
      const leaveMonth = (leaveDate.getMonth() + 1).toString().padStart(2, '0');
      const leaveYear = leaveDate.getFullYear().toString();
      const leaveDay = leaveDate.getDate().toString().padStart(2, '0');

      return (
        (!filters.passedOutYear || item.passedOutYear === filters.passedOutYear) &&
        (!filters.date || leaveDay === filters.date) &&
        (!filters.month || leaveMonth === filters.month) &&
        (!filters.year || leaveYear === filters.year) &&
        (!filters.status || item.status === filters.status)
      );
    });

    return (
      <section className="leave-search-section">
        <h3>Leave Search</h3>
        <div className="filters-container">
          <div>
            <label>Passed Out Year:</label>
            <select value={filters.passedOutYear} onChange={(e) => setFilters({ ...filters, passedOutYear: e.target.value })}>
              <option value="">All</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label>Day:</label>
            <select value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })}>
              <option value="">All</option>
              {[...Array(31)].map((_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                return (
                  <option key={day} value={day}>
                    {day}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Month:</label>
            <select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
              <option value="">All</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div>
            <label>Year:</label>
            <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
              <option value="">All</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <table className="leave-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Department</th>
              <th>Passed Out Year</th>
              <th>Leave Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>{item.studentName}</td>
                <td>{item.department}</td>
                <td>{item.passedOutYear}</td>
                <td>{item.leaveDate}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="college-header">
        <img
          src={KRImage}
          alt="KR Logo"
        />
        <img
          src={NecImage}
          alt="NEC Logo"
        />
        <h1>
          National Engineering College
        </h1>
        <p className="subheading">
          (An Autonomous Institution - Affiliated to Anna University Chennai)
        </p>
        <p className="address">
          K.R.Nagar, Kovilpatti-628503
        </p>
        <p className="contact-info">
          Phone: 04632-222502, 230227; Email: principal@nec.edu.in; web:
          www.nec.edu.in
        </p>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-item${activeTab === 'Leave Approvals' ? ' active' : ''}`}
          onClick={() => setActiveTab('Leave Approvals')}
        >
          <span className="icon" aria-hidden="true">
            ✅
          </span>{' '}
          Leave Approvals
        </button>
        <button
          className={`nav-item${activeTab === 'Leave Search' ? ' active' : ''}`}
          onClick={() => setActiveTab('Leave Search')}
        >
          <span className="icon" aria-hidden="true">
            🔍
          </span>{' '}
          Leave Search
        </button>
        <button
          className={`nav-item${activeTab === 'Profile' ? ' active' : ''}`}
          onClick={() => setActiveTab('Profile')}
        >
          <span className="icon" aria-hidden="true">
            👤
          </span>{' '}
          Profile
        </button>
        <button
          className="nav-item logout-btn"
          onClick={() => navigate('/login')}
        >
          <span className="icon" aria-hidden="true">
            🚪
          </span>{' '}
          Logout
        </button>
      </nav>

      {activeTab === 'Leave Approvals' && (
        <section className="leave-approvals-section">
          <LeaveApproval role="hod" />
        </section>
      )}
      {activeTab === 'Leave Search' && renderLeaveSearch()}
      {activeTab === 'Profile' && renderProfile()}
    </div>
  );
};

export default HODDashboard;
