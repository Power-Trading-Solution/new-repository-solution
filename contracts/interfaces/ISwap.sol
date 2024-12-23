// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ISwap {
    function swapExactTokensForTokens(  //пользователь вводит сколько он хочет обменять, ему пишут сколько он за это получит
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path, //route, первый элемент в массиве - токен, который хотят поменять, а последний - токен, на который его хотят обменять
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(  //пользователь вводит, сколько ему нужно получить, ему пишут, сколько он должен отдать токенов
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path, //calldata - данные неизменяемы и хранятся в memory (непостоянная память)
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts); // External — функции этого типа являются частью интерфейса контракта, 
    //что значит они могут быть вызваны из других контрактов посредством message call. Вызванный контракт получит чистую копию memory 
    //и доступ к данным payload, которые будут расположены в отдельной секции — calldata. После завершения выполнения, возвращаемые данные будут размещены 
    //в заранее выделенном вызвавшим контрактом месте в memory.

    function getAmountsOut(
        uint256 amountIn, 
        address[] calldata path
    ) external view returns (uint256[] memory amounts);
}
