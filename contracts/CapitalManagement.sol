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

    // Структура для истории операций
    struct Operation {
        address user;         // Адрес пользователя
        string operationType; // Тип операции ("AddCapital", "AddUser", "AddBalance", "Withdraw")
        uint256 amount;       // Сумма операции
        uint256 timestamp;    // Время операции
    }

    // Массив для хранения истории операций
    Operation[] public operations;

    // Массив для хранения информации о пользователях
    User[] public users;

    // События для операций
    event CapitalAdded(address indexed owner, uint256 amount, uint256 timestamp);
    event UserAdded(address indexed user, uint256 timestamp);
    event BalanceAdded(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed owner, uint256 amount, uint256 timestamp);

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

        // Запись операции в историю
        operations.push(Operation({
            user: msg.sender,
            operationType: "AddCapital",
            amount: _amount,
            timestamp: block.timestamp
        }));

        emit CapitalAdded(msg.sender, _amount, block.timestamp);
    }

    // Добавление пользователя
    function addUser(address _userAddress) public onlyOwner {
        bool found = false;
        for (uint i = 0; i < users.length; i++) {
            if (users[i].addr == _userAddress) {
                found = true;
                break;
            }
        }
        require(!found, "User already exists");

        users.push(User(_userAddress, 0));

        // Запись операции в историю
        operations.push(Operation({
            user: _userAddress,
            operationType: "AddUser",
            amount: 0,
            timestamp: block.timestamp
        }));

        emit UserAdded(_userAddress, block.timestamp);
    }

    // Добавление баланса пользователю
    function addBalanceToUser(address _user, uint256 _amount) public onlyOwner {
        for (uint i = 0; i < users.length; i++) {
            if (users[i].addr == _user) {
                users[i].balance += _amount;

                // Запись операции в историю
                operations.push(Operation({
                    user: _user,
                    operationType: "AddBalance",
                    amount: _amount,
                    timestamp: block.timestamp
                }));

                emit BalanceAdded(_user, _amount, block.timestamp);
                return;
            }
        }
        revert("User not found");
    }

    // Функция для вывода средств
    function withdraw(uint256 _amount) external onlyOwner {
        require(totalCapital >= _amount, "Insufficient capital");
        totalCapital -= _amount;
        payable(owner).transfer(_amount);

        // Запись операции в историю
        operations.push(Operation({
            user: msg.sender,
            operationType: "Withdraw",
            amount: _amount,
            timestamp: block.timestamp
        }));

        emit Withdrawal(msg.sender, _amount, block.timestamp);
    }

    // Получение всей истории операций
    function getOperations() public view returns (Operation[] memory) {
        return operations;
    }

    // Получение истории операций по пользователю
    function getOperationsByUser(address _user) public view returns (Operation[] memory) {
        uint256 count = 0;

        // Сначала считаем количество операций для пользователя
        for (uint i = 0; i < operations.length; i++) {
            if (operations[i].user == _user) {
                count++;
            }
        }

        // Заполняем массив операциями пользователя
        Operation[] memory userOperations = new Operation[](count);
        uint256 index = 0;
        for (uint i = 0; i < operations.length; i++) {
            if (operations[i].user == _user) {
                userOperations[index] = operations[i];
                index++;
            }
        }
        return userOperations;
    }
}
