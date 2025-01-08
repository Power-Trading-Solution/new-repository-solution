const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ETH Token Contract", function () {
  let ETH, eth, owner, user1;

  before(async function () {
    [owner, user1] = await ethers.getSigners();
    const ETHFactory = await ethers.getContractFactory("ETH");
    eth = await ETHFactory.deploy(ethers.parseUnits("1000")); 
    await eth.waitForDeployment();
  });


  it("Should allow owner to mint new tokens", async function () {
    await eth.connect(owner).mint(user1.address, ethers.parseUnits("1000"));
    expect(await eth.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000"));
  });


});