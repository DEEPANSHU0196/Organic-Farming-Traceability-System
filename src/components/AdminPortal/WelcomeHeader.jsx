import React from 'react';
import { Calendar, Clock, Activity } from 'lucide-react';

const WelcomeHeader = () => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, Admin</h1>
          <p className="text-green-100 text-lg mb-6">
            Here's what happening across your AgriTrust platform today
          </p>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-xs text-green-100">Date</p>
                <p className="font-semibold">{dayName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-xs text-green-100">Time</p>
                <p className="font-semibold">{today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <div>
                <p className="text-xs text-green-100">Platform Status</p>
                <p className="font-semibold">Operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Summary */}
        <div className="hidden md:block text-right">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-xs text-green-100 mb-2">CRITICAL ALERTS</p>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-green-100 mt-1">Require your attention</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
