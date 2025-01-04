import { expect } from "chai";
import hre from "hardhat";
import assert from 'assert';

describe("Manager", function () {
    before(async function () {
        // Получаем список аккаунтов
        [owner, user1, user2] = await ethers.getSigners();

        // Развертывание токена MyTokenFirst
        MyTokenFirst = await ethers.getContractFactory("MyTokenFirst");
        tokenMTF = await MyTokenFirst.deploy();

        // Развертывание контракта Manager
        Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy(
            "0xUniswapRouterAddress",
            tokenMTF.address,
            // Передайте необходимые параметры для других токенов и USDS
        );
    });

    it("should allow user to create a trust", async function () {
        const durationInDays = 30;
        const commission = 5;

        await manager.createTrust(user2.address, durationInDays, commission, { from: user1.address });

        const trust = await manager.trusts(user1.address);
        expect(trust.manager).to.equal(user2.address);
        expect(trust.isActive).to.be.true;
    });

    it("should not allow to create a trust if it already exists", async function () {
        const durationInDays = 30;
        const commission = 5;

        await manager.createTrust(user2.address, durationInDays, commission, { from: user1.address });

        await expect(
            manager.createTrust(user2.address, durationInDays, commission, { from: user1.address })
        ).to.be.revertedWith("Trust already exists");
    });

    it("should allow deposits into active trust", async function () {
        const depositAmount = ethers.utils.parseUnits("100", 18);

        await manager.createTrust(user2.address, 30, 5, { from: user1.address });
        await tokenMTF.mint(user1.address, depositAmount);
        await tokenMTF.approve(manager.address, depositAmount, { from: user1.address });

        await manager.depositTokens(tokenMTF.address, depositAmount, { from: user1.address });

        const trust = await manager.trusts(user1.address);
        expect(trust.amountsStart[0]).to.equal(depositAmount);
    });

    it("should not allow deposits if trust is not active", async function () {
        const depositAmount = ethers.utils.parseUnits("100", 18);

        await expect(
            manager.depositTokens(tokenMTF.address, depositAmount, { from: user1.address })
        ).to.be.revertedWith("No active trust found");
    });

    it("should emit TradingEnabled event on starting trading", async function () {
        const durationInDays = 30;

        await expect(manager.startTrading(durationInDays, { from: user1.address }))
            .to.emit(manager, "TradingEnabled")
            .withArgs(user1.address);
    })

});

describe("TokenTradeContract", function () {
    let tokenTradeContract, tokenIn, tokenOut, manager, user, amountIn, amountOutMin;

    beforeEach(async function () {
        [manager, user] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("ERC20Token"); // Предположим, у вас есть ERC20 токен
        tokenIn = await Token.deploy("TokenIn", "TKI", ethers.utils.parseEther("10000"));
        tokenOut = await Token.deploy("TokenOut", "TKO", ethers.utils.parseEther("10000"));

        const Trade = await ethers.getContractFactory("TokenTradeContract");
        tokenTradeContract = await Trade.deploy(/* параметры инициализации */);

        amountIn = ethers.utils.parseEther("10");
        amountOutMin = ethers.utils.parseEther("1");

        // Включаем пользователя в доверие, чтобы он мог выполнять операции
        await tokenTradeContract.addTrust(user.address);
        await tokenIn.connect(user).approve(tokenTradeContract.address, amountIn); // Допустим, что пользователь может одобрить токен
    });

    it("should revert if amountIn is 0", async function () {
        await expect(tokenTradeContract.tradeTokens(tokenIn.address, tokenOut.address, 0, amountOutMin, user.address)).to.be.revertedWith("Amount must be greater than 0");
    });

    it("should execute trade tokens successfully", async function () {
        // Пример успешной торговли токенами. Вам нужно настроить mock для router.
        const amountsOutResult = [ethers.utils.parseEther("9"), ethers.utils.parseEther("1")];

        await tokenTradeContract.setMockRouterResponse(amountsOutResult); // Вызываем mock router

        await tokenTradeContract.tradeTokens(tokenIn.address, tokenOut.address, amountIn, amountOutMin, user.address);

        // Проверка, что токены были обменены правильно
        const userBalanceOut = await tokenOut.balanceOf(user.address);
        const userBalanceIn = await tokenIn.balanceOf(user.address);
        
        expect(userBalanceIn).to.be.equal(ethers.utils.parseEther("9990")); // Проверяем уменьшение токенов
        expect(userBalanceOut).to.be.equal(ethers.utils.parseEther("1")); // Проверяем увеличение токенов
    });

    it("should not add tokenOut if it already exists", async function () {
        // Заранее добавляем tokenOut в доверие
        await tokenTradeContract.tradeTokens(tokenIn.address, tokenOut.address, amountIn, amountOutMin, user.address);
        // Проводим торговлю снова
        await tokenTradeContract.tradeTokens(tokenIn.address, tokenOut.address, amountIn, amountOutMin, user.address);
        
        // Проверяем, что адрес токена не добавился в доверие дважды
        const tokens = await tokenTradeContract.getTrustTokens(user.address); // Метод получения токенов в доверии
        expect(tokens).to.deep.equal([tokenIn.address, tokenOut.address]);
    });

})

describe("TokenTradeContract", function () {
    let tokenTradeContract, tokenUSDS, manager, user, amountIn, tokenMTF, tokenMTS, tokenATT, tokenATF, tokenLTF;

    beforeEach(async function () {
        [manager, user] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("ERC20Token");
        tokenUSDS = await Token.deploy("USDS", "USDS", ethers.utils.parseEther("10000"));
        
        // Создаем ваши токены (tokenMTF, tokenMTS и т.д.)
        // Пример: 
        tokenMTF = await Token.deploy("Token MTF", "MTF", ethers.utils.parseEther("10000"));
        tokenMTS = await Token.deploy("Token MTS", "MTS", ethers.utils.parseEther("10000"));
        tokenATT = await Token.deploy("Token ATT", "ATT", ethers.utils.parseEther("10000"));
        tokenATF = await Token.deploy("Token ATF", "ATF", ethers.utils.parseEther("10000"));
        tokenLTF = await Token.deploy("Token LTF", "LTF", ethers.utils.parseEther("10000"));

        const Trade = await ethers.getContractFactory("TokenTradeContract");
        tokenTradeContract = await Trade.deploy(tokenUSDS.address, /* другие параметры */);
        
        // Инициализация значений в trusts
        // Например, чтобы добавить токены и их количество
        await tokenTradeContract.addTrust(user.address, /* другие параметры */);
    });

    it("should stop trading for the user", async function () {
        await tokenTradeContract.stopTrading(user.address, manager.address);

        const trust = await tokenTradeContract.trusts(user.address);
        expect(trust.isActive).to.be.false; // Проверяем, что торговля остановлена
    });

    it("should not execute if trading is stopped after expiry", async function () {
        // Устанавливаем время истечения
        await tokenTradeContract.setExpiry(user.address, /* timestamp */);
        
        await expect(tokenTradeContract.stopTrading(user.address, manager.address))
            .to.be.revertedWith("Cannot stop trading after expiry");
    });

    it("should transfer USDS to user and manager correctly", async function () {
        // Предположим, что в trusts уже есть токены с соответствующими значениями
        await tokenTradeContract.setMockTokenValues(user.address); // Установите значения токенов
        
        await tokenTradeContract.stopTrading(user.address, manager.address);
        
        const userBalance = await tokenUSDS.balanceOf(user.address);
        const managerBalance = await tokenUSDS.balanceOf(manager.address);

        // Проверьте остался ли баланс пользователя и менеджера корректным 
        // Например, ожидания могут зависеть от логики комиссии и передачи средств:
        expect(userBalance).to.be.equal(/* ожидаемый баланс пользователя */);
        expect(managerBalance).to.be.equal(/* ожидаемый баланс менеджера */);
    });

    // Добавьте больше тестов по необходимости, например, для конкретных случаев ошибок или дополнительных условий.
});
