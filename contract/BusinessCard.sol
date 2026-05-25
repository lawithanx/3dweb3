// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract BusinessCard is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("JCorp Digital Asset", "JCORP") Ownable(msg.sender) {}

    // 1. THE MINT FUNCTION (Max 1 Per Wallet)
    // There is an infinite total supply, but a user can only hold 1 at a time.
    function mintCard() public {
        // Enforce the Golden Rule: You can only mint if you currently own 0 cards!
        require(balanceOf(msg.sender) == 0, "You already have a Business Card!");
        
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
    }

    // Notice we completely deleted the _update function that blocked transfers!
    // The NFT is now 100% fully transferable, so it's never "stuck".

    // 2. THE DIGITAL ASSET POINTER
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        // This will point to your 3D digital asset metadata on IPFS
        return "https://my-portfolio.com/metadata.json";
    }
}
