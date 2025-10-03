import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './StudentDashboard.css';
import KRImage from '../assets/KR IMAGE.jpg';
import NecImage from '../assets/nec1.jpg';
import LeaveApply from "./LeaveApply";
import LeaveForm from "./LeaveForm";
import LeaveList from "../components/LeaveList";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Leave Apply');
  const [leaveType, setLeaveType] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      api.get('/auth/profile')
        .then(response => {
          if (response.data.success) {
            setStudent(response.data.user);
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

  const [leaves, setLeaves] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (student) {
      api.get('/leaves/my-pending')
        .then(response => {
          if (response.data.success) {
            setLeaves(response.data.leaves);
          }
        })
        .catch(error => console.error('Error fetching leaves:', error));

      api.get('/leaves/notifications')
        .then(response => {
          if (response.data.success) {
            setNotifications(response.data.notifications);
          }
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }
  }, [student]);

  const renderLeaveApply = () => {
    if (leaveType === null) {
      return (
        <section className="leave-apply-section">
          <LeaveApply 
            onApplyOrdinary={() => setLeaveType('ordinary')} 
            onApplyEmergency={() => setLeaveType('emergency')} 
          />
        </section>
      );
    } else {
      return (
        <section className="leave-apply-section">
          <LeaveForm 
            type={leaveType} 
            student={student} 
            onBack={() => setLeaveType(null)} 
          />
        </section>
      );
    }
  };

  const renderMyLeaves = () => (
    <section className="my-leaves-section" style={{
      maxWidth: '700px',
      margin: '0 auto',
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: '#002366' }}>
        My Leave Requests
      </h3>
      <LeaveList leaves={leaves} />
    </section>
  );

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
                <strong>Response:</strong> {notification.response.role.charAt(0).toUpperCase() + notification.response.role.slice(1)} - {notification.response.approved ? 'Approved' : 'Rejected'}
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

  const renderProfile = () => (
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
            {student?.name || ''}
          </div>
          <div
            style={{ fontSize: '1rem', color: '#555', marginBottom: '1.5rem' }}
          >
            Registration Number: {student?.registrationNumber || ''}
          </div>
          <div
            style={{ fontSize: '1rem', color: '#555', marginBottom: '1.5rem' }}
          >
            {student?.role || 'Student'}
          </div>
          <div
            style={{
              backgroundColor: student?.isActive ? '#22c55e' : '#ef4444',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
            }}
          >
            {student?.isActive ? 'Active' : 'Inactive'}
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
                {student?.email || ''}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span role="img" aria-label="phone">
                  📞
                </span>{' '}
                {student?.phone || ''}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span role="img" aria-label="address">
                  📍
                </span>{' '}
                {student?.address || ''}
              </div>
            </div>
          </div>
          <div>
            <strong>Hostel Information</strong>
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
                <span role="img" aria-label="warden">
                  👨‍💼
                </span>{' '}
                Warden: {student?.wardenId?.name || 'Not Assigned'}
              </div>
            </div>
          </div>
        </div>
      </div>
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
          className={`nav-item${activeTab === 'Leave Apply' ? ' active' : ''}`}
          onClick={() => setActiveTab('Leave Apply')}
        >
          <span className="icon" aria-hidden="true">
            📝
          </span>{' '}
          Leave Apply
        </button>
        <button
          className={`nav-item${activeTab === 'My Leaves' ? ' active' : ''}`}
          onClick={() => setActiveTab('My Leaves')}
        >
          <span className="icon" aria-hidden="true">
            📋
          </span>{' '}
          My Leaves
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

      {activeTab === 'Leave Apply' && renderLeaveApply()}
      {activeTab === 'My Leaves' && renderMyLeaves()}
      {activeTab === 'Notifications' && renderNotifications()}
      {activeTab === 'Profile' && renderProfile()}
    </div>
  );
}
