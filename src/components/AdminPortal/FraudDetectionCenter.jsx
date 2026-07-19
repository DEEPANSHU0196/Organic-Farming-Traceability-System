import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const FraudDetectionCenter = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Fraud Detection Center
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Monitor suspicious activities and protect the platform
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            0 Active Alerts
          </span>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-16 flex flex-col items-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <ShieldCheck className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">All Clear!</h3>
        <p className="text-sm text-slate-500 max-w-md">
          No suspicious activity has been flagged by the system. The fraud detection engine is running and actively monitoring all transactions, accounts, and listings in real time.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center w-full max-w-sm">
          {[
            { label: 'Accounts Scanned', value: 'Live' },
            { label: 'Transactions Reviewed', value: 'Live' },
            { label: 'Threats Blocked', value: '0' },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-base font-bold text-slate-800">{item.value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400">Fraud detection engine is active and monitoring the platform 24/7</p>
      </div>
    </div>
  );
};

export default FraudDetectionCenter;
