// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {MyTokenFirst} from "./MyTokenFirst.sol";
import {MyTokenSecond} from "./MyTokenSecond.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {AnotherTokenThird} from "./AnotherTokenThird.sol";
import {AnotherTokenFourth} from "./AnotherTokenFourth.sol";
import {LastTokenFifth} from "./LastTokenFifth.sol";

contract Swap {
    address public token0;
    address public token1;
    uint256 public reserve0;
    uint256 public reserve1;

    MyTokenFirst public tokenMTF;
    MyTokenSecond public tokenMTS;
    AnotherTokenThird public tokenATT;
    AnotherTokenFourth public tokenATF;
    LastTokenFifth public tokenLTF;
    address public tokenUSDS;

    constructor(address _token0, address _token1, address _tokenMTF, address _tokenMTS, address _tokenATT, address _tokenATF, address _tokenLTF, address _tokenUSDS) {
        token0 = _token0;
        token1 = _token1;
        tokenMTF = MyTokenFirst(_tokenMTF);
        tokenMTS = MyTokenSecond(_tokenMTS);
        tokenATT = AnotherTokenThird(_tokenATT);
        tokenATF = AnotherTokenFourth(_tokenATF);
        tokenLTF = LastTokenFifth(_tokenLTF);
        tokenUSDS = _tokenUSDS;
    }

    function setTokens(address _token0, address _token1) external {
        token0 = _token0;
        token1 = _token1;
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external {
        require(IERC20(token0).transferFrom(msg.sender, address(this), amount0), "Transfer of token0 failed");
        require(IERC20(token1).transferFrom(msg.sender, address(this), amount1), "Transfer of token1 failed");

        reserve0 += amount0;
        reserve1 += amount1;
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserve0, reserve1);
    }

    function swap(uint256 amountIn, address tokenOut) external {
        require(amountIn > 0, "Amount in must be greater than zero");
        require(tokenOut == token0 || tokenOut == token1, "Invalid token for swap");

        if (tokenOut == token0) {
            require(reserve1 >= amountIn, "Insufficient reserve for token1");
            reserve1 -= amountIn;
            require(IERC20(token0).transfer(msg.sender, amountIn), "Transfer failed");
        } else {
            require(reserve0 >= amountIn, "Insufficient reserve for token0");
            reserve0 -= amountIn;
            require(IERC20(token1).transfer(msg.sender, amountIn), "Transfer failed");
        }
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint256[] memory amounts) {

        // Проверка, что путь содержит как минимум 2 токена
        require(path.length >= 2, "Invalid path");
    
        // Проверка, что текущий блок не превышает deadline
        require(block.timestamp <= deadline, "Transaction expired");

        uint256 amountOut = this.getAmountsOut(amountIn, path);
        require(amountOut >= amountOutMin, "Insufficient output amount");

        IERC20(path[0]).transferFrom(to, address(this), amountIn);
        IERC20(path[1]).transfer(to, amountOut);

        // Здесь можно добавить логику для мока функции
        // Например, просто возвращаем массив с начальным значением и увеличенным на 1
        amounts = new uint[](path.length);
        amounts[0] = amountIn; // например, суммы входящих токенов
        amounts[1] = amountOut; // предполагаемая сумма выходящих токенов, для примера

        return amounts;
    }

    function getAmountsOut(
        uint256 amountIn, 
        address[] calldata path
    ) external       view
returns (uint256 amount) {

        if (MyTokenSecond(path[0]) == tokenMTS) {
            if (MyTokenFirst(path[1]) == tokenMTF) 
                amount = amountIn*tokenMTS.tokensPerMTF();
            if (AnotherTokenThird(path[1]) == tokenATT)
                amount = amountIn*tokenMTS.tokensPerATT();
            if (AnotherTokenFourth(path[1])== tokenATF)
                amount = amountIn*tokenMTS.tokensPerATF();
            if (LastTokenFifth(path[1]) == tokenLTF)
                amount = amountIn*tokenMTS.tokensPerLTF();
            if (path[1] == tokenUSDS)
                amount = amountIn*tokenMTS.tokensPerUSDS();
        }

        if (MyTokenFirst(path[0]) == tokenMTF) {
            if (MyTokenSecond(path[1]) == tokenMTS)
                amount = amountIn*tokenMTF.tokensPerMTS();
            if (AnotherTokenThird(path[1]) == tokenATT)
                amount = amountIn*tokenMTF.tokensPerATT();
            if (AnotherTokenFourth(path[1])== tokenATF)
                amount = amountIn*tokenMTF.tokensPerATF();
            if (LastTokenFifth(path[1]) == tokenLTF)
                amount = amountIn*tokenMTF.tokensPerLTF();
            if (path[1] == tokenUSDS)
                amount = amountIn*tokenMTF.tokensPerUSDS();
        }

        if (AnotherTokenThird(path[0]) == tokenATT) {
            if (MyTokenSecond(path[1]) == tokenMTS)
                amount = amountIn*tokenATT.tokensPerMTS();
            if (MyTokenFirst(path[1]) == tokenMTF) 
                amount = amountIn*tokenATT.tokensPerMTF();
            if (AnotherTokenFourth(path[1])== tokenATF)
                amount = amountIn*tokenATT.tokensPerATF();
            if (LastTokenFifth(path[1]) == tokenLTF)
                amount = amountIn*tokenATT.tokensPerLTF();
            if (path[1] == tokenUSDS)
                amount = amountIn*tokenATT.tokensPerUSDS();
        }

        if (AnotherTokenFourth(path[0]) == tokenATF) {
            if (MyTokenSecond(path[1]) == tokenMTS)
                amount = amountIn*tokenATF.tokensPerMTS();
            if (MyTokenFirst(path[1]) == tokenMTF) 
                amount = amountIn*tokenATF.tokensPerMTF();
            if (AnotherTokenThird(path[1]) == tokenATT)
                amount = amountIn*tokenATF.tokensPerATT();
            if (LastTokenFifth(path[1]) == tokenLTF)
                amount = amountIn*tokenATF.tokensPerLTF();
            if (path[1] == tokenUSDS)
                amount = amountIn*tokenATF.tokensPerUSDS();
        }

        if (LastTokenFifth(path[0]) == tokenLTF) {
            if (MyTokenSecond(path[1]) == tokenMTS)
                amount = amountIn*tokenLTF.tokensPerMTS();
            if (MyTokenFirst(path[1]) == tokenMTF) 
                amount = amountIn*tokenLTF.tokensPerMTF();
            if (AnotherTokenThird(path[1]) == tokenATT)
                amount = amountIn*tokenLTF.tokensPerATT();
            if (AnotherTokenFourth(path[1])== tokenATF)
                amount = amountIn*tokenLTF.tokensPerATF();
            if (path[1] == tokenUSDS)
                amount = amountIn*tokenLTF.tokensPerUSDS();
        }

        if (path[0] == tokenUSDS) {
            if (MyTokenSecond(path[1]) == tokenMTS)
                amount = amountIn*tokenMTS.tokensPerUSDS();
            if (MyTokenFirst(path[1]) == tokenMTF) 
                amount = amountIn*tokenMTF.tokensPerUSDS();
            if (AnotherTokenThird(path[1]) == tokenATT)
                amount = amountIn*tokenATT.tokensPerUSDS();
            if (AnotherTokenFourth(path[1])== tokenATF)
                amount = amountIn*tokenATF.tokensPerUSDS();
            if (LastTokenFifth(path[1]) == tokenLTF)
                amount = amountIn*tokenLTF.tokensPerUSDS();
        }
    }
}