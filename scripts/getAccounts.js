const { ethers } = require("hardhat");

async function main() {
    // Получаем список аккаунтов
    const [deployer, user1, user2, user3] = await ethers.getSigners();
    
    // Выводим адреса аккаунтов в консоль
    console.log("Deployer address:", deployer.address);
    console.log("User 1 address:", user1.address);
    console.log("User 2 address:", user2.address);
    console.log("User 3 address:", user3.address);
}

// Запускаем функцию
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
