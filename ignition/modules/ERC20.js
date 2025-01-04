const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("MockERC20Module", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);

  const erc20 = m.contract("MockERC20", [initialSupplyParam], {
  });

  return { erc20 };
});