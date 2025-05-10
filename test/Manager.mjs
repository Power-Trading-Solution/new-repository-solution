import { expect } from "chai";
import hre from "hardhat";
import assert from 'assert';

describe("Manager", function () {
    var tokenETHFactory, tokenUSDSFactory, tokenUSDS, tokenETH, managerFactory, manager;
    var swapRouter;
    let [owner, user1, user2] = [];

    before(async function () {
        // Получаем список аккаунтов
        [owner, user1, user2] = await ethers.getSigners();


        const initialSupply = ethers.parseUnits("1000000", 18);

        tokenUSDSFactory = await ethers.getContractFactory("USDS");
        tokenUSDS = await tokenUSDSFactory.deploy(initialSupply);

        tokenETHFactory = await ethers.getContractFactory("ETH");
        tokenETH = await tokenETHFactory.deploy(initialSupply);

        const exchangeRate = 12;

        const Swap = await ethers.getContractFactory("Swap");
        swapRouter = await Swap.deploy(tokenUSDS, tokenETH, exchangeRate);

        managerFactory = await ethers.getContractFactory("Manager");
        manager = await managerFactory.deploy(swapRouter, tokenUSDS, tokenETH, exchangeRate);

    });

    it("should allow user to create a trust", async function () {
        const durationInDays = 30;
        const commission = 5;

        await manager.connect(user2).createTrust(user1, durationInDays, commission);

        const trust = await manager.trusts(user2);
        expect(trust.manager).to.equal(user1);
        expect(trust.isActive).to.be.true;
    });

    it("should not allow to create a trust if it already exists", async function () {
        const durationInDays = 30;
        const commission = 5;

        await manager.connect(user2).createTrust(user1, durationInDays, commission);

        await expect(
            manager.connect(user2).createTrust(user1, durationInDays, commission)
        ).to.be.revertedWith("Trust already exists");
    });

    it("should allow deposits into active trust", async function () {
        const depositAmount = ethers.parseUnits("100", 18);

    
        await manager.connect(user1).createTrust(user2, 30, 5);
        await tokenUSDS.mint(user1, depositAmount);

        await tokenUSDS.connect(user1).approve(manager, depositAmount);

  
        await manager.connect(user1).depositTokens(tokenUSDS, depositAmount);

        const trust = await manager.trusts(user1);
        //console.log("trust", trust);
        //const usersTokens = await manager;
        //const mapTokens = await usersTokens[tokenMTF];
        //console.log("user tokens", mapTokens);

    });

    it("should not allow deposits if trust is not active", async function () {
        const depositAmount = ethers.parseUnits("100", 18);

        await tokenUSDS.mint(user2, depositAmount);

        await tokenUSDS.connect(user2).approve(manager, depositAmount);

        await expect(
            manager.connect(user2).depositTokens(tokenUSDS, depositAmount) //тут не отправляется токен юзеру
        ).to.be.revertedWith("No active trust found");
    });

    it("should emit TradingEnabled event on starting trading", async function () {
        const durationInDays = 30;

        await expect(
            manager.connect(user1).startTrading(durationInDays)
            )
            .to.emit(manager, "TradingEnabled")
            .withArgs(user1, durationInDays); 
    })

});

describe("TokenTradeContract", function () {
    var tokenTradeContract, tokenIn, tokenOut, user, amountIn, amountOutMin, swapRouter, tokenERC20;
    var tokenETHFactory, tokenUSDSFactory, tokenUSDS, tokenETH, managerFactory, manager, managerUser;

    beforeEach(async function () {
        [managerUser, user] = await ethers.getSigners(); //user - инвестор
        
        const initialSupply = ethers.parseUnits("1000000", 18);

        tokenUSDSFactory = await ethers.getContractFactory("USDS");
        tokenUSDS = await tokenUSDSFactory.deploy(initialSupply);

        tokenETHFactory = await ethers.getContractFactory("ETH");
        tokenETH = await tokenETHFactory.deploy(initialSupply);

        const exchangeRate = 12;

        const Swap = await ethers.getContractFactory("Swap");
        swapRouter = await Swap.deploy(tokenUSDS, tokenETH, exchangeRate);

        managerFactory = await ethers.getContractFactory("Manager");
        manager = await managerFactory.deploy(swapRouter, tokenUSDS, tokenETH, exchangeRate);

        


        //console.log("router", tokenTradeContract.uniswap_router().address)

        //amountIn = ethers.parseUnits("10", 18);
        //amountOutMin = ethers.parseUnits("1", 18);

        amountIn = ethers.parseUnits("10", 18);
        amountOutMin = ethers.parseUnits("1", 18);

        const durationInDays = 30;
        const commission = 5;

        await manager.connect(user).createTrust(managerUser, durationInDays, commission);

        //const trust = await tokenTradeContract.trusts(user.address);
        //expect(trust.manager).to.equal(manager.address);
        //expect(trust.isActive).to.be.true;

        // Включаем пользователя в доверие, чтобы он мог выполнять операции
        //await tokenTradeContract.addTrust(user.address);
        //await tokenIn.connect(user).approve(tokenTradeContract.address, amountIn); // Допустим, что пользователь может одобрить токен
    });

    it("should revert if amountIn is 0", async function () {
        await expect(manager.tradeTokens(tokenUSDS, tokenETH, 0, amountOutMin, user.address)).to.be.revertedWith("Amount must be greater than 0");
    });

    it.only("should execute trade tokens successfully", async function () {
        //console.log(user.address);
        // Пример успешной торговли токенами. Вам нужно настроить mock для router.
        const amountsOutResult = [9, 1];
        //console.log(amountsOutResult);
        //await tokenTradeContract.setMockRouterResponse(amountsOutResult); // Вызываем mock router

        const path = [];

        //path.push(tokenIn);
        //path.push(tokenOut);
        //console.log(tokenOut);
        const block = await ethers.provider.getBlock("latest");

        const depositAmount = ethers.parseUnits("100", 18);

        await tokenUSDS.mint(user, ethers.parseUnits("10000", 18));
        await tokenUSDS.mint(swapRouter, ethers.parseUnits("10000000000000", 18));
        await tokenETH.mint(swapRouter, ethers.parseUnits("100000000000", 18));

        await tokenUSDS.mint(manager, ethers.parseUnits("10000000000000", 18));
        await tokenETH.mint(manager, ethers.parseUnits("100000000000", 18));

        await tokenUSDS.connect(user).approve(manager, depositAmount);

  
        await manager.connect(user).depositTokens(tokenUSDS, depositAmount);

        //const balance = await tokenUSDS.balanceOf(manager);
        //console.log("balance", balance);
        //console.log("amointn", amountIn)

        //await tokenUSDS.connect(manager).approve(swapRouter, amountIn);

        await manager.connect(managerUser).approveTokens(tokenUSDS.target, swapRouter.target, amountIn);

        /*const amountsOut = await swapRouter.connect(managerUser).swapExactTokensForTokens(
            amountIn, amountOutMin, tokenUSDS, tokenETH, manager
        );
        //const res = await swapRouter.getReserves();
        const balance = await tokenUSDS.balanceOf(manager);
        console.log("balance", balance);

        const balanceeth = await tokenETH.balanceOf(manager);
        console.log("balance eth", balanceeth);*/
        //console.log(amountsOut[1]);

        await manager.connect(managerUser).tradeTokens(tokenUSDS, tokenETH, amountIn, amountOutMin, user.address);

        //await swapRouter.connect(managerUser).approveTokens(tokenUSDS.target, user.target, amountIn)

        await manager.connect(managerUser).stopTrading(user, managerUser); //не проверяет прошло ли время

        //sconst trust = await manager.trusts(user.address);
        const balance = await tokenUSDS.balanceOf(user);
        //console.log("balance ииииууу", balance);


        // Проверка, что токены были обменены правильно
        //const userBalanceOut = await tokenOut.balanceOf(user.address);
        //const userBalanceIn = await tokenIn.balanceOf(user.address);
        
        //expect(userBalanceIn).to.be.equal(9990); // Проверяем уменьшение токенов
        //expect(userBalanceOut).to.be.equal(1); // Проверяем увеличение токенов
    });

    /*it("should not add tokenOut if it already exists", async function () {
        // Заранее добавляем tokenOut в доверие
        await tokenTradeContract.tradeTokens("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", amountIn, amountOutMin, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        // Проводим торговлю снова
        //await tokenTradeContract.tradeTokens(tokenIn.address, tokenOut.address, amountIn, amountOutMin, user.address);
        
        // Проверяем, что адрес токена не добавился в доверие дважды
        const tokens = await tokenTradeContract.getTrustTokens(user.address); // Метод получения токенов в доверии
        expect(tokens).to.deep.equal([tokenIn.address, tokenOut.address]);
    });*/

})


describe("TokenTradeContract", function () {
    let tokenTradeContract, tokenUSDS, manager, user, amountIn, tokenMTF, tokenMTS, tokenATT, tokenATF, tokenLTF, swapRouter;
    var tokenETHFactory, tokenUSDSFactory, tokenETH, managerFactory, managerContract, managerUser;

    beforeEach(async function () {
        [manager, user] = await ethers.getSigners();

        const initialSupply = ethers.parseUnits("1000000", 18);

        tokenUSDSFactory = await ethers.getContractFactory("USDS");
        tokenUSDS = await tokenUSDSFactory.deploy(initialSupply);

        tokenETHFactory = await ethers.getContractFactory("ETH");
        tokenETH = await tokenETHFactory.deploy(initialSupply);

        const exchangeRate = 12;

        const Swap = await ethers.getContractFactory("Swap");
        swapRouter = await Swap.deploy(tokenUSDS, tokenETH, exchangeRate);

        managerFactory = await ethers.getContractFactory("Manager");
        managerContract = await managerFactory.deploy(swapRouter, tokenUSDS, tokenETH, exchangeRate);
        
        // Инициализация значений в trusts
        // Например, чтобы добавить токены и их количество
       
        await managerContract.connect(user).createTrust(manager, 30, 5);
    });

    it("should stop trading for the user", async function () {
        

        await managerContract.stopTrading(user.address, manager.address); //не проверяет прошло ли время

        const trust = await managerContract.trusts(user.address);
        const balance = await tokenUSDS.balanceOf(user);
        console.log("balance", balance);
        expect(trust.isActive).to.be.false; // Проверяем, что торговля остановлена
    });

});
