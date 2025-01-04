const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("AnotherTokenFourthModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);
  const tokensPerLETHParam = m.getParameter("tokensPerLETH", 6);
  const tokensPerUSDSParam = m.getParameter("tokensPerLETH", 2);
  const tokensPerMTSParam = m.getParameter("tokensPerMTS", 4);
  const tokensPerATTParam = m.getParameter("tokensPerATT", 10);
  const tokensPerMTFParam = m.getParameter("tokensPerMTF", 6);
  const tokensPerLTFParam = m.getParameter("tokensPerLTF", 15);

  const another_token_fourthh = m.contract("AnotherTokenFourth", [initialSupplyParam, tokensPerLETHParam, tokensPerUSDSParam, tokensPerMTSParam, tokensPerATTParam, tokensPerMTFParam, tokensPerLTFParam], {
  });

  return { another_token_fourthh };
});