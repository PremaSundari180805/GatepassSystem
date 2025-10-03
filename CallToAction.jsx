import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl shadow-xl p-8 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-xl mb-6 text-teal-100">
        Access the Student Gatepass & Leave Management System
      </p>
      <button
        onClick={handleLoginClick}
        className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
      >
        Go to Login
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );
};

export default CallToAction;
