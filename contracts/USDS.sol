// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDS is ERC20, Ownable {

    uint256 public tokensPerLETH;

    constructor(uint256 initialSupply, uint256 _tokensPerLETH) ERC20("USDS", "USDS") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        tokensPerLETH = _tokensPerLETH;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Send LETH to purchase tokens");
        uint256 tokensToBuy = msg.value * tokensPerLETH;
        require(balanceOf(owner()) >= tokensToBuy, "Not enough tokens available");
        _transfer(owner(), msg.sender, tokensToBuy);
    }

    function setTokensPerLETH(uint256 _tokensPerLETH) public onlyOwner {
        tokensPerLETH = _tokensPerLETH;
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }


}
