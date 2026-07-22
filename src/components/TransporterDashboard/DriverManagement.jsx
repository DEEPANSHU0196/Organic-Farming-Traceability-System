import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Edit2, Trash2, Phone, Star } from 'lucide-react';

const statusColors = {
  Available: { bg: '#dcfce7', text: '#16a34a' },
  'On Duty': { bg: '#dbeafe', text: '#2563eb' },
  Leave: { bg: '#fef9c3', text: '#ca8a04' },
  Inactive: { bg: '#f1f5f9', text: '#64748b' },
};

export default function DriverManagement() {
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('transporter_drivers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem('transporter_drivers', JSON.stringify(drivers));
  }, [drivers]);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', license: '', vehicle: '' });

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search) ||
    d.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.phone) return;
    setDrivers(p => [...p, {
      id: `D00${p.length + 1}`,
      ...form,
      trips: 0, rating: 0, status: 'Available', joined: 'Jun 2026',
    }]);
    setForm({ name: '', phone: '', license: '', vehicle: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Driver Management</h2>
          <p className="text-slate-500 text-sm mt-1">{drivers.length} drivers in your team</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md">
          <Plus size={15} /> Add Driver
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusColors).map(([status, style]) => (
          <div key={status} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xl font-bold text-slate-800">{drivers.filter(d => d.status === status).length}</div>
            <div className="text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full w-fit" style={{ background: style.bg, color: style.text }}>{status}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Add New Driver</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'name', placeholder: 'Driver full name' },
              { label: 'Phone', key: 'phone', placeholder: '+91 98765 XXXXX' },
              { label: 'License No.', key: 'license', placeholder: 'HR-12-2024-XXXXXX' },
              { label: 'Assigned Vehicle', key: 'vehicle', placeholder: 'Vehicle reg no.' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                <input value={form[f.key]} placeholder={f.placeholder}
                  onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleAdd}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
              Add Driver
            </motion.button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Users size={17} className="text-slate-500" />
          <h3 className="font-semibold text-slate-800 flex-1">Drivers</h3>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drivers..."
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 outline-none w-48" />
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map(d => {
            const sc = statusColors[d.status] || statusColors.Inactive;
            return (
              <div key={d.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} />{d.phone}</span>
                    <span className="text-xs text-slate-400">{d.vehicle}</span>
                  </div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-bold text-slate-800">{d.trips}</div>
                  <div className="text-xs text-slate-400">Trips</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star size={12} fill="currentColor" />{d.rating || '—'}
                  </div>
                  <div className="text-xs text-slate-400">Rating</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: sc.bg, color: sc.text }}>{d.status}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors text-slate-400 hover:text-orange-500"><Edit2 size={14} /></button>
                  <button onClick={() => setDrivers(p => p.filter(x => x.id !== d.id))} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No drivers found</div>
          )}
        </div>
      </div>
    </div>
  );
}
