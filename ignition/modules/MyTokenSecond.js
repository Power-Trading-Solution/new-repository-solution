const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

const initialSupply = ethers.parseUnits("1000000", 18);

module.exports = buildModule("MyTokenSecondModule", (m) => {
  const initialSupplyParam = m.getParameter("initialSupply", initialSupply);
  const tokensPerLETHParam = m.getParameter("tokensPerLETH", 2);
  const tokensPerUSDSParam = m.getParameter("tokensPerLETH", 10);
  const tokensPerMTFParam = m.getParameter("tokensPerMTF", 4);
  const tokensPerATTParam = m.getParameter("tokensPerATT", 12);
  const tokensPerATFParam = m.getParameter("tokensPerATF", 8);
  const tokensPerLTFParam = m.getParameter("tokensPerLTF", 2);

  const my_token_second = m.contract("MyTokenSecond", [initialSupplyParam, tokensPerLETHParam, tokensPerUSDSParam, tokensPerMTFParam, tokensPerATTParam, tokensPerATFParam, tokensPerLTFParam], {
  });

  return { my_token_second };
});