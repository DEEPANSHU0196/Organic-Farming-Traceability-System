import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Truck, Star, Award, TrendingUp, Edit2, Save, X } from 'lucide-react';

export default function TransporterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Vikram Singh',
    email: 'vikram.singh@logistics.com',
    phone: '+91-98765-43210',
    licenseNumber: 'DL-01-AB-1234',
    vehicleNumber: 'DL-01-AB-5678',
    vehicleType: 'Truck - 10 Ton',
    areaOfOperation: 'Delhi, Noida, Gurgaon, Haryana',
    yearsExperience: 8,
    city: 'New Delhi',
    documentVerification: 'Verified',
    accountStatus: 'Active',
  });

  const [editData, setEditData] = useState(profile);

  const stats = [
    { label: 'Total Deliveries', value: '1,245', icon: Truck },
    { label: 'Success Rate', value: '98.5%', icon: TrendingUp },
    { label: 'Rating', value: '4.8/5', icon: Star },
    { label: 'Awards', value: '12', icon: Award },
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile);
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your transporter profile and credentials</p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </motion.button>
        )}
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white">
            <Truck size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <p className="text-blue-100 flex items-center gap-2">
              <MapPin size={16} />
              {profile.city}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-sm font-semibold">
                {profile.accountStatus}
              </span>
              <span className="px-3 py-1 bg-blue-400 text-blue-900 rounded-full text-sm font-semibold">
                {profile.documentVerification}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                <Icon size={24} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>

        <div className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.phone}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.city}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          <h3 className="text-xl font-bold text-gray-800">License & Vehicle Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* License Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.licenseNumber}
                  onChange={(e) => setEditData({ ...editData, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-mono">{profile.licenseNumber}</p>
              )}
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.vehicleNumber}
                  onChange={(e) => setEditData({ ...editData, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-mono">{profile.vehicleNumber}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.vehicleType}
                  onChange={(e) => setEditData({ ...editData, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.vehicleType}</p>
              )}
            </div>

            {/* Years Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.yearsExperience}
                  onChange={(e) => setEditData({ ...editData, yearsExperience: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.yearsExperience} years</p>
              )}
            </div>
          </div>

          {/* Area of Operation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Area of Operation</label>
            {isEditing ? (
              <textarea
                value={editData.areaOfOperation}
                onChange={(e) => setEditData({ ...editData, areaOfOperation: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{profile.areaOfOperation}</p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
