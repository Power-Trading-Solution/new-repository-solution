const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("USDS Token Contract", function () {
  let USDS, usds, owner, user1;

  before(async function () {
    [owner, user1] = await ethers.getSigners();
    const USDSFactory = await ethers.getContractFactory("USDS");
    usds = await USDSFactory.deploy(ethers.parseUnits("1000")); 
    await usds.waitForDeployment();
  });

  it("Should allow owner to mint new tokens", async function () {
    await usds.connect(owner).mint(user1.address, ethers.parseUnits("1000"));
    expect(await usds.balanceOf(user1.address)).to.equal(ethers.parseUnits("1000"));
  });

});