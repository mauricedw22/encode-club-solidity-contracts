// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeFi { 

 function contractState() external pure returns (string memory){
     return "created";
 }   

}

contract DAIMock is ERC20("XXX", "YYY"){ 

}