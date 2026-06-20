import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PlatformAnalytics = () => {
  // User Growth Chart Data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Farmers',
        data: [400, 520, 680, 850, 1200, 1650, 2100, 2847],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Buyers',
        data: [300, 450, 680, 950, 1600, 2300, 3800, 5234],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Monthly Revenue Chart Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Revenue ($K)',
        data: [65, 95, 140, 210, 380, 620, 950, 1240],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: '#059669',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: '#047857',
        hoverBorderColor: '#047857',
      },
    ],
  };

  // Order Activity Chart Data
  const orderActivityData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Orders Placed',
        data: [245, 380, 420, 550, 720, 680, 890, 1020],
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#F97316',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Orders Completed',
        data: [200, 320, 380, 490, 640, 620, 810, 920],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Product Listings Trend Data
  const productTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'New Listings',
        data: [400, 620, 890, 1200, 1800, 2400, 3100, 4200],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: '#A855F7',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: '#9333EA',
        hoverBorderColor: '#9333EA',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
          },
        },
        grid: {
          color: '#E2E8F0',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Platform Analytics</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-slate-900 mb-4">User Growth</h3>
          <div className="h-80">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Order Activity Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-slate-900 mb-4">Order Activity</h3>
          <div className="h-80">
            <Line data={orderActivityData} options={chartOptions} />
          </div>
        </div>

        {/* Product Listings Trend */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-slate-900 mb-4">Product Listings Trend</h3>
          <div className="h-80">
            <Bar data={productTrendData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
