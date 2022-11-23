const { expect, assert } = require("chai")
const { BigNumber } = require("ethers")
const { ethers, waffle, artifacts } = require("hardhat")
const hre = require("hardhat")

const { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } = require("../config")

/**
 * @notice Describes a test that deploys a flash loan
 */
describe("Deploy a Flash Loan", function () {
  /**
   * test 1
   */
  it("Should take a flash loan and be able to return it", async function(){ 

    //instantiate FlashLoanExample contract
    const flashLoanExample = await ethers.getContractFactory("FlashLoanExample")

    //deploy the contract with the pool provider as constructor arguments
    const _flashLoanExample = await flashLoanExample.deploy(POOL_ADDRESS_PROVIDER)
    await _flashLoanExample.deployed()

    //instantiate the DAI contract and parseEther value of 2000
    const token = await ethers.getContractAt("IERC20", DAI);
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");

    //Impersonate the DAI Whale account to be able to send transactions from it
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    })
    const signer = await ethers.getSigner(DAI_WHALE)
    //transfer 2000DAI from the whale account to our flash loan contract
    await token
      .connect(signer)
      .transfer(_flashLoanExample.address, BALANCE_AMOUNT_DAI)

    //Borrow 1000 DAI without collateral
    const tx = await _flashLoanExample.createFlashLoan(DAI, 1000)
    await tx.wait()

    //Check the balance of the contract after the transaction has been completed
    const remainingBalance = await token.balanceOf(_flashLoanExample.address)

    //We expect that our contract balance is now less than 2000DAI,
    //since the premium has been paid from our contract's balance
    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true
  })
})