const hre = require('hardhat');

async function main() {
  const Voting = await hre.ethers.getContractFactory('Voting');
  const voting = await Voting.deploy();
  await voting.deployed();

  console.log('Voting deployed to:', voting.address);
  console.log('Network:', hre.network.name);

  if (hre.network.name === 'mumbai') {
    console.log(`Polygonscan: https://mumbai.polygonscan.com/address/${voting.address}`);
  } else if (hre.network.name === 'sepolia') {
    console.log(`Etherscan: https://sepolia.etherscan.io/address/${voting.address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
