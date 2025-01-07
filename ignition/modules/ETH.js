const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("ETHModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);

  const eth = m.contract("ETH", [initialSupplyParam], {
  });

  return { eth };
});
