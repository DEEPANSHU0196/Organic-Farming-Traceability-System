import { useEffect, useState } from 'react';
import { getMyShipments } from '../../api/shipment';

export default function FarmerShipmentTracking() {
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await getMyShipments();
        if (active) setShipments(response?.data?.shipments || []);
      } catch (err) {
        if (active) setError(err?.response?.data?.message || 'Unable to load shipment tracking.');
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Shipment Tracking</h1>
        <p className="text-accent-muted">Live shipment status for orders on your products</p>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      {shipments.length === 0 && !error && <div className="rounded-lg border border-surface-alt bg-white p-8 text-center text-accent-muted">No shipments are available yet.</div>}
      <div className="grid gap-4">
        {shipments.map((shipment) => (
          <div key={shipment._id} className="rounded-lg border border-surface-alt bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-accent-muted">{shipment.trackingId || shipment._id}</p>
                <h2 className="text-lg font-semibold text-primary">{shipment.order?.product?.name || shipment.order?.product?.productName || 'Organic produce'}</h2>
                <p className="text-sm text-accent-muted">Buyer: {shipment.order?.buyer?.fullName || 'Buyer'}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{shipment.status}</span>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-accent-muted md:grid-cols-3">
              <span>Location: {shipment.currentLocation || 'Farm'}</span>
              <span>Driver: {shipment.driverName || 'Awaiting assignment'}</span>
              <span>Vehicle: {shipment.vehicleNumber || 'Not assigned'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
