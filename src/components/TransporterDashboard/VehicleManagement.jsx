import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, Plus, Edit2, Trash2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const statusStyles = {
  Active: { bg: '#dcfce7', text: '#16a34a', icon: CheckCircle },
  'In Transit': { bg: '#dbeafe', text: '#2563eb', icon: Truck },
  Maintenance: { bg: '#fef9c3', text: '#ca8a04', icon: AlertTriangle },
  Idle: { bg: '#f1f5f9', text: '#64748b', icon: Clock },
};

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('transporter_vehicles');
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
    localStorage.setItem('transporter_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [newVehicle, setNewVehicle] = useState({ regNo: '', type: 'Tempo', capacity: '', driver: '', fuel: 'Diesel' });

  const filtered = vehicles.filter(v =>
    v.regNo.toLowerCase().includes(search.toLowerCase()) ||
    v.driver.toLowerCase().includes(search.toLowerCase()) ||
    v.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newVehicle.regNo || !newVehicle.capacity) return;
    setVehicles(p => [...p, {
      id: `V00${p.length + 1}`,
      ...newVehicle,
      status: 'Active',
      lastService: 'Jun 20, 2026',
      nextService: 'Sep 20, 2026',
    }]);
    setNewVehicle({ regNo: '', type: 'Tempo', capacity: '', driver: '', fuel: 'Diesel' });
    setShowForm(false);
  };

  const handleDelete = (id) => setVehicles(p => p.filter(v => v.id !== id));

  const statusCounts = Object.fromEntries(
    ['Active', 'In Transit', 'Maintenance', 'Idle'].map(s => [s, vehicles.filter(v => v.status === s).length])
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vehicle Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your fleet of {vehicles.length} vehicles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
        >
          <Plus size={15} /> Add Vehicle
        </motion.button>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusStyles).map(([status, style]) => {
          const Icon = style.icon;
          return (
            <div key={status} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: style.bg }}>
                <Icon size={15} style={{ color: style.text }} />
              </div>
              <div className="text-xl font-bold text-slate-800">{statusCounts[status] || 0}</div>
              <div className="text-xs text-slate-500">{status}</div>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Add New Vehicle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Registration No.', key: 'regNo', type: 'text', placeholder: 'HR-26-AB-1234' },
              { label: 'Capacity', key: 'capacity', type: 'text', placeholder: '2 Ton' },
              { label: 'Assigned Driver', key: 'driver', type: 'text', placeholder: 'Driver name' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                <input
                  type={f.type} value={newVehicle[f.key]} placeholder={f.placeholder}
                  onChange={(e) => setNewVehicle(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Vehicle Type</label>
              <select value={newVehicle.type} onChange={(e) => setNewVehicle(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:border-orange-400 outline-none">
                {['Tempo', 'Mini Truck', 'Large Truck', 'Refrigerated'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fuel Type</label>
              <select value={newVehicle.fuel} onChange={(e) => setNewVehicle(p => ({ ...p, fuel: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:border-orange-400 outline-none">
                {['Diesel', 'CNG', 'Electric', 'Petrol'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleAdd}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
              Add Vehicle
            </motion.button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 flex-1">Fleet</h3>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reg no, driver, type..."
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-orange-400 outline-none w-56"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Reg. No.', 'Type', 'Capacity', 'Fuel', 'Driver', 'Status', 'Next Service', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(v => {
                const style = statusStyles[v.status] || statusStyles.Idle;
                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{v.regNo}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.type}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.capacity}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.fuel}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.driver || <span className="text-slate-400 italic">Unassigned</span>}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: style.bg, color: style.text }}>{v.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{v.nextService}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors text-slate-400 hover:text-orange-500"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No vehicles found</div>
          )}
        </div>
      </div>
    </div>
  );
}
