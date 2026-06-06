import { motion } from 'motion/react';
import { CheckCircle2, Truck, Package, MapPin } from 'lucide-react';

const shipments = [
  {
    id: '#SH001',
    order: '#OD001',
    status: 'In Transit',
    progress: 75,
    currentStep: 3,
    steps: ['Order Received', 'Packed', 'Picked Up', 'In Transit', 'Delivered'],
  },
  {
    id: '#SH002',
    order: '#OD002',
    status: 'Delivered',
    progress: 100,
    currentStep: 4,
    steps: ['Order Received', 'Packed', 'Picked Up', 'In Transit', 'Delivered'],
  },
  {
    id: '#SH003',
    order: '#OD004',
    status: 'Packed',
    progress: 40,
    currentStep: 1,
    steps: ['Order Received', 'Packed', 'Picked Up', 'In Transit', 'Delivered'],
  },
];

export default function ShipmentTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Shipment Tracking</h1>
        <p className="text-accent-muted">Track your products in real-time</p>
      </div>

      {/* Shipments */}
      <div className="space-y-6">
        {shipments.map((shipment, idx) => (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg shadow-md border border-surface-alt p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-alt">
              <div>
                <h3 className="text-lg font-bold text-primary">{shipment.id}</h3>
                <p className="text-sm text-accent-muted">Order: {shipment.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    shipment.status === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : shipment.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {shipment.status}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-accent-muted">Progress</p>
                <p className="text-sm font-bold text-primary">{shipment.progress}%</p>
              </div>
              <div className="w-full h-2 bg-surface-alt rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                />
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="flex items-center justify-between">
              {shipment.steps.map((step, stepIdx) => (
                <div key={stepIdx} className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + stepIdx * 0.1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      stepIdx <= shipment.currentStep
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                        : 'bg-surface-alt border border-surface-alt'
                    }`}
                  >
                    {stepIdx <= shipment.currentStep ? (
                      <CheckCircle2 className="text-white" size={20} />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-surface-alt" />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <p
                    className={`text-xs text-center font-medium transition-colors ${
                      stepIdx <= shipment.currentStep ? 'text-primary' : 'text-accent-muted'
                    }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="mt-6 pt-6 border-t border-surface-alt grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '📦', label: 'Current Location', value: 'Delhi Hub' },
                { icon: '📞', label: 'Carrier', value: 'FastFreight Co.' },
                { icon: '🚚', label: 'Estimated Delivery', value: '2025-12-20' },
                { icon: '📍', label: 'Destination', value: 'Jaipur, Raj.' },
              ].map((detail, idx) => (
                <div key={idx}>
                  <p className="text-sm text-accent-muted mb-1">{detail.label}</p>
                  <p className="font-medium text-primary">{detail.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
