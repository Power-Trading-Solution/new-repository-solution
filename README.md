# DeFi Token Management and Swap System

This project is a decentralized finance (DeFi) system built on Ethereum using Solidity. It includes a set of ERC-20 tokens, a swap mechanism, and a manager contract that allows users to create trust-based trading accounts. The system supports multiple tokens and allows users to trade them via a custom swap contract.

## Contracts Overview

### 1. **Token Contracts**
The project includes several ERC-20 token contracts, each with customizable exchange rates between tokens and LETH (likely a placeholder for ETH). The tokens are:

- **USDS**: A stablecoin-like token with a fixed exchange rate.
- **MyTokenFirst (MTF)**: A customizable token with exchange rates for other tokens.
- **MyTokenSecond (MTS)**: Another customizable token with exchange rates for other tokens.
- **AnotherTokenThird (ATT)**: A token with exchange rates for other tokens.
- **AnotherTokenFourth (ATF)**: A token with exchange rates for other tokens.
- **LastTokenFifth (LTF)**: A token with exchange rates for other tokens.

Each token contract allows the owner to:
- Mint new tokens.
- Burn tokens.
- Set exchange rates for other tokens.
- Allow users to buy tokens using LETH.

### 2. **Swap Contract**
The `Swap` contract facilitates token swaps between different tokens. It supports:
- Adding liquidity to the swap pool.
- Swapping tokens based on predefined exchange rates.
- Calculating the expected output amount for a swap.

The swap contract interacts with the token contracts to ensure that swaps are executed at the correct exchange rates.

### 3. **Manager Contract**
The `Manager` contract is the core of the system, allowing users to create trust-based trading accounts. Key features include:
- **Trust Management**: Users can create a trust account, specifying a manager and a duration for the trust.
- **Token Deposits**: Users can deposit tokens into their trust account.
- **Trading**: The manager can trade tokens on behalf of the user using the swap contract.
- **Commission**: The manager earns a commission on profits generated from trading.
- **Stop Trading**: The trust can be stopped, and the remaining tokens are returned to the user, with profits distributed according to the commission structure.

### 4. **MockERC20 Contract**
This is a simple mock ERC-20 token contract used for testing purposes. It implements basic ERC-20 functionality, including transfers, approvals, and allowances.

## How to Use

### 1. **Deploying Tokens**
Deploy each token contract (`USDS`, `MyTokenFirst`, `MyTokenSecond`, etc.) with the desired initial supply and exchange rates.

### 2. **Deploying the Swap Contract**
Deploy the `Swap` contract, specifying the addresses of the tokens it will support. You can add liquidity to the swap pool by calling the `addLiquidity` function.

### 3. **Deploying the Manager Contract**
Deploy the `Manager` contract, specifying the addresses of the tokens and the swap contract. The manager contract will handle trust accounts and trading.

### 4. **Creating a Trust Account**
Users can create a trust account by calling the `createTrust` function on the `Manager` contract. They specify a manager, the duration of the trust, and the commission rate.

### 5. **Depositing Tokens**
Users can deposit tokens into their trust account by calling the `depositTokens` function on the `Manager` contract.

### 6. **Trading Tokens**
The manager can trade tokens on behalf of the user by calling the `tradeTokens` function on the `Manager` contract. The swap contract will handle the actual token exchange.

### 7. **Stopping the Trust**
When the trust period ends or the user decides to stop trading, the manager can call the `stopTrading` function to return the remaining tokens to the user and distribute any profits according to the commission structure.

## Example Workflow

1. Deploy the token contracts (`USDS`, `MTF`, `MTS`, etc.).
2. Deploy the `Swap` contract and add liquidity.
3. Deploy the `Manager` contract.
4. User A creates a trust account with Manager B.
5. User A deposits `MTF` tokens into the trust account.
6. Manager B trades `MTF` for `MTS` using the swap contract.
7. After the trust period ends, Manager B stops the trust, and User A receives the remaining tokens and profits.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## Contact

For any questions or support, please contact the project maintainer at [your-email@example.com](mailto:your-email@example.com).