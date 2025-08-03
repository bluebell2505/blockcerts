// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateIssuer is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("AcademicCertificate", "CERT") Ownable(msg.sender) {}

    function issueCertificate(address recipient, string memory metadataURI) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);
        nextTokenId++;
    }
}
