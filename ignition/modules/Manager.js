const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

const fs = require('fs');
const path = require('path');

module.exports = buildModule("ManagerModule", (m) => {

    // Определяем путь к файлу deployed_addresses.json
    const filePath = path.join('../social-trading-new/ignition/deployments/chain-31337', 'deployed_addresses.json');

    var contractAddressFirst, contractAddressSecond, contractAddressThird, contractAddressFourth, contractAddressFifth, routerAddress, tokenUSDSAddress;

    // Чтение файла
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Ошибка чтения файла:', err);
          return;
      }

      try {
          // Парсинг JSON
          const addresses = JSON.parse(data);

          const router = 'SwapModule#Swap'; 
          
          // Получаем адрес контракта по имени
          const contractNameFirst = 'MyTokenFirstModule#MyTokenFirst';
          const contractNameSecond = 'MyTokenSecondModule#MyTokenSecond'; 
          const contractNameThird = 'AnotherTokenThirdModule#AnotherTokenThird';
          const contractNameFourth = 'AnotherTokenFourthModule#AnotherTokenFourth'; 
          const contractNameFifth = 'AnotherTokenFourthModule#AnotherTokenFourth'; 
          const tokenUSDSName = 'USDSModule#USDS';
          contractAddressFirst = addresses[contractNameFirst];
          contractAddressSecond = addresses[contractNameSecond];
          contractAddressThird = addresses[contractNameThird];
          contractAddressFourth = addresses[contractNameFourth];
          contractAddressFifth = addresses[contractNameFifth];
          tokenUSDSAddress = addresses[tokenUSDSName];
          routerAddress = addresses[router];

          if (contractAddressFirst) {
              console.log(`Адрес контракта ${contractNameFirst}:`, contractAddressFirst);
              console.log(`Адрес контракта ${contractNameSecond}:`, contractAddressSecond);
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