// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

// Импортируем интерфейсы для взаимодействия с Uniswap
interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}



contract TokenSwap {
    address private owner;
    IUniswapV2Router02 public uniswapRouter;

    // Устанавливаем адрес Uniswap Router (для тестовой сети Rinkeby используем этот адрес)
    address private constant UNISWAP_ROUTER_ADDRESS = 0x5c69BEe701ef814A2b6a3eDD3b8b3D3e6c5f20c4;

    mapping(address => uint256) public balances;

    

    // Событие для отслеживания успешного обмена
    event TokensSwapped(address tokenIn, address tokenOut, uint amountIn, uint amountOut);

    constructor() {
        owner = msg.sender;
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Функция для обмена токенов
    function swapTokens(address tokenIn, address tokenOut, uint amountIn, uint amountOutMin) external onlyOwner {
        // Подтверждаем разрешение для обмена токенов
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);

        // Путь обмена токенов (из tokenIn в tokenOut)
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        // Выполняем обмен на Uniswap
        uint deadline = block.timestamp + 15 minutes; // Задаем дедлайн для транзакции
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this), // Отправляем токены обратно на этот контракт
            deadline
        );

        emit TokensSwapped(tokenIn, tokenOut, amountIn, amounts[1]);
    }

    // Функция для получения минимального количества токенов, которое можно получить за заданное количество токенов
    function getAmountOutMin(address tokenIn, address tokenOut, uint amountIn) external view returns (uint) {
        //address;
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        uint[] memory amountsOut = uniswapRouter.getAmountsOut(amountIn, path);
        return amountsOut[1];
    }

    /*// Функция для вывода токенов на адрес владельца контракта
    function withdrawTokens(address token, uint amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }*/

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(msg.sender).transfer(balances[owner]);
        balances[owner] = 0;
    }
}
