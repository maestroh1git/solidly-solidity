//SPDX-License-Identifier: MIT
//@dev this contract is used with Attack.sol and Helper.sol to show the usage of delegateCall

pragma solidity ^0.8.10;

contract Good {
    //Slot 0
    address public helper;
    //Slot 1
    address public owner;
    //Slot 2
    uint public num;

    /** 
     * @dev constructor takes in the address of the helper contract 
     * and sets the owner to the msg.sender
    */
    constructor(address _helper){
        helper = _helper;
        owner = msg.sender;
    }

    /** 
     * @dev function sets a number with delegatecall to Helper contract
    */
    function setNum( uint _num ) public {
        helper.delegatecall(abi.encodeWithSignature("setNum(uint256)", _num));
    }
}