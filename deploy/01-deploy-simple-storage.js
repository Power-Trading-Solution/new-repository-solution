const { network } = require("hardhat");

module.exports = async (hre) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId;

    const simpleStorage = await deploy("SimpleStorage", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: chainId == 31337 ? 1 : 6,
    });
};

module.exports.tags = ["all", "simpleStorage"];