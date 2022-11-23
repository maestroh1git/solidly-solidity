// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Voting {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // submission object
    struct Submission {
        uint256 id;
        string title;
        string description;
        uint256 voteCount;
    }

    mapping(uint256 => Submission) public submissions;

    uint256 public submissionCount;

    // address of users who have voted
    mapping(address => bool) public isVoter;

    // allows only owners call a function
    modifier onlyOwner() {
        require(owner == msg.sender, "Not the owner");
        _;
    }

    // adds a new submission
    function addSubmission(string memory _title, string memory _description)
        external
        onlyOwner
    {
        submissionCount++;
        Submission memory newSubmission = Submission(
            submissionCount,
            _title,
            _description,
            0
        );
        submissions[submissionCount] = newSubmission;
    }

    // view submissions
    function viewSubmissions(uint256 _submissionId)
        external
        view
        returns (Submission memory submission)
    {
        return submissions[_submissionId];
    }

    // vote for submissions
    function vote(uint256 _submissionId) external {
        // prevent double voting
        require(!isVoter[msg.sender], "You cannot vote twice");

        // record voting
        isVoter[msg.sender] = true;

        // increase submission vote count
        submissions[_submissionId].voteCount++;
    }

    function unvote(uint256 _submissionId) external {
        // prevent double voting
        require(isVoter[msg.sender], "You have not voted");

        // record voting
        isVoter[msg.sender] = false;

        // decrease submission vote count
        submissions[_submissionId].voteCount--;
    }

    function viewVotes(uint256 _submissionId) public view returns (uint256) {
        return submissions[_submissionId].voteCount;
    }
}