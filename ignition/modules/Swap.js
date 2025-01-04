const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

const fs = require('fs');
const path = require('path');

module.exports = buildModule("SwapModule", (m) => {

    // Определяем путь к файлу deployed_addresses.json
    const filePath = path.join('../social-trading-new/ignition/deployments/chain-31337', 'deployed_addresses.json');

    var contractAddressFirst = ""
    var contractAddressSecond = ""

    var tokenFirstAddress, tokenSecondAddress, tokenThirdAddress, tokenFourthAddress, tokenFifthAddress, tokenUSDSAddress;

    // Чтение файла
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Ошибка чтения файла:', err);
          return;
      }

      try {
          // Парсинг JSON
          const addresses = JSON.parse(data);
          
          // Получаем адрес контракта по имени
          const contractNameFirst = 'MyTokenFirstModule#MyTokenFirst';
          const contractNameSecond = 'MyTokenSecondModule#MyTokenSecond'; 
          contractAddressFirst = addresses[contractNameFirst];
          contractAddressSecond = addresses[contractNameSecond]

          const tokenFirstName = 'MyTokenFirstModule#MyTokenFirst';
          const tokenSecondName = 'MyTokenSecondModule#MyTokenSecond'; 
          const tokenThirdName = 'AnotherTokenThirdModule#AnotherTokenThird';
          const tokenFourthName = 'AnotherTokenFourthModule#AnotherTokenFourth'; 
          const tokenFifthName = 'AnotherTokenFourthModule#AnotherTokenFourth'; 
          const tokenUSDSName = 'USDSModule#USDS';
          tokenFirstAddress = addresses[tokenFirstName];
          tokenSecondAddress = addresses[tokenSecondName];
          tokenThirdAddress = addresses[tokenThirdName];
          tokenFourthAddress = addresses[tokenFourthName];
          tokenFifthAddress = addresses[tokenFifthName];
          tokenUSDSAddress = addresses[tokenUSDSName];

          if (contractAddressFirst) {
              console.log(`Адрес контракта ${contractNameFirst}:`, contractAddressFirst);
              console.log(`Адрес контракта ${contractNameSecond}:`, contractAddressSecond);
          } else {
              console.log(`Контракт ${contractName} не найден в файле.`);
          }
      } catch (parseErr) {
          console.error('Ошибка парсинга JSON:', parseErr);
      }

      const token0Param = m.getParameter("token0", contractAddressFirst);
      const token1Param = m.getParameter("token1", contractAddressSecond);

      const mtfParam = m.getParameter("tokenMTF", tokenFirstAddress);
      const mtsParam = m.getParameter("tokenMTS", tokenSecondAddress);
      const attParam = m.getParameter("tokenATT", tokenThirdAddress);
      const atfParam = m.getParameter("tokenATF", tokenFourthAddress);
      const ltfParam = m.getParameter("tokenLTF", tokenFifthAddress);
      const tokenUSDSParam = m.getParameter("tokenUSDS", tokenUSDSAddress);

      const swap = m.contract("Swap", [token0Param, token1Param, mtfParam, mtsParam, attParam, atfParam, ltfParam, tokenUSDSParam], {
      });

      return { swap };
    });
  
});

