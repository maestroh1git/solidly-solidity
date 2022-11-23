//SPDX-License-Identifier: MIT License
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlashLoanExample is FlashLoanSimpleReceiverBase {
    using SafeMath for uint;
    event Log(address asset, uint value);

    constructor(IPoolAddressesProvider provider)
        FlashLoanSimpleReceiverBase(provider)
        {}
    /**
    * @notice Creates the flashloan request.
    * @param asset- The address of the asset contract
    * @param amount- the amount of the asset to be borrowed
    */
    function createFlashLoan(address asset, uint amount) external {
        address receiver = address(this);
        bytes memory params = ""; //we use this to pass arbitrary data to executeOperation
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiver,
            asset,
            amount,
            params,
            referralCode
        );
    }

    /**
    * @notice callback for the loan provider
    * @param asset- The address of the asset contract
    * @param amount- the amount of the asset to be borrowed
    * @param amount- the amount of the asset to be paid as interest
    * @param amount- the address of the loan initiator
    * @param params- the encoded parameters for the loan execution
    */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool){

        //here we use the loan to do some arbitraging
        //abi.decode(params) to decode the params

        uint amountOwing = amount.add(premium);
        IERC20(asset).approve(address(POOL), amountOwing);

        emit Log(asset, amountOwing);
        return true;
    }
}