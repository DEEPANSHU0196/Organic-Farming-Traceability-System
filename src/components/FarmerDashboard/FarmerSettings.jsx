import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  User, Bell, Shield, Palette, Globe, CreditCard,
  Eye, EyeOff, Save, Camera, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Palette },
];

function ProfileTab() {
  const { user, updateUserProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    village: '',
    state: '',
    pincode: '',
    farmSize: '',
    cropTypes: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        village: user.address || '',
        state: '',
        pincode: '',
        farmSize: '',
        cropTypes: '',
        bio: '',
      }));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put('/users/profile', {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        address: [form.village, form.state, form.pincode].filter(Boolean).join(', '),
      });

      const updatedUser = response?.data?.user;
      if (updatedUser) {
        const authUser = {
          ...user,
          ...updatedUser,
          fullName: updatedUser.fullName || updatedUser.name || user?.fullName || user?.name || '',
          email: updatedUser.email || user?.email || '',
          phone: updatedUser.phone || user?.phone || '',
          address: updatedUser.address || user?.address || '',
        };
        updateUserProfile(authUser);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-5">Profile Photo</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              🌾
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-slate-800">{form.name}</p>
            <p className="text-sm text-slate-500">{form.email}</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Verified Farmer ✓</span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-5">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Email Address', key: 'email', type: 'email' },
            { label: 'Phone Number', key: 'phone', type: 'tel' },
            { label: 'Village / City', key: 'village', type: 'text' },
            { label: 'State', key: 'state', type: 'text' },
            { label: 'Pin Code', key: 'pincode', type: 'text' },
            { label: 'Farm Size', key: 'farmSize', type: 'text' },
            { label: 'Crop Types', key: 'cropTypes', type: 'text' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving...' : saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orderUpdates: true, newBuyerInquiries: true, paymentAlerts: true,
    shipmentUpdates: true, reviewNotifications: false, marketingEmails: false,
    smsAlerts: true, pushNotifications: true,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified when order status changes' },
    { key: 'newBuyerInquiries', label: 'Buyer Inquiries', desc: 'New messages from interested buyers' },
    { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Payment received or pending alerts' },
    { key: 'shipmentUpdates', label: 'Shipment Updates', desc: 'Real-time delivery status updates' },
    { key: 'reviewNotifications', label: 'Review Notifications', desc: 'When buyers leave a review' },
    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Platform tips and seasonal offers' },
    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
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
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${prefs[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <motion.div
                animate={{ x: prefs[item.key] ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-5">Change Password</h3>
        <div className="space-y-4 max-w-md">
          {[
            { label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { label: 'New Password', show: showNew, toggle: () => setShowNew(!showNew) },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all pr-10"
                />
                <button onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-colors mt-2"
          >
            {saved ? <><Check size={15} /> Updated!</> : <><Shield size={15} /> Update Password</>}
          </motion.button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-2">Two-Factor Authentication</h3>
        <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
        <button className="px-5 py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-colors">
          Enable 2FA
        </button>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const [lang, setLang] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('light');
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <h3 className="font-semibold text-slate-800">Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Language</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-emerald-400 outline-none transition-all">
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-emerald-400 outline-none transition-all">
            <option value="INR">₹ Indian Rupee</option>
            <option value="USD">$ US Dollar</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Theme</label>
          <div className="flex gap-2">
            {['light', 'dark', 'system'].map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${theme === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-colors"
      >
        {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
      </motion.button>
    </div>
  );
}

export default function FarmerSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':       return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'security':      return <SecurityTab />;
      case 'preferences':   return <PreferencesTab />;
      default:              return <ProfileTab />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account, notifications and preferences</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {renderTab()}
    </div>
  );
}
