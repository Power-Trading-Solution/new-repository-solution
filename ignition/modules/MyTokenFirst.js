const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("MyTokenFirstModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);
  const tokensPerLETHParam = m.getParameter("tokensPerLETH", 10);
  const tokensPerUSDSParam = m.getParameter("tokensPerLETH", 10);
  const tokensPerMTSParam = m.getParameter("tokensPerMTS", 2);
  const tokensPerATTParam = m.getParameter("tokensPerATT", 17);
  const tokensPerATFParam = m.getParameter("tokensPerATF", 5);
  const tokensPerLTFParam = m.getParameter("tokensPerLTF", 7);

  const my_token_first = m.contract("MyTokenFirst", [initialSupplyParam, tokensPerLETHParam, tokensPerUSDSParam, tokensPerMTSParam, tokensPerATTParam, tokensPerATFParam, tokensPerLTFParam], {
  });

  return { my_token_first };
});
