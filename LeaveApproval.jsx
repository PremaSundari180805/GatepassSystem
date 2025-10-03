import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const LeaveApproval = ({ role }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      const response = await api.get('/leaves/my-pending');
      if (response.data.success) {
        setLeaves(response.data.leaves);
        // Debug output
        console.log('Fetched leaves for approval:', response.data.leaves);
      } else {
        console.warn('API did not return success:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      setError('Failed to fetch pending leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (leaveId, approved, comment = '') => {
    try {
      const response = await api.put(`/leaves/${leaveId}/approve`, {
        approved,
        comment
      });

      if (response.data.success) {
        alert(approved ? 'Leave approved successfully!' : 'Leave rejected successfully!');
        fetchPendingLeaves(); // Refresh the list
      } else {
        alert('Failed to process approval. Please try again.');
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Failed to process approval. Please check your connection.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_parent':
      case 'pending_tutor':
      case 'pending_hod':
      case 'pending_warden':
        return '#f59e0b'; // yellow
      default:
        return '#6b7280'; // gray
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <p>Loading pending leaves...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!leaves || leaves.length === 0) return <p>No pending leave requests.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Pending Leave Approvals</h3>
      {leaves.map((leave) => (
        <div
          key={leave._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, color: '#002366' }}>
              {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
            </h4>
            <span
              style={{
                backgroundColor: getStatusColor(leave.status),
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {formatStatus(leave.status)}
            </span>
          </div>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Student:</strong> {leave.studentId?.name} ({leave.studentId?.registrationNumber})
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Reason:</strong> {leave.reason}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()} <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => {
                const comment = prompt('Enter approval comment (optional):');
                handleApproval(leave._id, true, comment || '');
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Approve
            </button>
            <button
              onClick={() => {
                const comment = prompt('Enter rejection reason:');
                if (comment) handleApproval(leave._id, false, comment);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveApproval;
