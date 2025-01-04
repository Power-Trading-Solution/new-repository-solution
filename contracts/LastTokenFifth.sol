// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LastTokenFifth is ERC20, Ownable {

    uint256 public tokensPerLETH;
    uint256 public tokensPerUSDS;
    uint256 public tokensPerMTS;
    uint256 public tokensPerATT;
    uint256 public tokensPerATF;
    uint256 public tokensPerMTF;


    constructor(uint256 initialSupply, uint256 _tokensPerLETH, uint256 _tokensPerUSDS, uint256 _tokensPerMTS, uint256 _tokensPerATT, uint256 _tokensPerATF, uint256 _tokensPerMTF) 
    ERC20("LastTokenFifth", "LTF") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        tokensPerLETH = _tokensPerLETH;
        tokensPerUSDS = _tokensPerUSDS;
        tokensPerMTS = _tokensPerMTS;
        tokensPerATT = _tokensPerATT;
        tokensPerATF = _tokensPerATF;
        tokensPerMTF = _tokensPerMTF;
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

    function setTokensPerUSDS(uint256 _tokensPerUSDS) public onlyOwner {
        tokensPerUSDS = _tokensPerUSDS;
    }

    function setTokensPerMTS(uint256 _tokensPerMTS) public onlyOwner {
        tokensPerMTS = _tokensPerMTS;
    }

    function setTokensPerATT(uint256 _tokensPerATT) public onlyOwner {
        tokensPerATT = _tokensPerATT;
    }

    function setTokensPerATF(uint256 _tokensPerATF) public onlyOwner {
        tokensPerATF = _tokensPerATF;
    }

    function setTokensPerMTF(uint256 _tokensPerMTF) public onlyOwner {
        tokensPerMTF = _tokensPerMTF;
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }


}
