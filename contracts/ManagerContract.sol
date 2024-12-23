// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {ISwap} from './interfaces/ISwap.sol';
import './interfaces/IERC20.sol';
import './interfaces/IWETH.sol';

contract ManagerContract {

    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    ISwap private router = ISwap(UNISWAP_V2_ROUTER);

    // Структура для хранения информации о доверительном управлении
    struct Trust {
        address manager; // Адрес менеджера
        uint256 expiry; // Срок действия доверительного управления
        bool isActive; // Активно ли доверительное управление
    }

    // Хранение доверительных управлений для каждого пользователя
    mapping(address => Trust) public trusts;

    // События для отслеживания действий
    event TokensDeposited(address indexed user, address indexed manager, uint256 amount);
    event TradingEnabled(address indexed manager, uint256 expiry);
    event TradingStopped(address indexed manager);

    // Модификатор для проверки, что функция вызывается менеджером
    modifier onlyManager(address user) {
        require(msg.sender == trusts[user].manager, "Not the manager");
        _;
    }
    
    // Модификатор для проверки, что доверительное управление активно
    modifier onlyActiveTrust(address user) {
        require(trusts[user].isActive, "No active trust found");
        require(block.timestamp < trusts[user].expiry, "Trust period has expired");
        _;
    }

    // Функция для создания доверительного управления
    function createTrust(address manager, uint256 durationInDays) external {
        require(trusts[msg.sender].manager == address(0), "Trust already exists");
        require(manager != address(0), "Invalid manager address");

        // Устанавливаем срок действия доверительного управления
        uint256 expiry = block.timestamp + durationInDays * 1 days;
        trusts[msg.sender] = Trust(manager, expiry, true);
        
        emit TradingEnabled(manager, expiry);
    }

    // Функция для депозита токенов в контракт
    function depositTokens(address token, uint256 amount) external onlyActiveTrust(msg.sender) {
        require(amount > 0, "Amount must be greater than 0");
        
        // Передаем токены на этот контракт
        // Здесь нужно использовать ERC20 токен интерфейс
        // Переводим токены от пользователя в контракт
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        emit TokensDeposited(msg.sender, trusts[msg.sender].manager, amount);
    }

    // Функция для торговли токенами на Uniswap
    function tradeTokens(address tokenIn, address tokenOut, uint amountIn) public /*onlyManager(msg.sender)*/ returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");

        IERC20 tmpTokenIn = IERC20(tokenIn);

        tmpTokenIn.transferFrom(msg.sender, address(this), amountIn);
        tmpTokenIn.approve(address(router), amountIn);

        // Обмен токенов на Uniswap
        address[] memory path = new address[](2);

        path[0] = tokenIn;
        path[1] = tokenOut;

        uint256[] memory amounts = router.getAmountsOut(amountIn, path);

        uint256[] memory amountsOutResult = router.swapExactTokensForTokens(
            amountIn, amounts[1], path, msg.sender, block.timestamp
        );

        // Убеждаемся, что этот контракт разрешен на использование токенов
        return amountsOutResult[1];
    }

    function stopTrading(address user) external {
        if (block.timestamp < trusts[user].expiry) {
            trusts[user].isActive = false; // Отключаем доверительное управление
            emit TradingStopped(trusts[user].manager);
        }
    }

    
}