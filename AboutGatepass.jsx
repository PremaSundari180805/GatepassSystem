import React from 'react';
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

const AboutGatepass = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        About the Gatepass System
      </h2>
      
      <div className="space-y-8">
        {/* Overview */}
        <div>
          <h3 className="text-xl font-semibold text-teal-700 mb-4 flex items-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Overview
          </h3>
          <p className="text-gray-600 text-justify leading-relaxed">
           The NEC Gatepass & Leave Management System is a secure, web-based application designed to simplify and digitize the process of student leave approvals. Built with OTP-verified authentication, the system ensures that only authorized parents can request leaves on behalf of their children.

Once a request is submitted, the system intelligently routes it to the appropriate authority—Tutor, Warden, or HOD—based on the type of leave. Each stage of the process is tracked, maintaining a complete audit trail of approvals, rejections, and notifications.
          </p>
        </div>

        {/* Ordinary Leave Flow */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
            <ArrowRight className="h-6 w-6 mr-2" />
            Ordinary Leave Flow
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Parent submits a leave request</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Email sent to Warden</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">If approved, parent receives email + confirmation message</span>
            </div>
          </div>
        </div>

        {/* Emergency Leave Flow */}
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2" />
            Emergency Leave Flow
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Parent submits leave request</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Email sent to Tutor</span>
            </div>
            <div className="ml-6 space-y-3">
              <p className="text-gray-700 font-medium">Tutor checks student attendance %:</p>
              <div className="pl-6 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">
                    If ≥ 75%, Tutor forwards to HOD → HOD approves → Email to Tutor + Warden → Final confirmation to parent
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">
                    If &lt; 75%, request is blocked and Tutor is alerted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default AboutGatepass;