# Short Report — Voting dApp

Summary:

This project implements a decentralized voting application using Solidity, Hardhat, React, and Ethers.js. The goal was to create a secure on-chain voting system where the contract owner can create polls, users can vote once, and results are stored immutably on the blockchain. The application includes a full smart contract, unit tests, and a responsive frontend integrated with MetaMask.

- Implemented a secure `Voting.sol` contract (uses OpenZeppelin `Ownable`, `Pausable`, `ReentrancyGuard`).
- Added frontend (React + Vite) with Tailwind CSS styles and Ethers.js integration.
- Included Hardhat tests (create poll, vote, view results) in `test/voting-test.js`.

Time spent (estimate):
- Smart contract & tests: 2 - 3 hours
- Frontend UI + integration: 1.5 - 2.5 hours
- README, docs, and small fixes: 0.5 hours

Challenges Faced
a) Dependency & Version Conflicts

There were several compatibility issues (ethers v5 vs v6, Hardhat toolbox, OpenZeppelin imports). Resolving these required aligning versions, adjusting import paths, and converting deployment methods (waitForDeployment() → deployed()).

b) Contract Import Errors

Hardhat initially failed to compile due to incorrect OpenZeppelin paths. Updating to the correct paths for OZ 4.9.6 (security/ instead of utils/) fixed the problem.

c) Frontend Rendering & ABI Sync

Ensuring the frontend fetched the correct contract state and displayed results required properly syncing ABI, contract address, and network configuration.

#Key Learnings

Importance of version compatibility between Hardhat, Ethers, OpenZeppelin, and Solidity compiler.

Best practices for structuring smart contracts using Ownable, Pausable, and ReentrancyGuard.

How to build a full-stack dApp with a clean React frontend and blockchain backend.

Understanding error debugging in both contracts and frontend integration.

Proper Git workflow for clean repository management.

Suggested improvements:
- Add event listeners in frontend to react to `Voted` and `PollCreated` events for live updates.
- Add better owner UI (show owner address, restrict create/end buttons) and display transaction statuses.
- Add multi-poll support (store multiple polls) and timestamps for lifecycle control.
- Implement admin dashboard for poll analytics.
- Store poll metadata (questions/options) on IPFS/Filecoin for decentralization.
- Add animations & loading states for a more polished frontend experience.

#Conclusion

This project demonstrates practical end-to-end Web3 development: writing secure smart contracts, testing them thoroughly, and integrating them with a modern frontend interface. The final dApp is functional, secure, and aligned with real-world blockchain development practices.



