const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("MockERC20Module", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);
  const nameParam = m.getParameter("name", "ERC20");
  const symbolParam = m.getParameter("symbol", "ERC20");

  const erc20 = m.contract("MockERC20", [nameParam, symbolParam, initialSupplyParam], {
  });

  return { erc20 };
});