const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

const fs = require('fs');
const path = require('path');

module.exports = buildModule("ManagerModule", (m) => {
   
    const filePath = path.join('../new-repository-solution/ignition/deployments/chain-31337', 'deployed_addresses.json');

    var USDSAddress, ETHAddress, routerAddress;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Ошибка чтения файла:', err);
          return;
      }

      try {

          const addresses = JSON.parse(data);

          const router = 'SwapModule#Swap'; 

          const usdsName = 'USDSModule#USDS';
          const ethName = 'ETHModule#ETH';
    
          ETHAddress = addresses[ethName];
          USDSAddress = addresses[usdsName];
          routerAddress = addresses[router];

          /*if (contractAddressFirst) {
              console.log(`Адрес контракта ${tokenNameFirst}:`, contractAddressFirst);
              console.log(`Адрес контракта ${tokenNameSecond}:`, contractAddressSecond);
          } else {
              console.log(`Контракт ${contractName} не найден в файле.`);
          }*/
      } catch (parseErr) {
          console.error('Ошибка парсинга JSON:', parseErr);
      }

      const routerParam = m.getParameter("uniswap_router", routerAddress);
      const tokenUSDSParam = m.getParameter("tokenUSDS", USDSAddress);
      const tokenETHParam = m.getParameter("tokenETH", ETHAddress);

      const exchangeRateParam = m.getParameter("exchangeParam", 12);

      const manager = m.contract("Manager", [routerParam, tokenUSDSParam, tokenETHParam, exchangeRateParam], {
      });

      return { manager };
    });
  
});