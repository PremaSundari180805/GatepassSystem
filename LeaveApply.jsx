import React from "react";
import "./StudentDashboard.css";

const LeaveApply = ({ onApplyOrdinary, onApplyEmergency }) => {
  return (
    <div className="leave-apply-container">
      <div className="leave-box ordinary-leave">
        <div className="leave-icon">📅</div>
        <h2>Ordinary Leave</h2>
        <p className="leave-description">Request regular leave for planned absences</p>
        <ul className="leave-details">
          <li>Advance notice required (minimum 7 days)</li>
          <li>Subject to approval by department head</li>
          <li>Maximum 30 days per academic year</li>
        </ul>
        <button
          className="btn btn-ordinary"
          onClick={onApplyOrdinary}
          aria-label="Apply for Ordinary Leave"
        >
          📄 Apply for Ordinary Leave
        </button>
      </div>

      <div className="leave-box emergency-leave">
        <div className="leave-icon">🚨</div>
        <h2>Emergency Leave</h2>
        <p className="leave-description">Request immediate leave for urgent situations</p>
        <ul className="leave-details">
          <li>Immediate approval for urgent cases</li>
          <li>Documentation required within 48 hours</li>
          <li>Medical/family emergency situations</li>
        </ul>
        <button
          className="btn btn-emergency"
          onClick={onApplyEmergency}
          aria-label="Apply for Emergency Leave"
        >
          🚨 Apply for Emergency Leave
        </button>
      </div>
    </div>
  );
};

export default LeaveApply;
