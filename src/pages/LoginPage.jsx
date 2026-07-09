import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, LogIn, ArrowLeft, ArrowRight, Leaf, CheckCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ROLES = [
  {
    id: 'farmer',
    label: 'Farmer',
    desc: 'Sell your produce directly to buyers',
    emoji: '🌾',
    accent: '#22c55e',
    accentLight: '#dcfce7',
    accentBorder: '#86efac',
    gradient: 'from-emerald-400 to-green-600',
    path: '/farmer-dashboard/overview',
    features: ['List your products', 'Track orders', 'Manage payments'],
  },
  {
    id: 'buyer',
    label: 'Buyer',
    desc: 'Source fresh produce from verified farmers',
    emoji: '🛒',
    accent: '#0ea5e9',
    accentLight: '#e0f2fe',
    accentBorder: '#7dd3fc',
    gradient: 'from-sky-400 to-blue-600',
    path: '/buyer-dashboard/overview',
    features: ['Browse products', 'Track deliveries', 'Secure payments'],
  },
  {
    id: 'transporter',
    label: 'Transporter',
    desc: 'Manage deliveries and logistics routes',
    emoji: '🚚',
    accent: '#f97316',
    accentLight: '#ffedd5',
    accentBorder: '#fdba74',
    gradient: 'from-orange-400 to-amber-600',
    path: '/transporter-dashboard/overview',
    features: ['View assignments', 'Route planning', 'Confirm deliveries'],
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Oversee platform operations and users',
    emoji: '🛡️',
    accent: '#8b5cf6',
    accentLight: '#ede9fe',
    accentBorder: '#c4b5fd',
    gradient: 'from-violet-500 to-purple-700',
    path: '/admin-dashboard/overview',
    features: ['Manage users', 'Approve products', 'View analytics'],
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const [step, setStep] = useState(1); // 1 = role select, 2 = login form
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('buyer');
  const [registerMessage, setRegisterMessage] = useState('');

  const role = ROLES.find((r) => r.id === selectedRole);
  const canCreateAccount = selectedRole !== 'admin';

  const getRegistrationRole = (portalRole) => {
    switch (portalRole) {
      case 'farmer':
        return 'farmer';
      case 'transporter':
        return 'transporter';
      case 'admin':
        return 'admin';
      default:
        return 'buyer';
    }
  };

  const handleSelectRole = (id) => {
    setSelectedRole(id);
    setEmail('');
    setPassword('');
    setRegisterRole(getRegistrationRole(id));
    setErrors({});
    setStep(2);
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoginError('');
    try {
      const portal = selectedRole || role?.id;
      const response = await login(email, password, portal);
      const resolvedRole = (response?.user?.role === 'consumer' || response?.user?.role === 'buyer')
        ? 'buyer'
        : response?.user?.role || selectedRole;
      const pathMap = {
        farmer: '/farmer-dashboard/overview',
        buyer: '/buyer-dashboard/overview',
        transporter: '/transporter-dashboard/overview',
        admin: '/admin-dashboard/overview',
        consumer: '/buyer-dashboard/overview',
      };

      setLoginSuccess(true);
      setTimeout(() => {
        navigate(pathMap[resolvedRole] || role.path, { replace: true });
      }, 800);
    } catch (error) {
      setLoginSuccess(false);
      setLoginError(error?.response?.data?.message || 'Unable to sign in. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginError('');
    setRegisterMessage('');

    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setRegisterMessage('Please fill in all required fields.');
      return;
    }

    try {
      const portalRole = getRegistrationRole(selectedRole);
      await register({
        fullName: registerName,
        email: registerEmail,
        password: registerPassword,
      }, portalRole);
      setRegisterMessage('Account created successfully. You can sign in now.');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole(portalRole);
      setIsRegistering(false);
    } catch (error) {
      setRegisterMessage(error?.response?.data?.message || 'Unable to create account right now.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f8faf8' }}>
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d1f12 0%, #122a18 60%, #0a1a0c 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }}
          />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-tight">AgroVerse</div>
              <div className="text-emerald-400/80 text-xs font-medium">by AgriTrust Platform</div>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              India's Trusted<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Agri Supply Chain
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Connecting farmers, buyers, and transporters on one transparent, verified platform.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Farmers', value: '12,400+', icon: '🌾' },
                { label: 'Products', value: '48,000+', icon: '🥦' },
                { label: 'Orders', value: '2.1L+', icon: '📦' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-bold text-lg">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2026 AgroVerse. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel — Login Flow */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <Leaf className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-xl text-slate-800">AgroVerse</span>
        </div>

        {/* Back button */}
        <div className="w-full max-w-[480px] mb-6">
          {step === 2 ? (
            <button
              onClick={() => { setStep(1); setSelectedRole(null); setErrors({}); setLoginSuccess(false); }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Change role
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to home
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Role Selection ── */}
          {step === 1 && (
            <motion.div
              key="step-role"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[480px]"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome to AgroVerse</h2>
                <p className="text-slate-500 text-sm">Select your role to continue to your portal</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r, idx) => (
                  <motion.button
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectRole(r.id)}
                    className="relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 bg-white hover:shadow-lg group overflow-hidden"
                    style={{
                      borderColor: r.accentBorder,
                      boxShadow: `0 2px 12px ${r.accent}0a`,
                    }}
                  >
                    {/* Glow bg on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(circle at top left, ${r.accentLight}, transparent 70%)` }}
                    />

                    <span className="text-3xl mb-3 relative z-10">{r.emoji}</span>
                    <div className="font-bold text-slate-800 text-base mb-1 relative z-10">{r.label}</div>
                    <div className="text-slate-500 text-xs leading-relaxed mb-4 relative z-10">{r.desc}</div>

                    <div className="flex items-center gap-1.5 mt-auto relative z-10">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: r.accent }}
                      >
                        Enter portal
                      </span>
                      <ArrowRight size={13} style={{ color: r.accent }} />
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="text-center text-slate-400 text-xs mt-6">
                🔒 Use your registered email and password to continue.
              </p>
            </motion.div>
          )}

          {/* ── STEP 2: Login Form ── */}
          {step === 2 && role && (
            <motion.div
              key="step-login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[480px]"
            >
              {/* Selected role badge */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-2xl shadow-lg`}
                >
                  {role.emoji}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sign in as {role.label}</h2>
                  <p className="text-slate-500 text-sm">{role.desc}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-7">
                {role.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border"
                    style={{
                      color: role.accent,
                      borderColor: role.accentBorder,
                      background: role.accentLight,
                    }}
                  >
                    <CheckCircle size={11} />
                    {f}
                  </span>
                ))}
              </div>

              {/* Form card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                {!canCreateAccount ? (
                  <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700">
                    Admin accounts are managed by the platform and cannot be self-registered.
                  </div>
                ) : !isRegistering ? (
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-emerald-600"
                  >
                    <UserPlus size={16} />
                    Create an account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setIsRegistering(false); setRegisterMessage(''); }}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                  >
                    <ArrowLeft size={16} />
                    Back to sign in
                  </button>
                )}

                {isRegistering ? (
                  <div className="space-y-4">
                    {registerMessage && (
                      <div className={`rounded-xl border px-3 py-2 text-sm ${registerMessage.includes('successfully') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-600'}`}>
                        {registerMessage}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                      <input
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Account Type</label>
                      <div className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-700">
                        {registerRole === 'farmer' ? 'Farmer Portal Account' : registerRole === 'transporter' ? 'Transporter Portal Account' : 'Buyer Portal Account'}
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={handleRegister}
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                    >
                      {loading ? 'Creating account...' : 'Create account'}
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-5">
                {/* Success overlay */}
                <AnimatePresence>
                  {loginSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10"
                    >
                      <div className="text-5xl mb-3">✅</div>
                      <p className="font-bold text-slate-800">Signing you in...</p>
                      <p className="text-slate-500 text-sm mt-1">Redirecting to {role.label}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none bg-slate-50 focus:bg-white ${
                      errors.email ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
                    }`}
                    style={!errors.email ? { '--tw-ring-color': role.accent + '33' } : {}}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none bg-slate-50 focus:bg-white pr-12 ${
                        errors.password ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                </div>

                {loginError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {loginError}
                  </div>
                )}

                    {/* Login button */}
                    <motion.button
                      type="button"
                      onClick={handleLogin}
                      disabled={loading || loginSuccess}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${role.accent}, ${role.accent}cc)`,
                        boxShadow: `0 4px 20px ${role.accent}40`,
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn size={17} />
                          Sign In as {role.label}
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Demo note */}
              <div
                className="mt-4 px-4 py-3 rounded-xl border text-xs text-center"
                style={{ borderColor: role.accentBorder, background: role.accentLight, color: role.accent }}
              >
                <span className="font-semibold">Demo credentials pre-filled.</span> Just click Sign In →
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
