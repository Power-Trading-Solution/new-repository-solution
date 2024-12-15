// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CapitalManagement {

    address payable public owner;
    uint256 public totalCapital;

    // Структура для хранения информации о пользователях и их балансе
    struct User {
        address addr;
        uint256 balance;
    }

    // Массив для хранения информации о пользователях
    User[] public users;

    constructor() {
        owner = payable(msg.sender);
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Добавление капитала
    function addCapital(uint256 _amount) public payable onlyOwner {
        require(msg.value == _amount, "Sent amount doesn't match specified amount");
        totalCapital += _amount;
    }

    // Обмен токенов (пример - предполагается наличие внешнего контракта ERC20)
    /*function exchangeTokens(address _tokenAddress, uint256 _amount) public onlyOwner {
        // Здесь должна быть реализация обмена токенов, например, через взаимодействие с контрактом ERC20
        //  IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);  //  Пример, требует импорта IERC20
        //  Это место требует более подробной реализации в зависимости от конкретного токена и способа обмена
        require(true, "Exchange token implementation missing"); // Заглушка
    }*/


    // Функция для добавления пользователя (только для владельца)
    function addUser(address _userAddress) public onlyOwner {
      bool found = false;
      for (uint i = 0; i < users.length; i++) {
        if (users[i].addr == _userAddress) {
          found = true;
          break;
        }
      }
      if (!found) {
          users.push(User(_userAddress, 0));
      }
    }

    //Функция для добавления баланса пользователю (только для владельца)
    function addBalanceToUser(address _user, uint256 _amount) public onlyOwner {
        for (uint i = 0; i < users.length; i++) {
            if (users[i].addr == _user) {
                users[i].balance += _amount;
                return;
            }
        }
        revert("User not found");
    }

    //  Функция для получения баланса пользователя
    function getUserBalance(address _user) public view returns (uint256) {
        for (uint i = 0; i < users.length; i++) {
            if (users[i].addr == _user) {
                return users[i].balance;
            }
        }
        return 0;
    }


    //  Функция для вывода средств  -  только владелец!
    function withdraw(uint256 _amount) external onlyOwner {
        require(totalCapital >= _amount, "Insufficient capital");
        totalCapital -= _amount;
        payable(owner).transfer(_amount);
    }

}