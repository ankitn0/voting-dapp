# Decentralized Voting dApp

A full-stack Web3 voting application built using Solidity, Hardhat, React, Ethers.js, and OpenZeppelin.
This dApp allows an admin (contract owner) to create polls, users to vote exactly once, and anyone to view the results on-chain.

The project demonstrates real-world blockchain development with:

Smart contract development (Solidity)
Security best practices (Ownable, Pausable, ReentrancyGuard)
Unit testing (Hardhat + Chai)
Frontend integration (React + Tailwind + Ethers.js)
MetaMask wallet connection
Deployment to a testnet (e.g., Polygon Mumbai or Sepolia)

# Features

Owner can create a poll with a question & up to 5 options
Users can vote only once per poll
Owner can end the poll
Results stored on-chain
Secure patterns using:
  Ownable
  Pausable
  ReentrancyGuard

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

<img width="1912" height="862" alt="WalletConnect" src="https://github.com/user-attachments/assets/dcbc97b9-e6dd-4f52-b8e2-88e53243bc73" />

<img width="1911" height="868" alt="PollCreation " src="https://github.com/user-attachments/assets/63d39712-60bc-4858-96b8-e04234357a22" />

<img width="1904" height="864" alt="Voting" src="https://github.com/user-attachments/assets/958dd38d-0734-4139-8db1-3a8946c1cb4a" />

<img width="1912" height="860" alt="VotingWithDiffrentWallets" src="https://github.com/user-attachments/assets/120a3f1a-45c2-4088-a144-2550c3f33773" />

<img width="1903" height="863" alt="AfterVoting" src="https://github.com/user-attachments/assets/cb493068-fdaf-4cfc-be0a-1d4eab6aa1c7" />

<img width="1890" height="848" alt="AlreadyVotedWarning" src="https://github.com/user-attachments/assets/197b2bd7-1080-489b-bd34-1772d639df85" />

<img width="1916" height="852" alt="AfterEndingPoll" src="https://github.com/user-attachments/assets/88767240-45d3-4415-ac2f-1173c3d0f2aa" />

<img width="1892" height="862" alt="Upto5option" src="https://github.com/user-attachments/assets/15eddfbf-64ad-489b-9e66-096ac5f6ab5f" />

#Hardhat Tests

<img width="1892" height="1012" alt="test" src="https://github.com/user-attachments/assets/1ef01f6a-b31e-46a7-a4f0-d6611251b93c" />

<img width="1355" height="393" alt="test1" src="https://github.com/user-attachments/assets/5411949c-7b06-4a3f-84fa-f5d41477c583" />



