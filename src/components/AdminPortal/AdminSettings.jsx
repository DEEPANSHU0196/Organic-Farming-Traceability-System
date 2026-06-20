import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Globe, Palette, Database, Save, Check, Eye, EyeOff, Camera, ToggleLeft, ToggleRight } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'platform', label: 'Platform', icon: Globe },
];

function ProfileTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: 'Admin User', email: 'admin@agritrust.com', phone: '+91 98000 00001',
    role: 'Super Administrator', department: 'Platform Operations',
  });
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">🛡️</div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center shadow-md hover:bg-violet-700 transition-colors">
            <Camera size={13} className="text-white" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{form.name}</p>
          <p className="text-sm text-slate-500">{form.email}</p>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Super Admin 🛡️</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries({ 'Full Name': 'name', 'Email': 'email', 'Phone': 'phone', 'Role': 'role', 'Department': 'department' }).map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: saved ? '#22c55e' : '#7c3aed' }}
        >
          {saved ? <><Check size={15} />Saved!</> : <><Save size={15} />Save Changes</>}
        </motion.button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    newRegistrations: true, orderAlerts: true, suspiciousActivity: true,
    systemUpdates: false, weeklyReports: true, emailDigest: false,
  });
  const toggle = (k) => setSettings((s) => ({ ...s, [k]: !s[k] }));
  const items = [
    { key: 'newRegistrations', label: 'New Registrations', desc: 'Alert when new farmers/buyers register' },
    { key: 'orderAlerts', label: 'Order Alerts', desc: 'Notify on large or suspicious orders' },
    { key: 'suspiciousActivity', label: 'Suspicious Activity', desc: 'Fraud detection and security alerts' },
    { key: 'systemUpdates', label: 'System Updates', desc: 'Platform updates and maintenance notices' },
    { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Automated weekly analytics digest' },
    { key: 'emailDigest', label: 'Email Digest', desc: 'Daily summary via email' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
          <div>
            <p className="text-sm font-semibold text-slate-800">{item.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
          </div>
          <button onClick={() => toggle(item.key)} className="flex-shrink-0 ml-4">
            {settings[item.key]
              ? <ToggleRight size={28} className="text-violet-600" />
              : <ToggleLeft size={28} className="text-slate-300" />}
          </button>
        </div>
      ))}
    </div>
  );
}

function SecurityTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ old: '', new: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    if (form.new && form.new === form.confirm) {
      setSaved(true); setForm({ old: '', new: '', confirm: '' });
      setTimeout(() => setSaved(false), 2500);
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div>
        <h4 className="font-semibold text-slate-800 mb-4">Change Password</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Current Password</label>
            <div className="relative">
              <input type={showOld ? 'text' : 'password'} value={form.old} onChange={(e) => setForm((f) => ({ ...f, old: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 pr-10" />
              <button onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={form.new} onChange={(e) => setForm((f) => ({ ...f, new: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 pr-10" />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: saved ? '#22c55e' : '#7c3aed' }}
          >
            {saved ? <><Check size={15} />Updated!</> : <><Shield size={15} />Update Password</>}
          </motion.button>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-5">
        <h4 className="font-semibold text-slate-800 mb-3">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl border border-violet-100">
          <div>
            <p className="text-sm font-semibold text-slate-800">Authenticator App</p>
            <p className="text-xs text-slate-500 mt-0.5">Use Google Authenticator or similar</p>
          </div>
          <button className="px-4 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
            Enable
          </button>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-5">
        <h4 className="font-semibold text-slate-800 mb-3">Recent Login Activity</h4>
        <div className="space-y-2">
          {[
            { device: 'Chrome · Windows 11', location: 'New Delhi, IN', time: 'Just now', current: true },
            { device: 'Safari · MacOS', location: 'Mumbai, IN', time: '2 days ago', current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-800">{session.device}</p>
                <p className="text-xs text-slate-500">{session.location} · {session.time}</p>
              </div>
              {session.current
                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Current</span>
                : <button className="text-xs text-red-500 hover:underline">Revoke</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlatformTab() {
  const [settings, setSettings] = useState({
    maintenanceMode: false, newRegistrations: true, autoApprove: false,
    fraudDetection: true, emailNotifications: true, smsAlerts: false,
  });
  const toggle = (k) => setSettings((s) => ({ ...s, [k]: !s[k] }));
  const items = [
    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put platform in read-only maintenance mode', danger: true },
    { key: 'newRegistrations', label: 'Allow New Registrations', desc: 'Accept new farmer and buyer signups' },
    { key: 'autoApprove', label: 'Auto-approve Products', desc: 'Automatically approve product listings' },
    { key: 'fraudDetection', label: 'Fraud Detection Engine', desc: 'AI-powered suspicious activity detection' },
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send transactional emails to users' },
    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Send SMS notifications for critical events' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
      {items.map((item) => (
        <div key={item.key} className={`flex items-center justify-between py-3 border-b border-slate-50 last:border-0 ${item.danger && settings[item.key] ? 'bg-red-50 -mx-6 px-6 rounded-xl' : ''}`}>
          <div>
            <p className={`text-sm font-semibold ${item.danger && settings[item.key] ? 'text-red-700' : 'text-slate-800'}`}>{item.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
          </div>
          <button onClick={() => toggle(item.key)} className="flex-shrink-0 ml-4">
            {settings[item.key]
              ? <ToggleRight size={28} className={item.danger ? 'text-red-500' : 'text-violet-600'} />
              : <ToggleLeft size={28} className="text-slate-300" />}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'security': return <SecurityTab />;
      case 'platform': return <PlatformTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your admin profile and platform settings</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTab()}
      </motion.div>
    </div>
  );
}
