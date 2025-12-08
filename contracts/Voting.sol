// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Voting is Ownable, Pausable, ReentrancyGuard {
    struct Poll {
        string question;
        string[] options;
        uint256[] votes;
        bool isActive;
    }

    // pollId => Poll
    mapping(uint256 => Poll) private polls;
    // pollId => voter => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public pollCount;
    uint256 public currentPollId;

    event PollCreated(uint256 indexed pollId, string question, string[] options);
    event Voted(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    event PollEnded(uint256 indexed pollId);

    // OpenZeppelin Ownable v5 requires passing initial owner
    constructor() {} //it already sets the owner to msg.sender internally in OpenZeppelin Ownable v4.9.6

    /// @notice Create a new poll with a question and 2–5 options (owner only)
    function createPoll(
        string calldata _question,
        string[] calldata _options
    ) external onlyOwner whenNotPaused {
        require(bytes(_question).length > 0, "Question required");
        require(_options.length >= 2 && _options.length <= 5, "2-5 options allowed");

        // Ensure only one active poll at a time
        if (pollCount > 0) {
            require(!polls[currentPollId].isActive, "Active poll exists");
        }

        pollCount += 1;
        currentPollId = pollCount;

        Poll storage p = polls[currentPollId];
        p.question = _question;
        p.isActive = true;

        for (uint256 i = 0; i < _options.length; i++) {
            p.options.push(_options[i]);
            p.votes.push(0);
        }

        emit PollCreated(currentPollId, _question, _options);
    }

    /// @notice Vote for an option in the active poll
    /// @param _optionIndex Index of the chosen option
    function vote(uint256 _optionIndex)
        external
        nonReentrant
        whenNotPaused
    {
        require(currentPollId != 0, "No poll");
        Poll storage p = polls[currentPollId];
        require(p.isActive, "Poll not active");
        require(_optionIndex < p.options.length, "Invalid option");
        require(!hasVoted[currentPollId][msg.sender], "Already voted");

        hasVoted[currentPollId][msg.sender] = true;
        p.votes[_optionIndex] += 1;

        emit Voted(currentPollId, msg.sender, _optionIndex);
    }

    /// @notice End the active poll (owner only)
    function endPoll() external onlyOwner whenNotPaused {
        require(currentPollId != 0, "No poll");
        Poll storage p = polls[currentPollId];
        require(p.isActive, "Poll already ended");

        p.isActive = false;
        emit PollEnded(currentPollId);
    }

    /// @notice Get the currently active poll details
    /// @return pollId ID of active poll (0 if none)
    /// @return question Poll question
    /// @return options Options array
    /// @return votes Votes per option
    /// @return isActive Whether poll is active
    function getActivePoll()
        external
        view
        returns (
            uint256 pollId,
            string memory question,
            string[] memory options,
            uint256[] memory votes,
            bool isActive
        )
    {
        pollId = currentPollId;
        if (pollId == 0) {
            // no poll created yet – return empty arrays
            return (0, "", new string[](0), new uint256[](0), false);
        }

        Poll storage p = polls[pollId];
        question = p.question;
        options = p.options;
        votes = p.votes;
        isActive = p.isActive;
    }

    /// @notice Get any poll (past or current) by id
    /// @param _pollId Poll id (1..pollCount)
    function getPoll(uint256 _pollId)
        external
        view
        returns (
            string memory question,
            string[] memory options,
            uint256[] memory votes,
            bool isActive
        )
    {
        require(_pollId > 0 && _pollId <= pollCount, "Invalid pollId");
        Poll storage p = polls[_pollId];
        question = p.question;
        options = p.options;
        votes = p.votes;
        isActive = p.isActive;
    }

    // --- Pause controls (owner only) ---

    function pause() external onlyOwner {
        _pause(); // emits Paused(address) from OpenZeppelin
    }

    function unpause() external onlyOwner {
        _unpause(); // emits Unpaused(address) from OpenZeppelin
    }
}
