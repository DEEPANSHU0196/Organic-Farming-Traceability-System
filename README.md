# Organic Farming Traceability System

React/Vite frontend and Node.js/Express/Mongoose backend, with an optional Polygon Amoy traceability registry. MongoDB remains the application's source for product and shipment records. The smart contract stores product metadata hashes and append-only event hashes; it does not store personal data.

## Requirements

- Node.js 20 or newer and npm
- A reachable MongoDB instance for backend runtime
- Cloudinary credentials only if using image uploads
- Polygon Amoy RPC access and test POL only when deliberately deploying or submitting on-chain writes

## Install and run locally

Install each package's dependencies:

```sh
npm install
cd backend && npm install
cd ../blockchain && npm install
```

Configure `backend/.env` as described below. Start the backend and frontend in separate terminals:

```sh
cd backend
npm run dev
```

```sh
npm run dev
```

The frontend defaults to `http://localhost:5173`; the API defaults to `http://localhost:5000/api`. Public product QR links continue to use `/trace/:id`.

## Environment variables

Create local `.env` files; do not commit them, paste secrets into frontend variables, or share their contents. The repository ignores local environment files.

Frontend, in the repository root:

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Backend, in `backend/.env`:

| Variable | Purpose | Required |
| --- | --- | --- |
| `MONGO_URI` | MongoDB connection string | Yes for backend runtime |
| `JWT_SECRET` | Authentication token signing and verification secret | Yes for authenticated API use |
| `PORT` | Express listening port | No; defaults to `5000` |
| `FRONTEND_URL` | Allowed frontend origin(s), comma-separated; also used to build QR URLs | No; local origins are provided |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Only for image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Only for image uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Only for image uploads |
| `ADMIN_NAME` | Name for the initial admin account | Optional; all three `ADMIN_*` values are required together |
| `ADMIN_EMAIL` | Email for the initial admin account | Optional; all three `ADMIN_*` values are required together |
| `ADMIN_PASSWORD` | Unique initial admin password (minimum 12 characters) | Optional; used only when no account with that email exists |
| `POLYGON_RPC_URL` | Polygon Amoy RPC URL for read verification and writes | Required for chain access |
| `POLYGON_TRACE_CONTRACT_ADDRESS` | Deployed `TraceabilityRegistry` address | Required for chain access |
| `POLYGON_PRIVATE_KEY` | Backend-only authorized writer key | Required for on-chain writes; not required for read-only verification |
| `POLYGON_TRACE_DEPLOYMENT_BLOCK` | Registry deployment block used to bound event-log searches | Recommended; optional, defaults to `0` |

Never use a `VITE_` variable for a private key, API secret, or other credential. Frontend variables are included in the browser bundle.

On backend startup, the initial admin is created only when all three `ADMIN_*` values are configured and the email is unused. The password is hashed; existing accounts and passwords are never changed, and an existing non-admin account is not promoted. Remove the bootstrap values after creating the account.

Hardhat deployment, in `blockchain/.env`:

| Variable | Purpose | Required |
| --- | --- | --- |
| `POLYGON_RPC_URL` | Explicit Amoy RPC endpoint | Required when deploying |
| `POLYGON_PRIVATE_KEY` | Owner/deployer wallet key used by the local Hardhat command | Required when deploying |

Both Hardhat configurations use the same `blockchain/contracts/TraceabilityRegistry.sol` source and artifact directory. Polygon Amoy is fixed to chain ID `80002`; no public RPC endpoint is selected implicitly, and both deployment scripts refuse other chains. The backend independently checks that its RPC is on chain `80002`.

## Local tests and build

Run package checks from their respective directories. These commands are local and do not deploy or require a Polygon transaction:

```sh
# Repository root: frontend utility tests and production build
node --test src/utils/traceLink.test.js src/utils/onChainVerification.test.js src/utils/farmAdvice.test.js
npm run build

# Backend
cd backend
npm test

# Solidity registry on Hardhat's in-process network
cd ../blockchain
npm test
npm run compile
```

Validation in this workspace: 11 frontend utility tests, 30 backend tests, 12 Hardhat contract tests, and the Vite production build passed. On Windows, use the explicit frontend test paths above because the existing root `npm test` wildcard is not expanded by Node. Hardhat uses its in-process network; backend chain integration tests use mocked contract/RPC clients. These results do not constitute live Amoy verification.

## Polygon Amoy deployment (manual)

No deployment has been performed. Do not run the deployment command until you explicitly approve it. Deployment and signer authorization consume test POL and are irreversible on-chain.

1. Create `blockchain/.env` locally with an Amoy RPC URL and the deployer/owner wallet private key. Fund that wallet with Amoy test POL for gas. Never put the key in the frontend or commit the `.env` file.
2. From `blockchain/`, run `npm install`, `npm test`, and `npm run compile`. Confirm the tests pass before deployment.
3. Only after approval, run `npm run deploy:amoy` from `blockchain/`. The script checks chain ID `80002` and prints the deployed address. Confirm the deployment transaction and block on [Amoy Polygonscan](https://amoy.polygonscan.com/).
4. Set `POLYGON_TRACE_CONTRACT_ADDRESS`, `POLYGON_RPC_URL`, `POLYGON_PRIVATE_KEY`, and `POLYGON_TRACE_DEPLOYMENT_BLOCK` in `backend/.env`. The backend private key must correspond to the writer address authorized below.

### Authorize the backend writer

The deployer is the registry owner and initial authorized writer. If the backend uses a different wallet, the owner must authorize its public address. From `blockchain/`, with the owner key in `blockchain/.env`, open the Amoy Hardhat console:

```sh
npx hardhat console --network polygonAmoy
```

In the console, substitute the deployed contract address and backend writer's public address:

```js
const registry = await ethers.getContractAt("TraceabilityRegistry", "<DEPLOYED_CONTRACT_ADDRESS>");
const authorizationTx = await registry.setAuthorizedWriter("<BACKEND_SIGNER_ADDRESS>", true);
await authorizationTx.wait();
await registry.authorizedWriters("<BACKEND_SIGNER_ADDRESS>");
```

The final call must return `true`. If the backend signer is the owner address, it is already authorized at deployment; verify the mapping. Do not place the backend private key in `blockchain/.env` just to authorize it.

## Verify transactions

Start the backend with Amoy RPC, contract address, and authorized writer key configured. Product registration and shipment events are persisted to MongoDB before on-chain submission. The backend retries failed work and checks contract event IDs before resubmitting. Public trace verification requires only the backend RPC URL and contract address, not the signing key.

Open an existing QR URL or `http://localhost:5173/trace/<PRODUCT_ID>`. The page reports product registration and event states. It shows event hashes only after matching the canonical event data against contract state. Transaction links and block numbers come from matching Amoy contract logs; open them on Amoy Polygonscan to inspect transaction receipts. `pending`, `failed`, `unregistered`, and `unavailable` are not presented as confirmed.

For direct contract reads in the Hardhat console:

```js
await registry.isProductRegistered("<PRODUCT_ID>");
await registry.getProduct("<PRODUCT_ID>");
await registry.getTraceEventById("<MONGO_TRACE_BLOCK_ID>");
```

The event ID is the Mongo trace block `_id`. A local Mongo hash alone is not on-chain proof.