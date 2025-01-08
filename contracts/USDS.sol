// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./MockERC20.sol";

contract USDS is MockERC20 {

    address public owner;
    

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(uint256 initialSupply) MockERC20("USDS", "USDS", initialSupply) {
        mint(msg.sender, initialSupply);

    }

    function mint(address to, uint256 amount) public {
        require(to != address(0), "Cannot mint to the zero address");
        totalSupply += amount;
        balanceOf[to] += amount;

        emit Transfer(address(0), to, amount);
    }
    
    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");
        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;

        emit Transfer(msg.sender, address(0), amount);
    }


}