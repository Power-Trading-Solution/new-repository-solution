// // Путь к файлу: scripts/showAccounts.js

// async function main() {
//     // Получаем все аккаунты через getSigners
//     const [deployer, user1, user2, ...otherSigners] = await hre.ethers.getSigners();
  
//     // Выводим адреса аккаунтов в консоль
//     console.log("Deployer address:", deployer.address);
//     console.log("User 1 address:", user1.address);
//     console.log("User 2 address:", user2.address);
//     console.log("Other accounts:", otherSigners.map(signer => signer.address));
//   }
  
//   main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });
  