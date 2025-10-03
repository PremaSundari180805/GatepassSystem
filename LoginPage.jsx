import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setUserRole } from '../utils/auth';
import hosImage from '../assets/hos.jpg';
import nec1Image from '../assets/nec1.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      role: selectedRole,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ " + data.message);
        console.log("User details:", data.user);

        // Store token and role
        setAuthToken(data.token);
        setUserRole(data.user.role);

        // Navigate based on role
        const roleRoutes = {
          admin: '/admin',
          hod: '/hod-dashboard',
          staff: '/tutor-dashboard',
          student: '/student-dashboard',
          parent: '/parent-dashboard',
          warden: '/warden-dashboard'
        };

        const redirectPath = roleRoutes[data.user.role];
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          alert("❌ Unknown role. Please contact administrator.");
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error. Try again later.");
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{backgroundImage: `url(${hosImage})`}}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-28 h-28 rounded-md flex items-center justify-center overflow-hidden">
              <img src={nec1Image} alt="NEC Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            National Engineering College
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Gatepass System Login
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User Role
          </label>
          <select
            name="role"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setFormData({ email: '', password: '' });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
          >
            <option value="admin">Admin</option>
            <option value="hod">HOD</option>
            <option value="staff">Tutor</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="warden">Warden</option>
          </select>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center space-y-3">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </button>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Phone: 04632-222502, 230227 | Email: principal@nec.edu.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
