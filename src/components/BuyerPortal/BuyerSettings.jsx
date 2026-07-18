import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Globe, Save, Check, Eye, EyeOff, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Globe },
];

function ProfileTab() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.fullName || user?.name || 'Buyer',
    email: user?.email || 'buyer@example.com',
    phone: user?.phone || '+91 98100 12345',
    city: user?.city || 'New Delhi',
    state: user?.state || 'Delhi',
    pincode: user?.pincode || '110001',
    company: user?.company || '',
    gst: user?.gst || '',
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.fullName || user?.name || prev.name || 'Buyer',
      email: user?.email || prev.email || 'buyer@example.com',
      phone: user?.phone || prev.phone || '+91 98100 12345',
      city: user?.city || prev.city || 'New Delhi',
      state: user?.state || prev.state || 'Delhi',
      pincode: user?.pincode || prev.pincode || '110001',
      company: user?.company || prev.company || '',
      gst: user?.gst || prev.gst || '',
    }));
  }, [user?.fullName, user?.email, user?.phone, user?.city, user?.state, user?.pincode, user?.company, user?.gst]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-5">Profile Information</h3>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-3xl shadow-lg">🛒</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-slate-800">{form.name}</p>
            <p className="text-sm text-slate-500">{form.email}</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">Verified Buyer ✓</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries({ 'Full Name': 'name', 'Email Address': 'email', 'Phone Number': 'phone', 'City': 'city', 'State': 'state', 'Pin Code': 'pincode', 'Company (optional)': 'company', 'GST Number (optional)': 'gst' }).map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input
                value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold shadow-md hover:bg-sky-700 transition-colors">
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orderUpdates: true, deliveryAlerts: true, priceDrops: true,
    newArrivals: false, reviewReplies: true, promotions: false,
    smsAlerts: true, emailDigest: false,
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const items = [
    { key: 'orderUpdates', label: 'Order Updates', desc: 'Status changes for your orders' },
    { key: 'deliveryAlerts', label: 'Delivery Alerts', desc: 'Real-time delivery notifications' },
    { key: 'priceDrops', label: 'Price Drops', desc: 'Wishlist item price reductions' },
    { key: 'newArrivals', label: 'New Arrivals', desc: 'Fresh produce just listed' },
    { key: 'reviewReplies', label: 'Review Replies', desc: 'Farmer replies to your reviews' },
    { key: 'promotions', label: 'Promotions', desc: 'Platform deals and offers' },
    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical SMS notifications' },
    { key: 'emailDigest', label: 'Email Digest', desc: 'Weekly summary email' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-5">Notification Preferences</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${prefs[item.key] ? 'bg-sky-500' : 'bg-slate-200'}`}>
              <motion.div animate={{ x: prefs[item.key] ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [show, setShow] = useState({ cur: false, new: false });
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-5">Change Password</h3>
        <div className="space-y-4 max-w-md">
          {[{ label: 'Current Password', key: 'cur' }, { label: 'New Password', key: 'new' }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
              <div className="relative">
                <input type={show[f.key] ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all pr-10" />
                <button onClick={() => setShow(p => ({ ...p, [f.key]: !p[f.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors mt-2">
            {saved ? <><Check size={15} /> Updated!</> : <><Shield size={15} /> Update Password</>}
          </motion.button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-2">Two-Factor Authentication</h3>
        <p className="text-sm text-slate-500 mb-4">Secure your account with 2FA.</p>
        <button className="px-5 py-2.5 rounded-xl border-2 border-sky-500 text-sky-600 text-sm font-semibold hover:bg-sky-50 transition-colors">Enable 2FA</button>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const [lang, setLang] = useState('en');
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <h3 className="font-semibold text-slate-800">App Preferences</h3>
      <div className="max-w-sm">
        <label className="block text-xs font-semibold text-slate-600 mb-2">Language</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-sky-400 outline-none transition-all">
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
        </select>
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors">
        {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
      </motion.button>
    </div>
  );
}

export default function BuyerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </div>
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'preferences' && <PreferencesTab />}
    </div>
  );
}
