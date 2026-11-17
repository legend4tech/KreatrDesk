// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {KreatrDeskEscrowVault} from "../src/KreatrDeskEscrowVault.sol";

contract DeployKreatrDeskEscrowVault is Script {
    function run() external returns (MockUSDC usdc, KreatrDeskEscrowVault pot) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address relayerAddress = vm.envOr("RELAYER_ADDRESS", address(0));

        vm.startBroadcast(deployerPrivateKey);

        usdc = new MockUSDC();
        pot = new KreatrDeskEscrowVault(address(usdc));

        if (relayerAddress != address(0) && relayerAddress != vm.addr(deployerPrivateKey)) {
            usdc.mint(relayerAddress, 100_000 * 10 ** 6);
        }

        vm.stopBroadcast();

        console2.log("MockUSDC deployed at:", address(usdc));
        console2.log("KreatrDeskEscrowVault deployed at:", address(pot));
    }
}

