import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { useState } from 'react';
import { useBuyer } from '../../contexts/BuyerContext';

export default function BuyerProfile() {
  const { buyerProfile, updateBuyerProfile } = useBuyer();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(buyerProfile);

  const handleSave = () => {
    updateBuyerProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-accent-muted">Manage your account information</p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            <Edit2 size={18} />
            Edit Profile
          </motion.button>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-md border border-surface-alt p-8 space-y-6">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-primary mb-2 block">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-primary mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-primary mb-2 block">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-primary mb-2 block">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setFormData(buyerProfile);
                  setIsEditing(false);
                }}
                className="flex-1 px-6 py-3 border border-surface-alt rounded-lg font-semibold hover:bg-surface-alt transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-lg">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
                {buyerProfile.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-primary">{buyerProfile.name}</p>
                <p className="text-sm text-accent-muted">Premium Member</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                <Mail size={18} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-accent-muted">Email</p>
                  <p className="font-semibold text-primary">{buyerProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                <Phone size={18} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-accent-muted">Phone</p>
                  <p className="font-semibold text-primary">{buyerProfile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                <MapPin size={18} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-accent-muted">Address</p>
                  <p className="font-semibold text-primary">{buyerProfile.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Addresses */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow-md border border-surface-alt p-6 space-y-4">
          <h3 className="text-xl font-bold text-primary">Saved Addresses</h3>
          <div className="space-y-3">
            {buyerProfile.savedAddresses.map(address => (
              <motion.div
                key={address.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-surface-alt rounded-lg hover:border-emerald-500 transition-colors"
              >
                <p className="font-semibold text-primary mb-1">{address.name}</p>
                <p className="text-sm text-accent-muted flex items-center gap-2">
                  <MapPin size={14} />
                  {address.address}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
