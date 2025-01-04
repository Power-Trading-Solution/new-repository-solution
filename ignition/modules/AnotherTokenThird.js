const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("AnotherTokenThirdModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);
  const tokensPerLETHParam = m.getParameter("tokensPerLETH", 7);
  const tokensPerUSDSParam = m.getParameter("tokensPerLETH", 5);
  const tokensPerMTSParam = m.getParameter("tokensPerMTS", 10);
  const tokensPerMTFParam = m.getParameter("tokensPerMTF", 5);
  const tokensPerATFParam = m.getParameter("tokensPerATF", 2);
  const tokensPerLTFParam = m.getParameter("tokensPerLTF", 4);

  const another_token_third = m.contract("AnotherTokenThird", [initialSupplyParam, tokensPerLETHParam, tokensPerUSDSParam, tokensPerMTSParam, tokensPerMTFParam, tokensPerATFParam, tokensPerLTFParam], {
  });

  return { another_token_third };
});