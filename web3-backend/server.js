require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545"; // Default to Anvil/Localhost
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!ADMIN_PRIVATE_KEY) {
    console.error("Missing ADMIN_PRIVATE_KEY in .env");
    process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

// Minimal ABI to query nonces
const ABI = [
    "function nonces(address owner) view returns (uint256)"
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// DB Helper
const DB_PATH = path.join(__dirname, 'db.json');
const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const saveDb = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    saveDb({ users: {} });
}

// Domain Separator Data (Must match Contract!)
const domain = {
    name: 'NihongoToken',
    version: '1',
    chainId: 11155111, // Sepolia Chain ID (hardcoded for now to match user's env)
    verifyingContract: CONTRACT_ADDRESS
};

const types = {
    MintRequest: [
        { name: 'user', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'lessonId', type: 'uint256' }
    ]
};

app.post('/lesson/complete', async (req, res) => {
    try {
        const { wallet, lessonId } = req.body;

        if (!wallet || !lessonId) {
            return res.status(400).json({ error: "Missing wallet or lessonId" });
        }

        // 1. Check local DB (optional - to preventing spamming backend)
        const db = getDb();
        if (!db.users[wallet]) db.users[wallet] = [];

        // Allow re-doing lessons? Maybe not for rewards. 
        // For now, let's just log it.
        if (db.users[wallet].includes(lessonId)) {
            console.log(`User ${wallet} already completed lesson ${lessonId}`);
            // In a real app, maybe return error or 0 amount.
        }

        // 2. Get Nonce from Contract
        const nonce = await contract.nonces(wallet);

        // 3. Define Reward Amount (e.g., 10 tokens)
        const amount = ethers.utils.parseUnits("10", 18); // 10 Tokens

        // 4. Sign Message
        const value = {
            user: wallet,
            amount: amount,
            nonce: nonce,
            lessonId: lessonId
        };

        // IMPORTANT: Verify ChainID matches provider
        const network = await provider.getNetwork();
        domain.chainId = network.chainId;

        const signature = await adminWallet._signTypedData(domain, types, value);

        // 5. Update Local DB
        if (!db.users[wallet].includes(lessonId)) {
            db.users[wallet].push(lessonId);
            saveDb(db);
        }

        console.log(`Signed reward for ${wallet}, lesson ${lessonId}, nonce ${nonce}`);

        res.json({
            signature,
            amount: amount.toString(),
            nonce: nonce.toString(),
            lessonId
        });

    } catch (error) {
        console.error("Error signing message:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Web3 Backend running on port ${PORT}`);
    console.log(`Admin Wallet: ${adminWallet.address}`);
    console.log(`Contract: ${CONTRACT_ADDRESS}`);
});
