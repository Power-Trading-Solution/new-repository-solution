// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import './interfaces/IERC20.sol';

contract InvestorContract {

    // Маппинг для хранения токенов пользователей
    mapping(address => mapping(address => uint256)) private userTokens;

    // Функция передачи токенов пользователем менеджеру
    function depositTokens(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Передаем токены на этот контракт
        // Здесь нужно использовать ERC20 токен интерфейс
        // Переводим токены от пользователя в контракт
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Обновляем баланс токенов пользователя
        userTokens[msg.sender][token] += amount;
    }

}