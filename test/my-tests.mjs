import { expect } from "chai";
import hre from "hardhat";

describe("Manager contract", function () {

  let managerContract;
  let owner, user, manager;

  beforeEach(async function () {
    [owner, user, manager] = await ethers.getSigners();

    // Развертывание контракта ManagerContract
    managerContract = await hre.ethers.deployContract("ManagerContract");
  });


  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    console.log(owner.address);
    expect(owner.address).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  });

  it("should create trust successfully", async function () {
    const duration = 7;

    await managerContract.connect(user).createTrust(manager.address, duration);

    const trust = await managerContract.trusts(user.address);
    expect(trust.manager).to.equal(manager.address);
    expect(trust.isActive).to.be.true;
    expect(trust.expiry).to.be.gt(Math.floor(Date.now() / 1000));
  });

  it("should not allow creating trust if it already exists", async function () {
    const duration = 7;
    await managerContract.connect(user).createTrust(manager.address, duration);

    await expect(managerContract.connect(user).createTrust(manager.address, duration)).to.be.revertedWith("Trust already exists");
  });
});
