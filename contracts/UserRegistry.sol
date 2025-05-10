// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistry {
    struct UserInfo {
        address userAddress;
        uint256 commission; // Процент комиссии
    }

    UserInfo[] public users;
    mapping(address => bool) private isRegistered;

    constructor () {}

    // Добавление пользователя
    function addUser(address _userAddress, uint256 _commission) external {
        require(!isRegistered[_userAddress], "User already registered");
        users.push(UserInfo({userAddress: _userAddress, commission: _commission}));
        isRegistered[_userAddress] = true;
    }

    // Получение списка пользователей
    function getUsers() external view returns (UserInfo[] memory) {
        return users;
    }
}
