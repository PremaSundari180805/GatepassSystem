import React from 'react';
import Header from './Header.jsx';
// Removed Navigation import as per user request
import AboutNEC from './AboutNEC.jsx';
import AboutGatepass from './AboutGatepass.jsx';
import CallToAction from './CallToAction.jsx';
import Footer from './Footer.jsx';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative min-h-screen">
        <Header />
        {/* Navigation component removed as per user request */}

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-12">
            <AboutNEC />
            <AboutGatepass />
            <CallToAction />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
