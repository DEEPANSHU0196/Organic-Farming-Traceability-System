# Blockchain Traceability Registry

This is an isolated Solidity/Hardhat package alongside the existing React, Express, and MongoDB application. It does not replace the application's MongoDB trace records or Node.js integration.

## Contract

`TraceabilityRegistry` supports atomic batch product registration, owner-managed writer authorization, and append-only trace events. Event IDs are unique across all products. Product metadata and event data are represented by `bytes32` hashes; the contract does not store private or personally identifying data. Product IDs and event IDs are strings so application identifiers can be used directly.

Reads (`isProductRegistered`, `getProduct`, `getTraceCount`, `getTraceEvent`, and `getTraceEventById`) are public. The deployer is the initial owner and authorized writer. Only the owner can grant or revoke writers; only authorized writers can register products or append events. Existing products and trace events cannot be edited or removed.

## Local verification

From this directory, install the package dependencies and run:

```powershell
npm install
npm test
```

Tests use Hardhat's in-process local network; they do not need an RPC URL, wallet key, MongoDB connection, or network deployment.

## Polygon Amoy

Hardhat's `polygonAmoy` network is configured for chain ID `80002`. Set `POLYGON_RPC_URL` (optional, with the public Amoy endpoint as default) and `POLYGON_PRIVATE_KEY` in this directory's `.env` before a deliberate deployment. Do not commit secrets. The deploy script refuses any chain ID other than `80002`.

Deployment has **not** been run. After local verification, the intended command is `npm run deploy:amoy`.

## Local test results

Executed `npm install` and `npm test` from this directory. Hardhat compiled the contract for its local in-process network, and all 6 tests passed. No Polygon RPC or deployment was used.

## Backend integration

The Express backend stores each trace submission in `backend/models/TraceBlock.js` before attempting an on-chain write. Its `pending`, `confirmed`, and `failed` status, canonical event hash, stable batch ID, transaction hash, and block number are persisted with that trace record. Retries use the Mongo trace record ID as the contract event ID, reconcile an already-recorded event before resending, and apply exponential backoff to failures. The retry worker starts after MongoDB connects when Polygon settings are present.

Product creation registers the product with a hash of its canonical metadata and keeps the existing QR URL unchanged. Shipment creation, transporter acceptance, driver assignment, and authorized shipment status updates append trace events after the corresponding Mongo writes. Stable flow idempotency keys reuse an existing trace row on repeated requests; driver contact details are not placed in the chain payload.

Compile this package before starting the backend so its ABI is available at `blockchain/artifacts/`. Configure `POLYGON_RPC_URL`, `POLYGON_PRIVATE_KEY`, and `POLYGON_TRACE_CONTRACT_ADDRESS` in `backend/.env`; optionally set `POLYGON_TRACE_DEPLOYMENT_BLOCK` to bound event-log reconciliation. The backend verifies chain ID `80002`. The contract owner must authorize the backend signer with `setAuthorizedWriter` after deployment. Keep the private key exclusively in the backend environment; it is never read by frontend code.

Run backend tests from `backend/` with `npm test`.