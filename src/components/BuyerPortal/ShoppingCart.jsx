import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingCart as CartIcon, ArrowRight } from 'lucide-react';
import { useBuyer } from '../../contexts/BuyerContext';

export default function ShoppingCart({ onCheckout }) {
  const { cart, removeFromCart, updateCartQuantity } = useBuyer();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Shopping Cart</h1>
          <p className="text-accent-muted">Your cart is currently empty</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <CartIcon size={64} className="text-gray-300 mb-4" />
          <p className="text-accent-muted text-lg">No products in cart</p>
          <p className="text-accent-muted text-sm">Browse products to add them to cart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Shopping Cart</h1>
        <p className="text-accent-muted">{totalItems} items in cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-lg shadow-md border border-surface-alt p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="h-24 w-24 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                {item.image}
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-primary">{item.name}</h3>
                  <p className="text-xs text-accent-muted">
                    {item.farmerName} • {item.farmLocation}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-600">₹{item.price} per {item.unit}</p>
              </div>

              {/* Quantity & Actions */}
              <div className="flex flex-col items-end justify-between">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 size={18} />
                </motion.button>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-1 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-primary">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="font-bold text-primary">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg shadow-md border-2 border-emerald-200 p-6 space-y-4 sticky top-6">
            <h3 className="text-xl font-bold text-primary">Order Summary</h3>

            <div className="space-y-3 border-b border-emerald-200 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-accent-muted">Subtotal</span>
                <span className="font-semibold text-primary">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent-muted">Delivery</span>
                <span className="font-semibold text-primary">₹50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent-muted">Tax</span>
                <span className="font-semibold text-primary">₹{Math.round(totalPrice * 0.05).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg">
              <span className="font-bold text-primary">Total</span>
              <span className="font-bold text-emerald-600">
                ₹{(totalPrice + 50 + Math.round(totalPrice * 0.05)).toLocaleString()}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCheckout}
              className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </motion.button>

            <p className="text-xs text-center text-accent-muted">
              Estimated delivery in 5-7 business days
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
