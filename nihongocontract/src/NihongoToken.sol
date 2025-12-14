// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ECDSA} from "../lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

contract NihongoToken is ERC20, Ownable {
    using ECDSA for bytes32;

    // EIP-712 Domain Separator
    bytes32 public DOMAIN_SEPARATOR;
    
    // Mapping to prevent Replay Attacks (User -> Nonce)
    mapping(address => uint256) public nonces;

    // TypeHash for the struct: MintRequest(address user,uint256 amount,uint256 nonce,uint256 lessonId)
    bytes32 constant MINT_TYPEHASH = keccak256("MintRequest(address user,uint256 amount,uint256 nonce,uint256 lessonId)");

    event RewardClaimed(address indexed user, uint256 amount, uint256 indexed lessonId);

    constructor() ERC20("Nihongo Token", "NIHON") Ownable(msg.sender) {
        // Mint initial supply to Admin
        _mint(msg.sender, 1000 * 10**decimals());

        // Initialize Domain Separator
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("NihongoToken")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    /**
     * @dev Mint tokens using a server-generated signature (EIP-712).
     * @param amount The amount of tokens to mint.
     * @param nonce A unique number for this request.
     * @param lessonId The ID of the lesson being rewarded.
     * @param signature The cryptographic signature provided by the Admin.
     */
    function mintWithSignature(uint256 amount, uint256 nonce, uint256 lessonId, bytes calldata signature) external {
        // 1. Verify Nonce
        require(nonce == nonces[msg.sender], "Invalid nonce");

        // 2. Create Struct Hash
        bytes32 structHash = keccak256(abi.encode(
            MINT_TYPEHASH,
            msg.sender,
            amount,
            nonce,
            lessonId
        ));

        // 3. Create Digest (EIP-712 Message)
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            structHash
        ));

        // 4. Recover Signer from Signature
        address signer = digest.recover(signature);

        // 5. Verify Signer is Admin/Owner
        require(signer == owner(), "Invalid Signature");

        // 6. Execute Mint
        nonces[msg.sender]++; // Increment nonce to prevent replay
        _mint(msg.sender, amount);
        
        emit RewardClaimed(msg.sender, amount, lessonId);
    }
}
