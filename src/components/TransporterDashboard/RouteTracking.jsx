import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, Fuel, AlertTriangle, ChevronRight } from 'lucide-react';

export default function RouteTracking() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'Route 1: Delhi Circuit',
      start: 'Jaipur (Pickup)',
      end: 'New Delhi (Delivery)',
      stops: [
        { location: 'Jaipur Warehouse', type: 'start', status: 'completed', time: '9:00 AM' },
        { location: 'Gurgaon Toll Booth', type: 'checkpoint', status: 'completed', time: '10:15 AM' },
        { location: 'Sector 18, Noida', type: 'checkpoint', status: 'current', time: '11:30 AM' },
        { location: 'MG Road, Delhi', type: 'end', status: 'pending', time: '1:30 PM (ETA)' },
      ],
      totalDistance: '245 km',
      totalTime: '4h 30m',
      timeSpent: '2h 30m',
      remainingTime: '2h',
      avgSpeed: '98 km/h',
      fuelConsumption: '12.5 L',
      delays: 0,
      issues: [],
    },
    {
      id: 2,
      name: 'Route 2: Bangalore Haul',
      start: 'Hisar (Pickup)',
      end: 'Bangalore (Delivery)',
      stops: [
        { location: 'Hisar', type: 'start', status: 'current', time: '12:00 PM' },
        { location: 'Chandigarh Bypass', type: 'checkpoint', status: 'pending', time: '3:00 PM (ETA)' },
        { location: 'Lucknow Junction', type: 'checkpoint', status: 'pending', time: '9:00 PM (ETA)' },
        { location: 'Bangalore Warehouse', type: 'end', status: 'pending', time: 'Tomorrow 10:00 AM (ETA)' },
      ],
      totalDistance: '1200 km',
      totalTime: '22h',
      timeSpent: '0h',
      remainingTime: '22h',
      avgSpeed: '0 km/h',
      fuelConsumption: '84 L',
      delays: 0,
      issues: [],
    },
    {
      id: 3,
      name: 'Route 3: Local Delivery',
      start: 'Warehouse (Pickup)',
      end: 'Noida Extension (Delivery)',
      stops: [
        { location: 'Warehouse, Noida', type: 'start', status: 'completed', time: '10:00 AM' },
        { location: 'Sector 62, Noida', type: 'checkpoint', status: 'completed', time: '10:45 AM' },
        { location: 'Sector 63, Noida', type: 'current', status: 'current', time: '11:20 AM' },
        { location: 'Noida Extension', type: 'end', status: 'pending', time: '12:15 PM (ETA)' },
      ],
      totalDistance: '35 km',
      totalTime: '2h 15m',
      timeSpent: '1h 20m',
      remainingTime: '55m',
      avgSpeed: '26.25 km/h',
      fuelConsumption: '2.8 L',
      delays: 1,
      issues: ['Traffic at Sector 62'],
    },
  ]);

  const [expandedRoute, setExpandedRoute] = useState(null);

  const getStopStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-500';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (route) => {
    const stops = route.stops;
    const completedStops = stops.filter(s => s.status === 'completed').length;
    return Math.round((completedStops / stops.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Route Tracking</h1>
        <p className="text-gray-600">Monitor your delivery routes and progress in real-time</p>
      </motion.div>

      {/* Routes List */}
      <div className="space-y-4">
        {routes.map((route, index) => {
          const isExpanded = expandedRoute === route.id;
          const progress = getProgressPercentage(route);

          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Route Header */}
              <motion.button
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h2>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={16} className="text-green-600" />
                        <span>{route.start}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={16} className="text-red-600" />
                        <span>{route.end}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 font-medium">Progress</span>
                        <span className="text-sm font-semibold text-gray-800">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 font-semibold">Distance</p>
                        <p className="text-sm font-bold text-gray-800">{route.totalDistance}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 font-semibold">Remaining</p>
                        <p className="text-sm font-bold text-gray-800">{route.remainingTime}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 font-semibold">Avg Speed</p>
                        <p className="text-sm font-bold text-gray-800">{route.avgSpeed}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 font-semibold">Fuel Used</p>
                        <p className="text-sm font-bold text-gray-800">{route.fuelConsumption}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <ChevronRight size={24} className="text-gray-600" />
                  </motion.div>
                </div>

                {/* Issues Alert */}
                {route.issues.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-start gap-3"
                  >
                    <AlertTriangle size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">Issues Detected</p>
                      <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                        {route.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.button>

              {/* Expanded Details */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isExpanded ? 'auto' : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
                  {/* Stops Timeline */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Route Timeline</h3>
                    <div className="space-y-4">
                      {route.stops.map((stop, idx) => (
                        <div key={idx} className="flex gap-4">
                          {/* Timeline Marker */}
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.4, delay: idx * 0.1 }}
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStopStatusColor(
                                stop.status
                              )}`}
                            >
                              {idx + 1}
                            </motion.div>
                            {idx < route.stops.length - 1 && (
                              <div className="w-1 h-12 bg-gray-300 my-2"></div>
                            )}
                          </div>

                          {/* Stop Details */}
                          <div className="flex-1 pt-1">
                            <p className="font-semibold text-gray-800">{stop.location}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="bg-gray-200 px-2 py-1 rounded text-xs font-semibold">
                                {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {stop.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Route Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-300">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Total Distance</p>
                      <p className="text-lg font-bold text-gray-800">{route.totalDistance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Total Time</p>
                      <p className="text-lg font-bold text-gray-800">{route.totalTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-1">Time Spent</p>
                      <p className="text-lg font-bold text-gray-800">{route.timeSpent}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
