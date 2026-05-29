// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @custom:security-contact your-email@example.com
contract BusinessCardNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

    uint256 private _tokenIdCounter;

    // Tracks whether an address has already minted
    mapping(address => bool) public hasMinted;

    string public defaultTokenURI = "ipfs://YOUR_METADATA_CID_HERE";

    constructor(address initialOwner)
        ERC721("BusinessCardNFT", "BCNFT")
        Ownable(initialOwner)
    {}

    /// @notice Public mint — one card per wallet, free
    function mintCard() public {
        require(!hasMinted[msg.sender], "BusinessCardNFT: You already have a Business Card!");
        hasMinted[msg.sender] = true;
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, defaultTokenURI);
    }

    /// @notice Owner-only mint for admin/airdrop use
    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// @notice Owner can update the default metadata URI
    function setDefaultTokenURI(string memory uri) public onlyOwner {
        defaultTokenURI = uri;
    }

    // ─── Required Overrides ───────────────────────────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}