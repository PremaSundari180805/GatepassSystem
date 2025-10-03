import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
          <div className="space-y-2 text-blue-200">
            <p className="text-lg">National Engineering College</p>
            <p>K.R Nagar, Kovilpatti - 628503</p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 mt-4">
              <span>Phone: 04632-222502</span>
              <span className="hidden md:inline text-blue-400">|</span>
              <span>Email: principal@nec.edu.in</span>
              <span className="hidden md:inline text-blue-400">|</span>
              <span>www.nec.edu.in</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-blue-700 text-blue-300">
            <p>&copy; 2025 National Engineering College. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;