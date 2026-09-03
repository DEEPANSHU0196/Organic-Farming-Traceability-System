import { useEffect, useState } from 'react';
import { CheckCircle, Eye, Lock, MapPin, Phone, Trash2, Truck, XCircle } from 'lucide-react';
import api from '../../api/axios';

export default function TransportersManagement() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const response = await api.get('/users');
        if (response?.data?.success) {
          const allUsers = response.data.users || [];
          setTransporters(allUsers.filter((user) => user.role === 'transporter').map((user) => ({
            id: user._id,
            name: user.fullName || user.name || 'Anonymous Transporter',
            email: user.email || 'No email provided',
            phone: user.phone || 'No phone provided',
            location: user.address || 'India',
            status: 'Active',
            joinDate: user.createdAt
              ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Unknown',
          })));
        }
      } catch (error) {
        console.error('Failed to load transporters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransporters();
  }, []);

  const handleDelete = async (transporter) => {
    if (!window.confirm(`Remove ${transporter.name} from the platform?`)) return;
    try {
      setDeletingId(transporter.id);
      await api.delete(`/users/${transporter.id}`);
      setTransporters((current) => current.filter((item) => item.id !== transporter.id));
    } catch (error) {
      console.error('Failed to remove transporter:', error);
      window.alert(error?.response?.data?.message || 'Unable to remove this transporter.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-2 text-orange-600"><Truck size={20} /></div>
            <h3 className="text-lg font-bold text-slate-900">Transporters Management</h3>
          </div>
          <p className="text-sm text-slate-500">Manage delivery partners, contacts, and platform access.</p>
        </div>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600">
          + Add Transporter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {['Transporter', 'Contact', 'Location', 'Status', 'Joined', 'Actions'].map((heading) => (
                <th key={heading} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transporters.map((transporter, index) => (
              <tr key={transporter.id} className={`border-b border-slate-200 transition-colors hover:bg-orange-50/30 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{transporter.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{transporter.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600"><span className="flex items-center gap-2"><Phone size={14} className="text-orange-500" />{transporter.phone}</span></td>
                <td className="px-6 py-4 text-sm text-slate-600"><span className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" />{transporter.location}</span></td>
                <td className="px-6 py-4"><span className="flex items-center gap-2 text-sm font-medium text-emerald-700"><CheckCircle size={16} />{transporter.status}</span></td>
                <td className="px-6 py-4 text-sm text-slate-600">{transporter.joinDate}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100" title="View transporter"><Eye size={16} /></button>
                    <button className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600" title="Suspend transporter"><Lock size={16} /></button>
                    <button onClick={() => handleDelete(transporter)} disabled={deletingId === transporter.id} className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40" title="Remove transporter"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && transporters.length === 0 && <div className="p-10 text-center text-sm text-slate-500"><XCircle className="mx-auto mb-2 text-slate-300" size={24} />No transporters registered yet.</div>}
      <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-600">{loading ? 'Loading...' : `Showing ${transporters.length} registered transporter(s)`}</div>
    </div>
  );
}
