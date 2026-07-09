const PORTAL_ROLE_MAP = {
  farmer: 'farmer',
  buyer: 'buyer',
  transporter: 'transporter',
  admin: 'admin',
};

const normalizePortal = (portal) => {
  if (!portal) return null;
  return PORTAL_ROLE_MAP[portal] || null;
};

const isPortalAllowedForRole = (portal, role) => {
  const normalizedPortal = normalizePortal(portal);
  const normalizedRole = role === 'consumer' ? 'buyer' : role;

  if (!normalizedPortal || !normalizedRole) {
    return false;
  }

  return normalizedPortal === normalizedRole;
};

module.exports = {
  normalizePortal,
  isPortalAllowedForRole,
};
