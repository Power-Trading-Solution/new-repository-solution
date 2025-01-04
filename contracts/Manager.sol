// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Swap} from './Swap.sol';
import './interfaces/IERC20.sol';
import './interfaces/IWETH.sol';

import {MyTokenFirst} from "./MyTokenFirst.sol";
import {MyTokenSecond} from "./MyTokenSecond.sol";
import {AnotherTokenThird} from "./AnotherTokenThird.sol";
import {AnotherTokenFourth} from "./AnotherTokenFourth.sol";
import {LastTokenFifth} from "./LastTokenFifth.sol";

contract Manager {

    address uniswap_router;
    address token0;
    address token1;
    address token2;
    address token3;
    address token4;
    address tokenUSDS;

    constructor(address router1, address t0, address t1, address t2, address t3, address t4, address _tokenUSDS) {
        uniswap_router = router1;
        token0 = t0;
        token1 = t1;
        token2 = t2;
        token3 = t3;
        token4 = t4;
        tokenUSDS = _tokenUSDS;
    }

    Swap private router = Swap(uniswap_router);
    MyTokenFirst tokenMTF = MyTokenFirst(token0);
    MyTokenSecond tokenMTS = MyTokenSecond(token1);
    AnotherTokenThird tokenATT = AnotherTokenThird(token2);
    AnotherTokenFourth tokenATF = AnotherTokenFourth(token3);
    LastTokenFifth tokenLTF = LastTokenFifth(token4);

    // Структура для хранения информации о доверительном управлении
    struct Trust {
        address manager; // Адрес пользователя
        uint256 expiry; // Срок действия доверительного управления
        uint256 commission;
        address[] tokenAddressesStart;
        uint256[] amountsStart;
        address[] tokenAddresses;
        uint256[] amounts;
        bool isActive; // Активно ли доверительное управление
    }

    // Хранение доверительных управлений для каждого пользователя
    mapping(address => Trust) public trusts;

    // События для отслеживания действий
    //event TokensDeposited(address indexed manager, address indexed user);
    event TokensDeposited(address indexed user, address indexed manager, uint256 amount);
    event TokensReceived(address token, address sender, uint256 amount);
    event TradingEnabled(address indexed user, uint256 expiry);
    event TradingStopped(address indexed manager);
    event TradingStarted(address indexed user);

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

    function startTrading(uint256 durationInDays) external {
        uint256 expiry = block.timestamp + durationInDays * 1 days;

        emit TradingEnabled(msg.sender, expiry);
    }

    // Функция для создания доверительного управления (создает инвестор)
    function createTrust(address manager, uint256 durationInDays, uint256 _commission) external {
        require(trusts[msg.sender].manager == address(0), "Trust already exists");
        require(manager != address(0), "Invalid user address");

        // Устанавливаем срок действия доверительного управления
        uint256 expiry = block.timestamp + durationInDays * 1 days;
        address[] memory tokenAddresses;
        uint256[] memory amounts;
        address[] memory tokenAddressesStart;
        uint256[] memory amountsStart;
        trusts[msg.sender] = Trust(manager, expiry, _commission, tokenAddresses, amounts, tokenAddressesStart, amountsStart, true);

    }

    // Функция для депозита токенов в контракт
    function depositTokens(address token, uint256 amount) external onlyActiveTrust(msg.sender) {
        require(amount > 0, "Amount must be greater than 0");
        
        // Передаем токены на этот контракт
        // Здесь нужно использовать ERC20 токен интерфейс
        // Переводим токены от пользователя в контракт
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        address[] memory tokens = trusts[msg.sender].tokenAddresses;
        //address[] memory tokensStart = trusts[msg.sender].tokenAddressesStart;
        
        for (uint i = 0; i < tokens.length; i++) {
            if (tokens[i] == token) {
                trusts[msg.sender].amounts[i] += amount;
                trusts[msg.sender].amountsStart[i] += amount;
            }
            else {
                trusts[msg.sender].tokenAddresses.push(token);
                trusts[msg.sender].amounts.push(amount);

                trusts[msg.sender].tokenAddressesStart.push(token);
                trusts[msg.sender].amountsStart.push(amount);
            }
        }
              
        emit TokensDeposited(msg.sender, trusts[msg.sender].manager, amount);

    }

    // Функция для торговли токенами на Uniswap
    function tradeTokens(address tokenIn, address tokenOut, uint amountIn, uint amountOutMin, address user) public onlyManager(user) onlyActiveTrust(user) returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");

        /*IERC20 tmpTokenIn = IERC20(tokenIn);

        tmpTokenIn.transferFrom(msg.sender, address(this), amountIn);
        tmpTokenIn.approve(address(router), amountIn);*/

        // Обмен токенов на Uniswap
        address[] memory path = new address[](2);

        path[0] = tokenIn;
        path[1] = tokenOut;
        uint256[] memory amountsOutResult = router.swapExactTokensForTokens(
            amountIn, amountOutMin, path, address(this), block.timestamp
        );

        bool existOut = false;
        bool existIn = false;
        for (uint i = 0 ; i < trusts[user].tokenAddresses.length; i++) {
            if (trusts[user].tokenAddresses[i] == tokenIn) {
                trusts[user].amounts[i] -= amountsOutResult[0];
                existIn = true;
            }
            
            if (trusts[user].tokenAddresses[i] == tokenOut) {
                trusts[user].amounts[i] += amountsOutResult[1];
                existOut = true;
            }

        }

        if (!existOut && existIn) {
            trusts[user].tokenAddresses.push(tokenOut);
            trusts[user].amounts.push(amountsOutResult[1]);
            trusts[user].amountsStart.push(0);
        }

        // Убеждаемся, что этот контракт разрешен на использование токенов
        return amountsOutResult[1];
    }

    function stopTrading(address user, address manager) external {
        if (block.timestamp < trusts[user].expiry) {
            trusts[user].isActive = false; // Отключаем доверительное управление
            emit TradingStopped(trusts[user].manager);

            IERC20 ierc20USDS = IERC20(tokenUSDS);

            for (uint i = 0; i < trusts[user].tokenAddresses.length; i++) {
                address token = trusts[user].tokenAddresses[i];
                uint256 amount = trusts[user].amounts[i];

                address[] memory path = new address[](2);

                path[0] = token;
                path[1] = tokenUSDS;

                uint256 amountOutMin;
                uint256 amountStartInUSDS;

                if (token == token0) {
                    amountOutMin = amount * tokenMTF.tokensPerUSDS();
                    amountStartInUSDS = trusts[user].amountsStart[i] * tokenMTF.tokensPerUSDS();
                }
                if (token == token1) {
                    amountOutMin = amount * tokenMTS.tokensPerUSDS();
                    amountStartInUSDS = trusts[user].amountsStart[i] * tokenMTS.tokensPerUSDS();
                }
                if (token == token2) {
                    amountOutMin = amount * tokenATT.tokensPerUSDS();
                    amountStartInUSDS = trusts[user].amountsStart[i] * tokenATT.tokensPerUSDS();
                }
                if (token == token3) {
                    amountOutMin = amount * tokenATF.tokensPerUSDS();
                    amountStartInUSDS = trusts[user].amountsStart[i] * tokenATF.tokensPerUSDS();
                }
                if (token == token4) {
                    amountOutMin = amount * tokenLTF.tokensPerUSDS();
                    amountStartInUSDS = trusts[user].amountsStart[i] * tokenLTF.tokensPerUSDS();
                }

                uint256 commissionResult = trusts[user].commission/100;
                
                
                ierc20USDS.approve(address(router), amountOutMin);
                //вместо токена тут будет уже USDS
                if (trusts[user].amountsStart[i] >= amount) {
                    ierc20USDS.transfer(user, amountOutMin);
                }

                if (trusts[user].amountsStart[i] < amount) {
                    uint256 profit = amountOutMin - amountStartInUSDS;

                    ierc20USDS.transfer(user, amountStartInUSDS);

                    ierc20USDS.transfer(manager, profit*commissionResult);
                    ierc20USDS.transfer(user, profit - profit*commissionResult);
                }
                
                
                
            }

            //IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
    }

    
}