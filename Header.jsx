import React from 'react';
import nec1 from '../assets/nec1.jpg';
import krImage from '../assets/KR IMAGE.jpg';

const Header = () => {
  return (
    <header className="bg-blue-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: NEC Image */}
          <div className="flex items-center w-28 h-28 overflow-hidden">
            <img
              src={nec1}
              alt="NEC Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Center: College Name and Details */}
          <div className="text-center flex-1 mx-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              National Engineering College
            </h1>
            <p className="text-lg md:text-xl text-blue-200 mb-2">
              (An Autonomous Institution - Affiliated to Anna University, Chennai)
            </p>
            <div className="text-sm md:text-base text-blue-100 space-y-1">
              <p>K.R.Nagar, Kovilpatti - 628503</p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-4">
                <span>Phone: 04632-222502, 230227</span>
                <span className="hidden md:inline">|</span>
                <span>Email: principal@nec.edu.in</span>
                <span className="hidden md:inline">|</span>
                <span>web: www.nec.edu.in</span>
              </div>
            </div>
          </div>

          {/* Right: KR Image */}
          <div className="flex items-center w-28 h-28 overflow-hidden">
            <img
              src={krImage}
              alt="KR Emblem"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
