import { motion } from 'motion/react';
import { Copy, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

const traceabilityData = {
  productId: 'AGRI-2025-00123456',
  productName: 'Premium Wheat',
  batchNumber: 'BATCH-2025-DEC-001',
  farmOrigin: 'Deswal Agriculture Farm, Hisar, Haryana',
  harvestDate: '2025-12-01',
  harvestLocation: 'Field No. 5 (45°N, 75°E)',
  storageFacility: 'Hisar Agricultural Warehouse',
  transportHistory: [
    { date: '2025-12-01', location: 'Hisar Farm', event: 'Harvested' },
    { date: '2025-12-02', location: 'Storage Facility', event: 'Stored' },
    { date: '2025-12-05', location: 'Quality Check Lab', event: 'Tested - Passed' },
    { date: '2025-12-10', location: 'Distribution Center', event: 'Packaged' },
    { date: '2025-12-15', location: 'In Transit', event: 'Shipped' },
  ],
  quality: {
    moistureContent: '12.5%',
    proteinContent: '11.8%',
    testingLab: 'AgriLab Certification Center',
    certificateNumber: 'CERT-2025-HC123',
  },
  authenticity: 'Verified ✓',
  blockchainHash: '0x7f8E3C9B2A5D6E1F4G9H8I7J6K5L4M3N2O1P0',
};

export default function BlockchainVerification() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(true);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Blockchain Verification</h1>
        <p className="text-accent-muted">Product traceability and authenticity verification</p>
      </div>

      {/* Main Traceability Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{traceabilityData.productName}</h2>
          <p className="text-white/90">Product ID: {traceabilityData.productId}</p>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Farm Origin */}
              <div>
                <h3 className="text-sm font-bold text-accent-muted mb-3 uppercase tracking-wider">🌾 Farm Origin</h3>
                <div className="bg-surface-alt rounded-lg p-4">
                  <p className="text-primary font-medium">{traceabilityData.farmOrigin}</p>
                  <p className="text-sm text-accent-muted mt-2">Harvest Date: {traceabilityData.harvestDate}</p>
                </div>
              </div>

              {/* Quality Details */}
              <div>
                <h3 className="text-sm font-bold text-accent-muted mb-3 uppercase tracking-wider">✓ Quality Certification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-alt rounded-lg p-4">
                    <p className="text-xs text-accent-muted mb-1">Moisture Content</p>
                    <p className="text-lg font-bold text-primary">{traceabilityData.quality.moistureContent}</p>
                  </div>
                  <div className="bg-surface-alt rounded-lg p-4">
                    <p className="text-xs text-accent-muted mb-1">Protein Content</p>
                    <p className="text-lg font-bold text-primary">{traceabilityData.quality.proteinContent}</p>
                  </div>
                  <div className="bg-surface-alt rounded-lg p-4 col-span-2">
                    <p className="text-xs text-accent-muted mb-1">Testing Lab</p>
                    <p className="text-sm font-medium text-primary">{traceabilityData.quality.testingLab}</p>
                    <p className="text-xs text-accent-muted mt-1">Certificate: {traceabilityData.quality.certificateNumber}</p>
                  </div>
                </div>
              </div>

              {/* Transport History */}
              <div>
                <h3 className="text-sm font-bold text-accent-muted mb-3 uppercase tracking-wider">🚚 Transport History</h3>
                <div className="space-y-3">
                  {traceabilityData.transportHistory.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-primary">{entry.event}</p>
                        <p className="text-xs text-accent-muted mt-0.5">{entry.location}</p>
                        <p className="text-xs text-accent-muted">{entry.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Blockchain Hash */}
              <div>
                <h3 className="text-sm font-bold text-accent-muted mb-3 uppercase tracking-wider">🔗 Blockchain Hash</h3>
                <div className="bg-slate-900 text-white rounded-lg p-4 font-mono text-xs break-all flex items-center justify-between">
                  <span>{traceabilityData.blockchainHash}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(traceabilityData.blockchainHash)}
                    className="ml-2 p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Copy size={16} />
                  </motion.button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-green-600 mt-2"
                  >
                    ✓ Copied to clipboard
                  </motion.p>
                )}
              </div>
            </div>

            {/* Right: QR Code & Actions */}
            <div className="lg:col-span-1 flex flex-col items-center space-y-4">
              {/* QR Code */}
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface-alt p-4 rounded-lg flex items-center justify-center"
                >
                  <div className="w-40 h-40 bg-white border-2 border-primary flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📱</div>
                      <p className="text-xs text-primary font-bold">QR Code</p>
                    </div>
                  </div>
                  <p className="text-xs text-center text-accent-muted mt-3">Scan to verify</p>
                </motion.div>
              )}

              {/* Authenticity Badge */}
              <div className="w-full text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm font-bold text-green-700">✓ Authenticity Verified</p>
                <p className="text-xs text-green-600 mt-1">On Blockchain</p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowQR(!showQR)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-alt text-primary rounded-lg hover:bg-surface-alt/80 transition-colors text-sm font-medium"
                >
                  {showQR ? '🔍 Hide QR' : '🔍 Show QR'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Download Certificate
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium"
                >
                  <Share2 size={16} />
                  Share Verification
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Products */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4">Other Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Basmati Rice', 'Yellow Mustard', 'Organic Corn'].map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-surface-alt p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-primary">{product}</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>
              </div>
              <p className="text-xs text-accent-muted mb-3">Batch: BATCH-2025-DEC-00{idx + 2}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-3 py-2 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
              >
                View Traceability
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
