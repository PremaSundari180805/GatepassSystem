import React from 'react';
import { Bell, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Left side - Login button */}
          <div>
            <button
              onClick={handleLoginClick}
              className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors duration-200 shadow-md"
            >
              Login
            </button>
          </div>

          {/* Center - Navigation buttons */}
          <div className="flex space-x-4">
            <button className="flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-md border border-gray-300">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Notifications
            </button>

            <button className="flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-md border border-gray-300">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Attendance Marker
            </button>
          </div>

          {/* Right side - Profile button */}
          <div>
            <button className="flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-md border border-gray-300">
              <User className="h-5 w-5 mr-2 text-purple-500" />
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
