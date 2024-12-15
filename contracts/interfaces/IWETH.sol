// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import './IERC20.sol';

interface IWETH is IERC20 {
    function deposit() external payable; //Payable в Solidity — это модификатор для функций, 
    //которые могут получать эфир вместе с вызовом функции. Без этого модификатора функция не сможет 
    //принимать переводы эфира, а отправка эфира в такую функцию приведёт к исключению
    function withdraw(uint256 amount) external; //вывод денег
}