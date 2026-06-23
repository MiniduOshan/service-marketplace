import React from 'react';
import { Settings, Wrench, ShieldAlert } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10 text-center relative overflow-hidden">
          
          <div className="absolute -top-12 -right-12 text-slate-50 opacity-50">
            <Settings size={150} className="animate-[spin_10s_linear_infinite]" />
          </div>

          <div className="mx-auto h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative z-10 border border-emerald-100">
            <Wrench size={40} className="text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">
            System Under Maintenance
          </h2>
          
          <p className="text-slate-500 text-sm mb-8 leading-relaxed relative z-10">
            We are currently upgrading the platform to serve you better. 
            All customer and worker features are temporarily paused. 
            Please check back soon.
          </p>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200/50 flex items-start gap-3 relative z-10 text-left">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-amber-700 leading-snug">
              <strong>Are you an Administrator?</strong><br/>
              Admin access remains fully operational. If you need to access the dashboard, <a href="/login" className="text-emerald-600 font-bold hover:underline">sign in here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
