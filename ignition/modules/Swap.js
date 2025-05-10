const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

const fs = require('fs');
const path = require('path');

module.exports = buildModule("SwapModule", (m) => {

    // Определяем путь к файлу deployed_addresses.json
    const filePath = path.join('../social-trading-new/ignition/deployments/chain-31337', 'deployed_addresses.json');

    var USDSAddress, ETHAddress;

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
          const usdsName = 'USDSModule#USDS';
          const ethName = 'ETHModule#ETH';
    
          ETHAddress = addresses[ethName];
          USDSAddress = addresses[usdsName];

          /*if (contractAddressFirst) {
              console.log(`Адрес контракта ${contractNameFirst}:`, contractAddressFirst);
              console.log(`Адрес контракта ${contractNameSecond}:`, contractAddressSecond);
          } else {
              console.log(`Контракт ${contractName} не найден в файле.`);
          }*/
      } catch (parseErr) {
          console.error('Ошибка парсинга JSON:', parseErr);
      }

      const tokenUSDSParam = m.getParameter("tokenUSDS", USDSAddress);
      const tokenETHParam = m.getParameter("tokenETH", ETHAddress);

      const exchangeRateParam = m.getParameter("exchangeParam", 12);

      const swap = m.contract("Swap", [tokenUSDSParam, tokenETHParam, exchangeRateParam], {
      });

      return { swap };
    });
  
});

