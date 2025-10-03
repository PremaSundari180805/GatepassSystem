import React from 'react';
import clgProfile from '../assets/clg profile.jpg';

const AboutNEC = () => {
  return (
    <div id="about-nec" className="bg-white rounded-xl shadow-xl p-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About NEC</h2>
          <p className="text-gray-600 text-justify leading-relaxed text-lg">
            National Engineering College (NEC) is a premier institution established with the mission 
            to deliver high-quality technical education and produce industry-ready engineers. NEC is 
            an autonomous institution affiliated with Anna University, Chennai. We emphasize research, 
            innovation, and community engagement, maintaining strong industry partnerships to enhance 
            student learning and employability.
          </p>
        </div>
        <div className="relative">
          <img
            src={clgProfile}
            alt="College Building"
            className="rounded-lg shadow-lg w-full h-96 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutNEC;