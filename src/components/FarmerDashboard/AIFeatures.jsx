import { motion } from 'motion/react';
import { Upload, Zap, TrendingUp, Cloud } from 'lucide-react';
import { useState } from 'react';

export default function AIFeatures() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysisResult({
          disease: 'Powdery Mildew',
          confidence: 92,
          severity: 'Moderate',
          treatment: [
            'Apply sulfur-based fungicide',
            'Improve air circulation',
            'Remove infected leaves',
            'Apply neem oil spray',
          ],
        });
      }, 1500);
    }
  };

  const weatherData = {
    temp: 18,
    humidity: 65,
    rainfall: 35,
    windSpeed: 12,
    forecastDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    forecastTemps: [18, 20, 19, 17, 16],
  };

  const marketPrices = [
    { crop: 'Wheat', price: 2500, change: '+2.5%', color: 'from-amber-400 to-orange-500' },
    { crop: 'Rice', price: 4500, change: '+1.2%', color: 'from-blue-400 to-cyan-500' },
    { crop: 'Corn', price: 1800, change: '-0.8%', color: 'from-yellow-400 to-amber-500' },
    { crop: 'Mustard', price: 5500, change: '+3.1%', color: 'from-red-400 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">AI Features</h1>
        <p className="text-accent-muted">Advanced tools powered by Artificial Intelligence</p>
      </div>

      {/* AI Crop Disease Detection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-emerald-500" size={28} />
          <h2 className="text-2xl font-bold text-primary">AI Crop Disease Detection</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-primary mb-4">Upload Leaf Image</label>
            <div className="border-2 border-dashed border-surface-alt rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
              {selectedFile ? (
                <div className="space-y-3">
                  <p className="text-sm text-accent-muted">📄 {selectedFile.name}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Change Image
                  </motion.button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-accent-muted mb-3" size={32} />
                  <p className="text-primary font-medium mb-1">Upload leaf image</p>
                  <p className="text-accent-muted text-sm mb-4">for AI analysis</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="disease-image"
                  />
                  <label
                    htmlFor="disease-image"
                    className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors text-sm font-medium"
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold text-primary mb-4">Analysis Result</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-accent-muted mb-1">Detected Disease</p>
                  <p className="text-lg font-bold text-primary">{analysisResult.disease}</p>
                  <p className="text-sm text-emerald-600 mt-1">Confidence: {analysisResult.confidence}%</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-accent-muted mb-1">Severity Level</p>
                  <p className="text-lg font-bold text-amber-600">{analysisResult.severity}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-accent-muted mb-2">Treatment Suggestions</p>
                  <ul className="space-y-2">
                    {analysisResult.treatment.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-primary">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Weather Forecast Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="text-blue-500" size={28} />
          <h2 className="text-2xl font-bold text-primary">Weather Forecast</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {weatherData.forecastDays.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 text-center"
            >
              <p className="text-sm font-medium text-primary mb-2">{day}</p>
              <p className="text-2xl font-bold text-blue-600 mb-1">{weatherData.forecastTemps[idx]}°C</p>
              <p className="text-xs text-accent-muted">Partly Cloudy</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🌡️', label: 'Temperature', value: `${weatherData.temp}°C` },
            { icon: '💧', label: 'Humidity', value: `${weatherData.humidity}%` },
            { icon: '🌧️', label: 'Rainfall', value: `${weatherData.rainfall}mm` },
            { icon: '💨', label: 'Wind Speed', value: `${weatherData.windSpeed} km/h` },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-surface-alt rounded-lg p-4 text-center"
            >
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-xs text-accent-muted mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Price Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6 lg:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-emerald-500" size={28} />
          <h2 className="text-2xl font-bold text-primary">Market Price Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketPrices.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className={`bg-gradient-to-br ${item.color} rounded-lg p-6 text-white`}
            >
              <p className="text-sm text-white/90 mb-2">{item.crop}</p>
              <p className="text-3xl font-bold mb-1">₹{item.price}</p>
              <p className={`text-sm font-medium ${item.change.includes('+') ? 'text-green-200' : 'text-red-200'}`}>
                {item.change} from last week
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Market prices are updated daily. Wheat is trending up by 2.5% - a good time to list your wheat!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
