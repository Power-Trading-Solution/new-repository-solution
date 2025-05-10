import { expect } from "chai";
import hre from "hardhat";
import assert from 'assert';
/*import Web3 from "web3"
const web3 = new Web3('http://127.0.0.1:8545');*/

describe("MyTokenFirst", function () {
    var MyToken;
    var myToken;
    var owner;
    var addr1;
    const tokensPerETH = 100;

    beforeEach(async function () {
        MyToken = await hre.ethers.getContractFactory("MyTokenFirst");
        [owner, addr1] = await ethers.getSigners();
        myToken = await MyToken.deploy(10000, 100);
    });

    it("Должен проверить имя токена", async function () {
        expect(await myToken.name()).to.equal("MyTokenFirst");
    });

    it("Должен проверить символ токена", async function () {
        expect(await myToken.symbol()).to.equal("MTF");
    });

    it("Должен проверить начальное количество токенов", async function () {
        const balance = await myToken.balanceOf(owner.address);
        expect(balance).to.equal(10000);
    });

    it("Владелец должен иметь возможность создавать токены", async function () {
        await myToken.mint(1000);
        const balance = await myToken.balanceOf(owner.address);
        expect(balance).to.equal(11000);
    });

    it("Должен позволить пользователю сжигать токены", async function () {
        await myToken.burn(1000);
        const balance = await myToken.balanceOf(owner.address);
        expect(balance).to.equal(9000);
    });

    it('должен правильно устанавливать курс токенов к ETH', async () => {
        const currentRate = await myToken.tokensPerLETH();
        //const currentRate = await myToken.connect(user).createTrust(manager.address, duration);
        //assert.equal(currentRate.toString(), tokensPerETH.toString(), 'Курс токенов не совпадает');
        expect(currentRate.toString()).to.equal(tokensPerETH.toString());
    });

    it('должен позволять владельцу изменить курс токенов', async () => {
        const newRate = 200; // 200 токенов за 1 ETH
        await myToken.connect(owner).setTokensPerLETH(newRate);

        const currentRate = await myToken.tokensPerLETH();
        assert.equal(currentRate.toString(), newRate.toString(), 'Курс токенов не обновился');
    });

    it('должен отклонять изменение курса, если не владелец делает запрос', async () => {
        const newRate = 200; // 200 токенов за 1 ETH
        try {
            await myToken.connect(addr1).setTokensPerLETH(newRate); // не владелец
            assert.fail('Должно было выбросить исключение');
        } catch (error) {
            assert(error.message.includes('caller is not the owner'), 'Ошибка не соответствует ожиданиям');
        }
    });
});

