const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat")

/*module.exports = async (hre) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId;

    // Деплой контракта UserRegistry
    const userRegistry = await deploy("UserRegistry", {
        from: deployer,
        log: true,
        args: [], // Указываем аргументы конструктора, если они есть
        waitConfirmations: chainId == 31337 ? 1 : 6,
    });

    console.log(`UserRegistry deployed at ${userRegistry.address}`);
};

module.exports.tags = ["all", "userRegistry"];*/



module.exports = buildModule("UserRegistryModule", (m) => {

  const userRegistry = m.contract("UserRegistry", [], {
  });

  return { userRegistry };
});
