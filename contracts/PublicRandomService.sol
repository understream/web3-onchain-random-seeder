// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PublicRandomService is Ownable {

    uint256 public _seed;

    constructor() {
      _seed = block.timestamp + block.number + uint256(uint160(msg.sender)<<64);
    }

    receive() external payable {}
    
    function donate() external payable {}

    function rand( uint256 input ) public returns( uint256 ) {
      unchecked { 
      _seed = _seed + (_seed << 37) + input + (input << ((_seed % 13)+5)) + 0xaf103b572ade723621af450770b4c6fd5a2957 + (_seed >> 7) ^ (uint256(uint160(msg.sender))<<77)+(block.number << (_seed % 17)) + block.number;
      }
      return _seed;
    }

    function withdraw() public onlyOwner {
      payable(msg.sender).transfer(address(this).balance);
    }
}
