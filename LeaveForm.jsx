import React, { useState } from 'react';
import api from '../utils/api';

const LeaveForm = ({ type, student, onBack }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fromDate, toDate, reason } = formData;

    // Basic validation
    if (!fromDate || !toDate || !reason || reason.length < 10) {
      alert('Please fill all fields. Reason must be at least 10 characters.');
      return;
    }
    if (new Date(toDate) <= new Date(fromDate)) {
      alert('To date must be after from date.');
      return;
    }

    try {
      const response = await api.post('/leaves/submit', {
        type,
        fromDate,
        toDate,
        reason
      });

      if (response.data.success) {
        alert('Leave request submitted successfully!');
        onBack();
      } else {
        alert('Failed to submit leave request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      alert('Failed to submit leave request. Please check your connection.');
    }
  };

  const title = type === 'ordinary' ? 'Ordinary Leave Application' : 'Emergency Leave Application';

  return (
    <section className="leave-form-section" style={{
      maxWidth: '700px',
      margin: '0 auto',
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#002366' }}>
        {title}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="fromDate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            From Date *
          </label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="toDate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            To Date *
          </label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="reason" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Reason *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            placeholder="Provide a detailed reason for your leave request..."
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Back to Leave Options
          </button>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#002366',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Submit Leave Request
          </button>
        </div>
      </form>
    </section>
  );
};

export default LeaveForm;
