// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../lib/forge-std/src/Script.sol";
import "../src/NihongoToken.sol";
import "../src/NihongoShop.sol";

contract DeployNihongo is Script {
    function run() external {
        vm.startBroadcast();

        // 1. Deploy Token
        NihongoToken token = new NihongoToken();
        console.log("NihongoToken deployed at:", address(token));

        // 2. Deploy Shop (passing Token address)
        NihongoShop shop = new NihongoShop(address(token));
        console.log("NihongoShop deployed at:", address(shop));

        vm.stopBroadcast();
    }
}
