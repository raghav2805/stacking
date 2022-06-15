//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract rewardToken is ERC20{

    constructor() ERC20("Rag" , "R"){
        _mint(msg.sender, 1000000 * 10**18);   //1000000 Eth
    }
}