# Short Report — Voting dApp

Summary:
- Implemented a secure `Voting.sol` contract (uses OpenZeppelin `Ownable`, `Pausable`, `ReentrancyGuard`).
- Added frontend (React + Vite) with Tailwind CSS styles and Ethers.js integration.
- Included Hardhat tests (create poll, vote, view results) in `test/voting-test.js`.

Time spent (estimate):
- Smart contract & tests: 1.5 - 2.5 hours
- Frontend UI + integration: 1.5 - 2.5 hours
- README, docs, and small fixes: 0.5 hours

Challenges & notes:
- The frontend uses a placeholder contract address; deploy to a testnet and set `REACT_APP_CONTRACT_ADDRESS` in `frontend/.env` to fully test.
- The `getResults` function returns arrays and a boolean; the frontend maps BigNumber vote counts to numbers.

Suggested improvements:
- Add event listeners in frontend to react to `Voted` and `PollCreated` events for live updates.
- Add better owner UI (show owner address, restrict create/end buttons) and display transaction statuses.
- Add multi-poll support (store multiple polls) and timestamps for lifecycle control.
