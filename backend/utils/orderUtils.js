const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};

const buildFarmerOrderView = (orderDoc) => {
  const product = orderDoc.product || {};
  const buyer = orderDoc.buyer || {};

  return {
    id: orderDoc._id?.toString?.() || orderDoc.id,
    buyer: buyer.fullName || buyer.name || 'Unknown Buyer',
    buyerEmail: buyer.email || '',
    buyerPhone: buyer.phone || buyer.mobile || '',
    buyerAddress: buyer.address || '',
    product: product.productName || product.name || 'Unknown Product',
    quantity: Number(orderDoc.quantity || 0),
    unit: product.unit || 'kg',
    date: orderDoc.createdAt ? new Date(orderDoc.createdAt).toLocaleDateString('en-IN') : '',
    status: orderDoc.status || 'Pending',
    amount: formatCurrency(Number(product.price || 0) * Number(orderDoc.quantity || 0)),
    deliveryDate: orderDoc.deliveryDate || '',
    location: product.location || buyer.address || '',
    notes: orderDoc.notes || '',
    productId: product._id?.toString?.() || product.id,
    buyerId: buyer._id?.toString?.() || buyer.id,
    raw: orderDoc,
  };
};

module.exports = {
  buildFarmerOrderView,
};
