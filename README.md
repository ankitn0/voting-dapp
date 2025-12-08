# Voting dApp

This repository contains a simple decentralized voting dApp: a Solidity smart contract, Hardhat tests, and a React + Tailwind frontend using Ethers.js.

Quick structure:
- `contracts/` - `Voting.sol` (owner creates a poll, people vote once, owner ends poll)
- `test/` - Hardhat tests for createPoll, vote, and results
- `frontend/` - React + Vite frontend

Local development
1. Install dependencies (project root):

```powershell
npm install
cd frontend
npm install
```

2. Run tests:

```powershell
npm test
```

3. Run frontend (after installing frontend deps):

```powershell
cd frontend
npm run dev
```

Connecting to a deployed contract
- The frontend reads `REACT_APP_CONTRACT_ADDRESS` from environment. Create a `.env` in `frontend/`:

```
REACT_APP_CONTRACT_ADDRESS=0xYourDeployedAddressHere
```

Then restart the dev server. The placeholder address will prevent interactions until you deploy the contract and set the address.

Deployment
- Use Hardhat or Remix to deploy `contracts/Voting.sol` to a testnet (e.g., Polygon Mumbai). Update `frontend/.env` with the deployed address.

Notes
- The smart contract uses OpenZeppelin `Ownable`, `Pausable`, and `ReentrancyGuard`.
- Tests are in `test/voting-test.js`.
# Voting dApp

This repository contains a simple decentralized voting dApp with a Solidity smart contract, Hardhat tests, and a React + Tailwind frontend skeleton.

## Structure
- `contracts/` - Solidity contract (`Voting.sol`)
- `test/` - Hardhat tests
- `frontend/` - React + Tailwind frontend skeleton

## Quick-start (developer machine)
1. Install dependencies:

```powershell
npm install
```

2. Run tests:

```powershell
npx hardhat test
```

3. Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Notes
- Add your testnet credentials and RPC URL to `hardhat.config.js` before deploying.
- Contract: `contracts/Voting.sol` uses OpenZeppelin `Ownable`, `Pausable`, and `ReentrancyGuard`.

