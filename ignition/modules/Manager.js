const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

const fs = require('fs');
const path = require('path');

module.exports = buildModule("ManagerModule", (m) => {

   
    const filePath = path.join('../social-trading-new/ignition/deployments/chain-31337', 'deployed_addresses.json');

    var contractAddressFirst, contractAddressSecond, contractAddressThird, contractAddressFourth, contractAddressFifth, routerAddress, tokenUSDSAddress;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Ошибка чтения файла:', err);
          return;
      }

      try {

          const addresses = JSON.parse(data);

          const router = 'SwapModule#Swap'; 
          
       
          const tokenNameFirst = 'MyTokenFirstModule#MyTokenFirst';
          const tokenNameSecond = 'MyTokenSecondModule#MyTokenSecond'; 
          const tokenNameThird = 'AnotherTokenThirdModule#AnotherTokenThird';
          const tokenNameFourth = 'AnotherTokenFourthModule#AnotherTokenFourth'; 
          const tokenNameFifth = 'AnotherTokenFourthModule#AnotherTokenFourth'; 
          const tokenUSDSName = 'USDSModule#USDS';
          contractAddressFirst = addresses[tokenNameFirst];
          contractAddressSecond = addresses[tokenNameSecond];
          contractAddressThird = addresses[tokenNameThird];
          contractAddressFourth = addresses[tokenNameFourth];
          contractAddressFifth = addresses[tokenNameFifth];
          tokenUSDSAddress = addresses[tokenUSDSName];
          routerAddress = addresses[router];

          if (contractAddressFirst) {
              console.log(`Адрес контракта ${tokenNameFirst}:`, contractAddressFirst);
              console.log(`Адрес контракта ${tokenNameSecond}:`, contractAddressSecond);
          } else {
              console.log(`Контракт ${contractName} не найден в файле.`);
          }
      } catch (parseErr) {
          console.error('Ошибка парсинга JSON:', parseErr);
      }

      const routerParam = m.getParameter("uniswap_router", routerAddress);
      const token0Param = m.getParameter("token0", contractAddressFirst);
      const token1Param = m.getParameter("token1", contractAddressSecond);
      const token2Param = m.getParameter("token2", contractAddressThird);
      const token3Param = m.getParameter("token3", contractAddressFourth);
      const token4Param = m.getParameter("token4", contractAddressFifth);
      const tokenUSDSParam = m.getParameter("tokenUSDS", tokenUSDSAddress);

      const manager = m.contract("Manager", [routerParam, token0Param, token1Param, token2Param, token3Param, token4Param, tokenUSDSParam], {
      });

      return { manager };
    });
  
});