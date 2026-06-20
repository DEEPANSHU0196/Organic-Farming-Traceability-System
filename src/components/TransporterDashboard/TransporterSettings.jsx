import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Truck, Save, Check, Eye, EyeOff, Camera, Plus } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'vehicle', label: 'My Vehicle', icon: Truck },
];

function ProfileTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: 'Manish Singh', email: 'manish@logistics.com', phone: '+91 98765 43210',
    license: 'HR-12-2019-009876', city: 'Rohtak', state: 'Haryana', experience: '8 Years',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg">🚚</div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors">
            <Camera size={13} className="text-white" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{form.name}</p>
          <p className="text-sm text-slate-500">{form.email}</p>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Verified Transporter ✓</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries({ 'Full Name': 'name', 'Email': 'email', 'Phone': 'phone', 'License No.': 'license', 'City': 'city', 'State': 'state', 'Experience': 'experience' }).map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
            <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold shadow-md hover:bg-orange-600 transition-colors">
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </motion.button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newAssignments: true, deliveryUpdates: true, paymentAlerts: true,
    routeChanges: true, vehicleAlerts: false, promotions: false,
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const items = [
    { key: 'newAssignments', label: 'New Assignments', desc: 'When a new delivery is assigned to you' },
    { key: 'deliveryUpdates', label: 'Delivery Updates', desc: 'Status changes on your deliveries' },
    { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'When payment is credited' },
    { key: 'routeChanges', label: 'Route Changes', desc: 'Modifications to your routes' },
    { key: 'vehicleAlerts', label: 'Vehicle Alerts', desc: 'Service reminders for your vehicle' },
    { key: 'promotions', label: 'Promotions', desc: 'Platform promotions and offers' },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-5">Notification Preferences</h3>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${prefs[item.key] ? 'bg-orange-500' : 'bg-slate-200'}`}>
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-5">Change Password</h3>
      <div className="space-y-4 max-w-md">
        {[{ label: 'Current Password', key: 'cur' }, { label: 'New Password', key: 'new' }].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
            <div className="relative">
              <input type={show[f.key] ? 'text' : 'password'} placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all pr-10" />
              <button onClick={() => setShow(p => ({ ...p, [f.key]: !p[f.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {show[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors mt-2">
          {saved ? <><Check size={15} /> Updated!</> : <><Shield size={15} /> Update Password</>}
        </motion.button>
      </div>
    </div>
  );
}

function VehicleTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    regNo: 'HR-26-AB-1234', type: 'Tempo', capacity: '2 Ton', fuel: 'Diesel', year: '2021',
  });
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <h3 className="font-semibold text-slate-800">My Vehicle Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries({ 'Registration No.': 'regNo', 'Vehicle Type': 'type', 'Capacity': 'capacity', 'Fuel Type': 'fuel', 'Year of Manufacture': 'year' }).map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
            <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all" />
          </div>
        ))}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Documents</h4>
        <div className="space-y-2">
          {['RC Book', 'Insurance', 'Fitness Certificate', 'Pollution Certificate'].map(doc => (
            <div key={doc} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-sm text-slate-700">{doc}</span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                <Plus size={12} /> Upload
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </motion.button>
      </div>
    </div>
  );
}

export default function TransporterSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account and vehicle information</p>
      </div>
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'vehicle' && <VehicleTab />}
    </div>
  );
}
