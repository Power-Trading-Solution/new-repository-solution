import { expect } from "chai";
import hre from "hardhat";

describe("Swap", function () {
    var uniswap;
    var token0;
    var token1;
    var owner;
    var user;
    

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        //const MyTokenFirst = await ethers.getContractFactory("MyTokenFirst");
        token0 = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        //const MyTokenSecond = await hre.ethers.getContractFactory("MyTokenSecond");
        token1 = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"

        const MockUniswapV2 = await ethers.getContractFactory("Swap");
        uniswap = await MockUniswapV2.deploy(token0, token1);
    });

    it("should add liquidity correctly", async () => {
        /*await IERC20(token0).transfer(user.address, 1000);
        await token1.transfer(user.address, 1000);
        
        await token0.connect(user).approve(uniswap.address, 1000);
        await token1.connect(user).approve(uniswap.address, 1000);*/
        
        await uniswap.connect(user).addLiquidity(500, 500);

        const reserves = await uniswap.getReserves();
        
        expect(reserves[0]).to.equal(500);
        expect(reserves[1]).to.equal(500);
    });

    it("should swap tokens correctly", async () => {
        await token0.transfer(user.address, 1000);
        await token1.transfer(user.address, 1000);
        
        await token0.connect(user).approve(uniswap.address, 1000);
        await token1.connect(user).approve(uniswap.address, 1000);
        
        await uniswap.connect(user).addLiquidity(500, 500);

        // Swap token1 for token0
        await uniswap.connect(user).swap(100, token0.address);

        const reserves = await uniswap.getReserves();
        expect(reserves[0]).to.equal(400);
        expect(reserves[1]).to.equal(500);

        const userBalance0 = await token0.balanceOf(user.address);
        expect(userBalance0).to.equal(100);

        // Swap token0 for token1
        await uniswap.connect(user).swap(100, token1.address);

        const reservesAfterSecondSwap = await uniswap.getReserves();
        expect(reservesAfterSecondSwap[0]).to.equal(400);
        expect(reservesAfterSecondSwap[1]).to.equal(400);

        const userBalance1 = await token1.balanceOf(user.address);
        expect(userBalance1).to.equal(100);
    });

    it("should fail on insufficient reserves for swap", async () => {
        await token0.transfer(user.address, 1000);
        await token0.connect(user).approve(uniswap.address, 1000);
        
        await uniswap.connect(user).addLiquidity(500, 500);

        await expect(uniswap.connect(user).swap(600, token1.address)).to.be.revertedWith("Insufficient reserve for token0");
    });
});