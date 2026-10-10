const HASH_PATTERN = /^0x[0-9a-f]{64}$/i;

const STATUS_LABELS = {
  confirmed: "Verified on Polygon Amoy",
  pending: "Pending confirmation",
  failed: "Verification failed",
  unregistered: "Not registered on-chain",
  unavailable: "Polygon verification unavailable",
};

export const getVerificationStatusLabel = (status) =>
  STATUS_LABELS[status] || "Not verified";

export const getVerifiedEventHash = (event) => {
  if (event?.status !== "confirmed" || event?.verified !== true) return null;
  return HASH_PATTERN.test(event.eventHash || "") ? event.eventHash : null;
};

export const getVerifiedExplorerUrl = (record) => {
  if (record?.status !== "confirmed" || record?.verified !== true) return null;
  if (!HASH_PATTERN.test(record.transactionHash || "")) return null;
  return `https://amoy.polygonscan.com/tx/${record.transactionHash}`;
};

export const shortenHash = (value) =>
  HASH_PATTERN.test(value || "") ? `${value.slice(0, 10)}...${value.slice(-8)}` : "Unavailable";

export const getChainStatusDescription = (verification = {}) => {
  if (verification.status === "unavailable") {
    return "The Amoy contract could not be reached. No chain verification is being claimed.";
  }
  if (verification.registration?.status === "unregistered") {
    return "This product has no registration record on the configured contract.";
  }
  if (verification.registration?.onChainStatus === "unregistered") {
    return "Registration is queued, but the contract does not yet report this product as registered.";
  }
  if (verification.status === "pending") {
    return "One or more records are waiting for on-chain confirmation.";
  }
  if (verification.status === "failed") {
    return "One or more records did not match the expected on-chain data.";
  }
  if (verification.status === "confirmed") {
    return "Product registration and listed events were matched against the Polygon Amoy contract.";
  }
  return "No on-chain verification result is available.";
};