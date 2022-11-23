// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract GoodContract {
    mapping(address => uint) public balances;

    //Update the 'balances' mapping to include the new ETH deposited by msg.sender
    function addBalance() public payable {
        balances[msg.sender] += msg.value;
    }

    //Send ETH worth 'balances[msg.sender]' back to msg.sender
    function withdraw() public {
        require(balances[msg.sender] > 0);
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;    
    }
}