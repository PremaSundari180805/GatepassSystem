import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './ParentDashboard.css'; // Commented out to avoid import issues
import KRImage from '../assets/KR IMAGE.jpg';
import NecImage from '../assets/nec1.jpg';
import LeaveApproval from '../components/LeaveApproval';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Leave Approvals');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    month: '',
    year: '',
    status: '',
  });
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    if (activeTab === 'Leave Search') {
      const params = new URLSearchParams();
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
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      api.get('/auth/profile')
        .then(response => {
          console.log('Profile data received:', response.data);
          if (response.data.success) {
            console.log('User data:', response.data.user);
            setProfileData(response.data.user);
            setLoading(false);
          } else {
            console.error('API error:', response.data.message);
            setError('Failed to fetch profile data: ' + response.data.message);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setError('Failed to fetch profile data: ' + err.message);
          setLoading(false);
        });
    } else {
      console.error('No token found');
      setError('No authentication token found');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profileData) {
      api.get('/leaves/notifications')
        .then(response => {
          if (response.data.success) {
            setNotifications(response.data.notifications);
          }
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }
  }, [profileData]);

  const renderProfile = () => {
    console.log('Rendering profile with data:', profileData);

    return (
      <section
        className="profile-section"
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h3
          style={{
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '700px',
            marginLeft: '0',
            marginRight: 'auto',
          }}
        >
          Profile Information
          <span
            style={{
              fontWeight: 'normal',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Personal information and contact details
          </span>
        </h3>

        <div
          style={{
            display: 'flex',
            gap: '3rem',
            borderLeft: '1px solid #ddd',
            borderRight: '1px solid #ddd',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          {/* Left side: Name, Initials, Designation, Status */}
          <div
            style={{
              flex: '1 1 40%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRight: '1px solid #ddd',
              paddingRight: '1rem',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {profileData?.profile?.name || profileData?.username || 'No name available'}
            </div>
            <div
              style={{ fontSize: '1rem', color: '#555', marginBottom: '1.5rem' }}
            >
              Role: {profileData?.role || 'Parent'}
            </div>
            <div
              style={{
                backgroundColor: profileData?.isActive ? '#22c55e' : '#ef4444',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}
            >
              {profileData?.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          {/* Right side: Contact Information */}
          <div
            style={{
              flex: '1 1 60%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            <div>
              <strong>Contact Information</strong>
              <div
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span role="img" aria-label="email">
                    📧
                  </span>{' '}
                  {profileData?.email || 'No email available'}
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span role="img" aria-label="phone">
                    📞
                  </span>{' '}
                  {profileData?.profile?.phone || 'No phone available'}
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span role="img" aria-label="address">
                    📍
                  </span>{' '}
                  {profileData?.profile?.address || 'No address available'}
                </div>
                {/* Additional parent-specific fields */}
                {profileData?.profile?.studentName && (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span role="img" aria-label="student">
                      👨‍🎓
                    </span>{' '}
                    Student: {profileData.profile.studentName}
                  </div>
                )}
                {profileData?.profile?.relationship && (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span role="img" aria-label="relationship">
                      👨‍👩‍👧‍👦
                    </span>{' '}
                    Relationship: {profileData.profile.relationship}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderLeaveSearch = () => {
    const filteredData = leaveData.filter(item => {
      const leaveDate = new Date(item.leaveDate);
      const leaveMonth = (leaveDate.getMonth() + 1).toString().padStart(2, '0');
      const leaveYear = leaveDate.getFullYear().toString();
      const leaveDay = leaveDate.getDate().toString().padStart(2, '0');

      return (
        (!filters.date || leaveDay === filters.date) &&
        (!filters.month || leaveMonth === filters.month) &&
        (!filters.year || leaveYear === filters.year) &&
        (!filters.status || item.status === filters.status)
      );
    });

    return (
      <section className="leave-search-section" style={{ padding: '1rem' }}>
        <h3>Leave Search</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Student Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Passed Out Year</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Leave Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.studentName}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.department}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.passedOutYear}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.leaveDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  const renderNotifications = () => (
    <section className="notifications-section" style={{
      maxWidth: '700px',
      margin: '0 auto',
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: '#002366' }}>
        Notifications
      </h3>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notification, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#002366' }}>
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} Leave
                </h4>
                <span
                  style={{
                    backgroundColor: notification.response.approved ? '#10b981' : '#ef4444',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {notification.response.role === 'system' ? 'Confirmed' : (notification.response.approved ? 'Approved' : 'Rejected')}
                </span>
              </div>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                <strong>Student:</strong> {notification.studentName} ({notification.registrationNumber})
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                <strong>Status:</strong> {notification.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                <strong>Response:</strong> {notification.response.role && notification.response.role !== 'system' ? notification.response.role.charAt(0).toUpperCase() + notification.response.role.slice(1) : 'System'} - {notification.response.approved ? 'Approved' : 'Rejected'}
                {notification.response.comment && ` - ${notification.response.comment}`}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555', fontSize: '0.875rem' }}>
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderHistory = () => (
    <section className="history-section" style={{
      maxWidth: '700px',
      margin: '0 auto',
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: '#002366' }}>
        Leave History
      </h3>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#002366' }}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Leave
                </h4>
                <span
                  style={{
                    backgroundColor: item.status === 'approved' ? '#10b981' : item.status === 'rejected' ? '#ef4444' : '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                <strong>Student:</strong> {item.studentName} ({item.registrationNumber})
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                <strong>From:</strong> {new Date(item.fromDate).toLocaleDateString()} <strong>To:</strong> {new Date(item.toDate).toLocaleDateString()}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555' }}>
                <strong>Reason:</strong> {item.reason}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#555', fontSize: '0.875rem' }}>
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="dashboard-container">
      <header
        className="college-header"
        style={{
          backgroundColor: '#002366',
          color: 'white',
          padding: '0',
          width: '100%',
          height: '160px',
          textAlign: 'center',
          fontFamily: '"Times New Roman", serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={KRImage}
          alt="KR Logo"
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '100px',
          }}
        />
        <img
          src={NecImage}
          alt="NEC Logo"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '100px',
          }}
        />
        <h1
          style={{
            fontWeight: 900,
            fontSize: '1.75rem',
            marginBottom: '0.25rem',
          }}
        >
          National Engineering College
        </h1>
        <p
          className="subheading"
          style={{
            fontWeight: 500,
            fontSize: '0.875rem',
            margin: '0.1rem 0',
            color: 'white',
          }}
        >
          (An Autonomous Institution - Affiliated to Anna University Chennai)
        </p>
        <p
          className="address"
          style={{
            fontWeight: 300,
            fontSize: '0.9rem',
            margin: '0.1rem 0',
            color: 'white',
            fontFamily: '"Times New Roman", serif',
          }}
        >
          K.R.Nagar, Kovilpatti-628503
        </p>
        <p
          className="contact-info"
          style={{ fontSize: '0.8rem', color: 'white', margin: '0.1rem 0' }}
        >
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
          className={`nav-item${activeTab === 'Notifications' ? ' active' : ''}`}
          onClick={() => setActiveTab('Notifications')}
        >
          <span className="icon" aria-hidden="true">
            🔔
          </span>{' '}
          Notifications
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
          className="nav-item btn-emergency"
          onClick={() => navigate('/login')}
        >
          <span className="icon" aria-hidden="true">
            🚪
          </span>{' '}
          Logout
        </button>
      </nav>

      {activeTab === 'Leave Approvals' && (
        <section className="leave-approvals-section" style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <LeaveApproval role="parent" />
        </section>
      )}
      {activeTab === 'Notifications' && renderNotifications()}
      {activeTab === 'History' && renderHistory()}
      {activeTab === 'Leave Search' && renderLeaveSearch()}
      {activeTab === 'Profile' && renderProfile()}
    </div>
  );
};

export default ParentDashboard;
