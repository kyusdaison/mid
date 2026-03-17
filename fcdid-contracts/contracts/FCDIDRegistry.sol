// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FCDIDRegistry is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Pricing (in native FCC tokens, assuming 18 decimals)
    uint256 public constant PRICE_PREMIUM = 3500 ether; // 1-3 chars
    uint256 public constant PRICE_MID = 1000 ether;     // 4 chars
    uint256 public constant PRICE_STANDARD = 100 ether; // 5+ chars

    // Commit / Reveal timing
    uint256 public constant MIN_COMMIT_AGE = 1 minutes;
    uint256 public constant MAX_COMMIT_AGE = 24 hours;

    // State Variables
    uint256 private _nextTokenId;
    
    // Commitments: hash => block.timestamp
    mapping(bytes32 => uint256) public commitments;
    
    // Registered domains: name => tokenId
    mapping(string => uint256) public nameToTokenId;
    
    // Token details
    mapping(uint256 => string) public tokenIdToName;
    mapping(uint256 => uint256) public tokenExpiry;

    event CommitmentMade(bytes32 indexed commitment, uint256 timestamp);
    event DomainRegistered(string name, uint256 indexed tokenId, address indexed owner, uint256 expiry);
    event DomainRenewed(string name, uint256 indexed tokenId, uint256 newExpiry);

    constructor(address initialOwner) ERC721("Montserrat FCDID", "FCDID") Ownable(initialOwner) {
        _nextTokenId = 1; // Start token IDs at 1
    }

    /**
     * @dev Step 1 of registration: Commit a hashed intention to register a name.
     * Prevents front-running by hiding the name being registered.
     * @param commitment = keccak256(abi.encodePacked(name, msg.sender, salt))
     */
    function commit(bytes32 commitment) external {
        require(commitments[commitment] == 0 || commitments[commitment] + MAX_COMMIT_AGE < block.timestamp, "Already committed");
        commitments[commitment] = block.timestamp;
        emit CommitmentMade(commitment, block.timestamp);
    }

    /**
     * @dev Step 2 of registration: Reveal the name and salt, pay the fee, and mint the NFT.
     */
    function register(string calldata name, bytes32 salt, uint256 durationYears) external payable {
        // 1. Verify Commitment
        bytes32 commitment = keccak256(abi.encodePacked(name, msg.sender, salt));
        uint256 commitTime = commitments[commitment];
        
        require(commitTime > 0, "No commitment found");
        require(block.timestamp >= commitTime + MIN_COMMIT_AGE, "Commitment too new, wait 1 minute");
        require(block.timestamp <= commitTime + MAX_COMMIT_AGE, "Commitment expired");

        // 2. Consume commitment to prevent reuse
        delete commitments[commitment];

        // 3. Verify availability
        require(nameToTokenId[name] == 0, "Domain already registered");
        require(bytes(name).length > 0, "Invalid name length");
        require(durationYears > 0 && durationYears <= 10, "Invalid duration");

        // 4. Verify Payment
        uint256 pricePerYear = getPrice(name);
        uint256 totalPrice = pricePerYear * durationYears;
        require(msg.value >= totalPrice, "Insufficient payment");

        // 5. Minting
        uint256 tokenId = _nextTokenId++;
        nameToTokenId[name] = tokenId;
        tokenIdToName[tokenId] = name;
        
        uint256 expiry = block.timestamp + (durationYears * 365 days);
        tokenExpiry[tokenId] = expiry;

        _safeMint(msg.sender, tokenId);

        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit DomainRegistered(name, tokenId, msg.sender, expiry);
    }

    /**
     * @dev Calculates the price based on string length.
     * In Solidity, string length is byte length, so ASCII is assumed 1 char = 1 byte.
     */
    function getPrice(string memory name) public pure returns (uint256) {
        uint256 len = bytes(name).length;
        if (len <= 3) {
            return PRICE_PREMIUM;
        } else if (len == 4) {
            return PRICE_MID;
        } else {
            return PRICE_STANDARD;
        }
    }

    /**
     * @dev Renew an existing unexpired domain
     */
    function renew(string calldata name, uint256 durationYears) external payable {
        uint256 tokenId = nameToTokenId[name];
        require(tokenId != 0, "Domain not registered");
        require(ownerOf(tokenId) == msg.sender, "Not domain owner");
        require(durationYears > 0 && durationYears <= 10, "Invalid duration");

        uint256 pricePerYear = getPrice(name);
        uint256 totalPrice = pricePerYear * durationYears;
        require(msg.value >= totalPrice, "Insufficient payment");

        tokenExpiry[tokenId] += (durationYears * 365 days);

        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit DomainRenewed(name, tokenId, tokenExpiry[tokenId]);
    }

    /**
     * @dev Withdraw collected fees to the owner.
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}
