
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserRegistry Contract", function () {
  let UserRegistry, userRegistry, owner, user1, user2;

  before(async function () {
    // Получаем аккаунты
    [owner, user1, user2] = await ethers.getSigners();

    // Деплоим контракт
    const UserRegistryFactory = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistryFactory.deploy();
  });

  it("Should deploy the contract", async function () {
    expect(userRegistry.address).to.not.equal(0);
  });

  it("Should add a user", async function () {
    // Добавляем пользователя
    await userRegistry.connect(owner).addUser(user1.address, 10); // 10% комиссия

    // Проверяем, что пользователь добавлен
    const users = await userRegistry.getUsers();
    expect(users.length).to.equal(1);
    expect(users[0].userAddress).to.equal(user1.address);
    expect(users[0].commission).to.equal(10);
  });

  it("Should not allow adding the same user twice", async function () {
    // Пытаемся добавить пользователя снова
    await expect(
      userRegistry.connect(owner).addUser(user1.address, 10)
    ).to.be.revertedWith("User already registered");
  });

  it("Should add multiple users", async function () {
    // Добавляем второго пользователя
    await userRegistry.connect(owner).addUser(user2.address, 15); // 15% комиссия

    // Проверяем, что оба пользователя добавлены
    const users = await userRegistry.getUsers();
    expect(users.length).to.equal(2);
    expect(users[1].userAddress).to.equal(user2.address);
    expect(users[1].commission).to.equal(15);
  });

  it("Should return the correct list of users", async function () {
    // Получаем список пользователей
    const users = await userRegistry.getUsers();

    // Проверяем, что список содержит правильные данные
    expect(users.length).to.equal(2);
    expect(users[0].userAddress).to.equal(user1.address);
    expect(users[0].commission).to.equal(10);
    expect(users[1].userAddress).to.equal(user2.address);
    expect(users[1].commission).to.equal(15);
  });
});