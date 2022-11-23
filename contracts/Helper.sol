//SPDX-License-Identifier: MIT
//@dev this contract is used with Good.sol and Attack.sol to show the usage of delegateCall

pragma solidity ^0.8.10;

contract Helper {
    uint public num;

    /**
     * @dev setNum takes a uint and sets it to the storage variable 
     */
    function setNum(uint _num) public {
        num = _num;    
    }
}

