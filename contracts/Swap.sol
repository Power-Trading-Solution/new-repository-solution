// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {MockERC20} from "./MockERC20.sol";
import "hardhat/console.sol";

contract Swap {

    address public tokenUSDS;
    address public tokenETH;
    uint public exchangeRate;

    constructor(address _tokenUSDS, address _tokenETH, uint _exchangeRate) {
        tokenUSDS = _tokenUSDS;
        tokenETH = _tokenETH;
        exchangeRate = _exchangeRate;
    }

    function approveTokens(address token, address spender, uint256 amount) external {
        MockERC20(token).approve(spender, amount);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address tokenIn,
        address tokenOut,
        address to
    ) external returns (uint256 amountOut){

        if (tokenIn == tokenUSDS)
            amountOut = amountIn * exchangeRate;
        else
            amountOut = amountIn / exchangeRate;

        require(amountOut >= amountOutMin, "Insufficient output amount");
    
        MockERC20(tokenIn).approve(address(this), amountIn);
        //approveTokens(tokenIn, amountIn);
        MockERC20(tokenIn).transferFrom(to, address(this), amountIn);
        MockERC20(tokenOut).transfer(to, amountOut);

        return amountOut;

    }

   
}