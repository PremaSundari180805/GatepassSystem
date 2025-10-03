import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const TutorLeaveNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/leaves/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!notifications || notifications.length === 0) return <p>No notifications found.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Notifications</h3>
      {notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((notification, index) => (
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
            {notification.response.role === 'hod' && notification.response.approved ? (
              <span
                style={{
                  backgroundColor: '#2563eb', // blue
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                HOD Approved
              </span>
            ) : notification.response.role === 'tutor' && notification.response.approved ? (
              <span
                style={{
                  backgroundColor: '#10b981', // green
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Approved
              </span>
            ) : notification.response.role === 'system' && notification.response.approved ? (
              <span
                style={{
                  backgroundColor: '#14b8a6', // teal
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Confirmed
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: '#ef4444', // red
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                Rejected
              </span>
            )}
          </div>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Student:</strong> {notification.studentName} ({notification.registrationNumber})
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Status:</strong> {formatStatus(notification.status)}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Response:</strong> {notification.response.role.charAt(0).toUpperCase() + notification.response.role.slice(1)} - {notification.response.approved ? 'Approved' : 'Rejected'} - {notification.response.comment ? notification.response.comment : 'ok'}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555', fontSize: '0.875rem' }}>
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TutorLeaveNotifications;
