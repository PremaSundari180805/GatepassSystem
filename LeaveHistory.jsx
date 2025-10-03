import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const LeaveHistory = ({ role }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApprovedLeaves();
  }, []);

  const fetchApprovedLeaves = async () => {
    try {
      const response = await api.get('/leaves/my-approved');
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      console.error('Error fetching approved leaves:', error);
      setError('Failed to fetch approved leaves');
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderApproverResponses = (responses) => {
    if (!responses || responses.length === 0) return null;

    return (
      <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#e8f4fd', borderRadius: '4px' }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: '#002366' }}>Approver Responses:</h5>
        {responses.map((response, index) => (
          <div key={index} style={{ marginBottom: '0.5rem', padding: '0.25rem', borderLeft: `3px solid ${response.approved ? '#10b981' : '#ef4444'}`, paddingLeft: '0.5rem' }}>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>
              {response.role.charAt(0).toUpperCase() + response.role.slice(1)}: {response.approved ? 'Approved' : 'Rejected'}
            </p>
            {response.comment && (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#555' }}>
                Comment: {response.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading approved leaves...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!leaves || leaves.length === 0) return <p>No approved leave requests.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Approved Leave Requests</h3>
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
                backgroundColor: '#10b981',
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
          {renderApproverResponses(leave.approverResponses)}
        </div>
      ))}
    </div>
  );
};

export default LeaveHistory;
