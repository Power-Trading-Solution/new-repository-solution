const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("10000", 18);

module.exports = buildModule("USDSModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);

  const usds = m.contract("USDS", [initialSupplyParam], {
  });

  return { usds };
});
