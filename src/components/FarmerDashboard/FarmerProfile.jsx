import { motion } from 'motion/react';
import { Edit2, Phone, Mail, MapPin, Award, Camera } from 'lucide-react';

export default function FarmerProfile() {
  const farmerData = {
    name: 'Jatin Deswal',
    email: 'jatin@farm.com',
    phone: '+91 98765 43210',
    farmName: 'Deswal Agriculture Farm',
    location: 'Hisar, Haryana',
    farmSize: '45 acres',
    crops: ['Wheat', 'Rice', 'Mustard', 'Cotton'],
    yearsExperience: 15,
    image: '👨‍🌾',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Edit2 size={18} />
          Edit Profile
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-24" />
          <div className="p-6 -mt-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto text-5xl mb-4 border-4 border-white shadow-lg">
              {farmerData.image}
            </div>
            <h2 className="text-2xl font-bold text-primary mb-1">{farmerData.name}</h2>
            <p className="text-accent-muted mb-4">Verified Farmer</p>
            <div className="flex items-center justify-center gap-2 text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full w-fit mx-auto mb-6">
              <Award size={16} />
              {farmerData.yearsExperience} Years Experience
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-accent rounded-lg hover:bg-surface-alt transition-colors"
            >
              <Camera size={18} />
              Change Photo
            </motion.button>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-md border border-surface-alt p-6"
        >
          <h3 className="text-lg font-bold text-primary mb-6">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm text-accent-muted mb-2 block">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                <Mail size={18} className="text-accent" />
                <input
                  type="email"
                  value={farmerData.email}
                  className="bg-transparent outline-none w-full text-primary"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-accent-muted mb-2 block">Phone Number</label>
              <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
                <Phone size={18} className="text-accent" />
                <input
                  type="tel"
                  value={farmerData.phone}
                  className="bg-transparent outline-none w-full text-primary"
                  readOnly
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-primary mb-6">Farm Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-accent-muted mb-2 block">Farm Name</label>
              <div className="p-3 bg-surface-alt rounded-lg text-primary">{farmerData.farmName}</div>
            </div>
            <div>
              <label className="text-sm text-accent-muted mb-2 block">Location</label>
              <div className="flex items-center gap-2 p-3 bg-surface-alt rounded-lg text-primary">
                <MapPin size={18} className="text-accent" />
                {farmerData.location}
              </div>
            </div>
            <div>
              <label className="text-sm text-accent-muted mb-2 block">Farm Size</label>
              <div className="p-3 bg-surface-alt rounded-lg text-primary">{farmerData.farmSize}</div>
            </div>
            <div>
              <label className="text-sm text-accent-muted mb-2 block">Primary Crops</label>
              <div className="p-3 bg-surface-alt rounded-lg text-primary">{farmerData.crops.join(', ')}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders Completed', value: '156', color: 'bg-emerald-50' },
          { label: 'Average Rating', value: '4.8/5', color: 'bg-blue-50' },
          { label: 'Total Products Sold', value: '2,450 kg', color: 'bg-amber-50' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className={`${stat.color} rounded-lg p-4 text-center`}
          >
            <p className="text-sm text-accent-muted mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
