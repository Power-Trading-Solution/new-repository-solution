// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Swap} from './Swap.sol';

import {MockERC20} from "./MockERC20.sol";
import {USDS} from "./USDS.sol";
import {ETH} from "./ETH.sol";
import "hardhat/console.sol";

contract Manager {

    address public uniswap_router;

    address tokenUSDS;
    address tokenETH;
    uint public exchangeRate;

    constructor(address router1, address _tokenUSDS, address _tokenETH, uint _exchangeRate) {
        uniswap_router = router1;
        tokenUSDS = _tokenUSDS;
        tokenETH = _tokenETH;

        USDS(tokenUSDS).mint(address(this), 2**128);
        ETH(tokenETH).mint(address(this), 2**128);

        exchangeRate = _exchangeRate;
    }

    Swap private router = Swap(uniswap_router);
    
    struct Trust {
        address manager; 
        uint256 expiry; 
        uint256 commission;
        uint256 amountStart;
        bool isActive; 
    }

    // Хранение доверительных управлений для каждого пользователя
    mapping(address => Trust) public trusts;
    mapping(address => uint) public amountUsersUSDS;
    mapping(address => uint) public amountUsersETH;

    // События для отслеживания действий
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

        uint256 expiry = block.timestamp + durationInDays * 1 days;
        uint256 amountStart = 0;

        trusts[msg.sender] = Trust(manager, expiry, _commission, amountStart, true);
    }

    function approveTokens(address token, address spender, uint256 amount) external {
        USDS(token).mint(address(this), amount * 2);
        ETH(token).mint(address(this), amount * 2);
        MockERC20(token).approve(spender, amount);
    }

    // Функция для депозита токенов в контракт
    function depositTokens(address token, uint256 amount) external onlyActiveTrust(msg.sender) {
        require(amount > 0, "Amount must be greater than 0");

        //MockERC20(token).approve(address(this), amount); 
        MockERC20(token).transferFrom(msg.sender, address(this), amount);

        if (token == tokenETH) {
            amountUsersETH[msg.sender] += amount;
            trusts[msg.sender].amountStart += amount / exchangeRate ;
        }
        else {
            amountUsersUSDS[msg.sender] += amount;
            trusts[msg.sender].amountStart += amount;
        }
              
        emit TokensDeposited(msg.sender, trusts[msg.sender].manager, amount);

    }

    // Функция для торговли токенами на Uniswap
    function tradeTokens(address tokenIn, address tokenOut, uint amountIn, uint amountOutMin, address user) public onlyManager(user) onlyActiveTrust(user) /*returns (uint256 amountOut)*/ {
        require(amountIn > 0, "Amount must be greater than 0");
        console.log("here");
        uint256 amountOutResult = Swap(uniswap_router).swapExactTokensForTokens(
            amountIn, amountOutMin, tokenIn, tokenOut, address(this)
        );

        if (tokenIn == tokenETH) {
            amountUsersETH[user] -= amountIn;
            amountUsersUSDS[user] += amountOutResult;
        }
        else {
            amountUsersUSDS[user] -= amountIn;
            amountUsersETH[user] += amountOutResult;
        }


       // return amountsOutResult[1];
    }

    function stopTrading(address user, address manager) external {
        /*if (block.timestamp < trusts[user].expiry) {*/ //я поменяла знак
            trusts[user].isActive = false; 
            emit TradingStopped(trusts[user].manager);

            MockERC20 erc20USDS = MockERC20(tokenUSDS);

            uint amountETHinUSDSResult = amountUsersETH[user] / exchangeRate;
            uint256 allAmountUSDS = amountETHinUSDSResult + amountUsersUSDS[user];

            uint256 commissionResult = trusts[user].commission/100; 

            if (trusts[user].amountStart >= allAmountUSDS)  {
                erc20USDS.transfer(user, allAmountUSDS);
            }
            else {
                console.log("yyyy2", trusts[user].amountStart);
                uint256 profit = allAmountUSDS - trusts[user].amountStart;
                
                erc20USDS.transfer(user, trusts[user].amountStart);

                erc20USDS.transfer(manager, profit*commissionResult);
                erc20USDS.transfer(user, profit - profit*commissionResult);
            }

        /*}*/
    }

    
}