-include .env
export

deployNihongo:; forge script script/DeployNihongo.s.sol:DeployNihongo \
    --rpc-url $(RPC_URL) \
    --account $(ACCOUNT) \
    --broadcast \
    --verify \
    --verifier etherscan \
    --chain sepolia \
    --etherscan-api-key $(ETHERSCAN_API_KEY) \
    --delay 30 