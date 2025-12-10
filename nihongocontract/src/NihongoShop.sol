// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {SafeERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

contract NihongoShop is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public token;

    // Item structure
    struct Item {
        uint256 id;
        string name;
        uint256 price; // Price in Wei (smallest unit of token)
        bool exists;
    }

    mapping(uint256 => Item) public items;
    mapping(address => mapping(uint256 => bool)) public hasPurchased; // User -> ItemID -> Owned

    event ItemPurchased(address indexed buyer, uint256 itemId, uint256 price);
    event ItemAdded(uint256 itemId, string name, uint256 price);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
        
        // Initial Items (Token Shop Exclusives - Avatar Frames)
        addItem(1, "Frame 1", 20 * 10**18); 
        addItem(2, "Frame 2", 20 * 10**18); 
        addItem(3, "Frame 3", 30 * 10**18); 
        addItem(4, "Frame 4", 30 * 10**18);
    }

    function addItem(uint256 _id, string memory _name, uint256 _price) public onlyOwner {
        items[_id] = Item(_id, _name, _price, true);
        emit ItemAdded(_id, _name, _price);
    }

    function buyItem(uint256 _itemId) external {
        Item memory item = items[_itemId];
        require(item.exists, "Item does not exist");
        // SafeERC20 handles the check/revert for balance and allowance implicitly via safeTransferFrom if standard
        // But explicit check is good for UX reversions messages
        require(token.balanceOf(msg.sender) >= item.price, "Insufficient tokens");

        // Transfer tokens from User to Shop Owner
        token.safeTransferFrom(msg.sender, owner(), item.price);

        hasPurchased[msg.sender][_itemId] = true;
        
        emit ItemPurchased(msg.sender, _itemId, item.price);
    }
}
