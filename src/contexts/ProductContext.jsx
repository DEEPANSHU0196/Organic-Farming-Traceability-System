import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

// Default sample products
const defaultProducts = [
  {
    id: '1',
    name: 'Premium Wheat',
    category: 'Wheat',
    quantity: 500,
    unit: 'kg',
    price: 2500,
    description: 'High quality wheat from our farm',
    certification: 'Organic',
    orders: 12,
    listed: '15 days ago',
    image: '🌾',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Basmati Rice',
    category: 'Rice',
    quantity: 300,
    unit: 'kg',
    price: 4500,
    description: 'Premium basmati rice',
    certification: 'ISO 9001',
    orders: 8,
    listed: '8 days ago',
    image: '🍚',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Yellow Mustard',
    category: 'Mustard',
    quantity: 150,
    unit: 'kg',
    price: 5500,
    description: 'Pure mustard seeds for oil extraction',
    certification: 'Organic',
    orders: 15,
    listed: '22 days ago',
    image: '🌱',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Organic Corn',
    category: 'Corn',
    quantity: 0,
    unit: 'kg',
    price: 1800,
    description: 'Fresh organic corn without pesticides',
    certification: 'NPOP',
    orders: 5,
    listed: '45 days ago',
    image: '🌽',
    createdAt: new Date().toISOString(),
  },
];

// Default sample orders
const defaultOrders = [
  {
    id: 'ORD-001',
    customerName: 'Amit Kumar',
    productName: 'Premium Wheat',
    quantity: 50,
    unit: 'kg',
    price: 1250,
    status: 'Pending',
    date: new Date().toISOString(),
  },
  {
    id: 'ORD-002',
    customerName: 'Priya Singh',
    productName: 'Basmati Rice',
    quantity: 25,
    unit: 'kg',
    price: 1625,
    status: 'Completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [farmer, setFarmer] = useState({
    name: 'Rajesh Deswal',
    email: 'rajesh.deswal@agritrust.com',
    phone: '+91 98765 43210',
    farmName: 'Deswal Agriculture Farm',
    farmLocation: 'Hisar, Haryana',
  });

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    const savedFarmer = localStorage.getItem('farmer');

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error parsing products from localStorage:', error);
      }
    } else {
      // Initialize with sample products
      setProducts(defaultProducts);
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
      }
    } else {
      setOrders(defaultOrders);
    }

    if (savedFarmer) {
      try {
        setFarmer(JSON.parse(savedFarmer));
      } catch (error) {
        console.error('Error parsing farmer from localStorage:', error);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Save farmer info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('farmer', JSON.stringify(farmer));
  }, [farmer]);

  // Add product
  const addProduct = (product) => {
    const newProduct = {
      id: Date.now().toString(),
      ...product,
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  // Update product
  const updateProduct = (id, updatedData) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  // Delete product
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Add order
  const addOrder = (order) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...order,
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  // Update order
  const updateOrder = (id, updatedData) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, ...updatedData } : o)));
  };

  // Update farmer info
  const updateFarmer = (farmerData) => {
    setFarmer(farmerData);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        farmer,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        updateFarmer,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
