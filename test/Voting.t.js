const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  async function deployFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed(); // ✅ ethers v5 style

    return { voting, owner, voter1, voter2 };
  }

  it("should allow owner to create a poll", async () => {
    const { voting, owner } = await deployFixture();

    const question = "Favorite color?";
    const options = ["Red", "Blue", "Green"];

    await expect(voting.connect(owner).createPoll(question, options))
      .to.emit(voting, "PollCreated");

    const [pollId, q, opts, votes, isActive] = await voting.getActivePoll();

    expect(pollId).to.equal(1);                // BigNumber vs number handled by chai
    expect(q).to.equal(question);
    expect(opts.length).to.equal(3);
    expect(isActive).to.equal(true);
    expect(votes[0]).to.equal(0);
  });

  it("should allow a user to vote only once", async () => {
    const { voting, owner, voter1 } = await deployFixture();

    await voting.connect(owner).createPoll("Best language?", ["Solidity", "Rust"]);

    await expect(voting.connect(voter1).vote(0))
      .to.emit(voting, "Voted")
      .withArgs(1, voter1.address, 0);

    const [, , , votes] = await voting.getActivePoll();
    expect(votes[0]).to.equal(1);

    await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Already voted");
  });

  it("should correctly store results after ending poll", async () => {
    const { voting, owner, voter1, voter2 } = await deployFixture();

    await voting.connect(owner).createPoll("Choose network", ["Ethereum", "Polygon"]);

    await voting.connect(voter1).vote(0);
    await voting.connect(voter2).vote(1);

    await expect(voting.connect(owner).endPoll())
      .to.emit(voting, "PollEnded")
      .withArgs(1);

    const [q, opts, votes, isActive] = await voting.getPoll(1);

    expect(q).to.equal("Choose network");
    expect(isActive).to.equal(false);
    expect(opts.length).to.equal(2);
    expect(votes[0]).to.equal(1);
    expect(votes[1]).to.equal(1);
  });
});
