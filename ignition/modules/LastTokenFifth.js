const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("LastTokenFifthModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);
  const tokensPerLETHParam = m.getParameter("tokensPerLETH", 12);
  const tokensPerUSDSParam = m.getParameter("tokensPerLETH", 6);
  const tokensPerMTSParam = m.getParameter("tokensPerMTS", 8);
  const tokensPerATTParam = m.getParameter("tokensPerATT", 4);
  const tokensPerATFParam = m.getParameter("tokensPerATF", 7);
  const tokensPerMTFParam = m.getParameter("tokensPerMTF", 10);

  const last_token_fifth = m.contract("LastTokenFifth", [initialSupplyParam, tokensPerLETHParam, tokensPerUSDSParam, tokensPerMTSParam, tokensPerATTParam, tokensPerATFParam, tokensPerMTFParam], {
  });

  return { last_token_fifth };
});