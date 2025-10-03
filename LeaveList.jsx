import React from 'react';

const LeaveList = ({ leaves }) => {
  if (!leaves || leaves.length === 0) {
    return <p>No leave requests found.</p>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_parent':
      case 'pending_tutor':
      case 'pending_hod':
      case 'pending_warden':
        return '#f59e0b'; // yellow
      case 'approved_parent':
      case 'approved_tutor':
      case 'approved_hod':
      case 'approved_warden':
        return '#10b981'; // green
      case 'final_approved':
        return '#059669'; // dark green
      case 'rejected':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <strong>Reason:</strong> {leave.reason}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()} <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Student:</strong> {leave.studentId?.name} ({leave.studentId?.registrationNumber})
          </p>
          {leave.approverResponses && leave.approverResponses.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Approver Responses:</strong>
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1rem' }}>
                {leave.approverResponses.map((response, index) => (
                  <li key={index} style={{ color: response.approved ? '#10b981' : '#ef4444' }}>
                    {response.role.charAt(0).toUpperCase() + response.role.slice(1)}: {response.approved ? 'Approved' : 'Rejected'}
                    {response.comment && ` - ${response.comment}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveList;
