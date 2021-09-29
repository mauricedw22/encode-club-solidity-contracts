//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract VolcanoToken is ERC721("Volcano", "VCT"), Ownable {
    uint256 tokenID;

    struct Metadata {
        uint256 tokenID;
        uint256 timestamp;
        string tokenURI;
    }

    mapping(address => Metadata[]) public tokenOwnership;
    mapping(uint256 => uint256) IDsToIndex; //stores the index of this token in the mapping's array

    modifier onlyTokenHolder(uint256 _ID) {
        _checkForOwner(_ID, msg.sender);
        _;
    }

    function _checkForOwner(uint256 _ID, address _user) internal view {
        address tokenOwner = ERC721.ownerOf(_ID);
        require(_user == tokenOwner, "Caller must be token owner");
    }

    function _removeMetadata(uint256 _ID) internal onlyTokenHolder(_ID) {
        uint256 index = IDsToIndex[_ID];
        delete tokenOwnership[msg.sender][index];
    }

    function mint(address _user, string memory tokenURI) external {
        uint256 ID = tokenID++;
        _safeMint(_user, ID);
        Metadata memory newMetadata = Metadata({
            timestamp: block.timestamp,
            tokenID: ID,
            tokenURI: tokenURI
        });
        tokenOwnership[_user].push(newMetadata);
        IDsToIndex[ID] = tokenOwnership[_user].length - 1;
    }

    function burnToken(uint256 _ID) external onlyTokenHolder(_ID) {
        _removeMetadata(_ID);
        _burn(_ID);
    }
}