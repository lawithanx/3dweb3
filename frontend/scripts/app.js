// ============================================================
// app.js — Wallet connection & minting logic (ethers.js v6)
// ============================================================

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // ← update after deployment

// ABI: only the functions the frontend needs
const CONTRACT_ABI = [
    // Check if an address has already minted
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "hasMinted",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    // Public mint (one per wallet)
    {
        "inputs": [],
        "name": "mintCard",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // balanceOf for double-check
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    // tokenURI
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// ─── State ────────────────────────────────────────────────────────────────────
let provider = null;
let signer   = null;
let contract = null;
let userAddress = null;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const mintBtn    = document.getElementById("mintButton");
const statusEl   = document.getElementById("status");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setStatus(message, type = "info") {
    // type: "info" | "pending" | "success" | "error"
    statusEl.textContent = message;
    statusEl.className = "status-" + type;
}

function shortAddress(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// ─── Connect Wallet ───────────────────────────────────────────────────────────
async function connectWallet() {
    if (!window.ethereum) {
        setStatus("⚠️ MetaMask not found. Please install it.", "error");
        return false;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer   = await provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setStatus("✅ Wallet connected: " + shortAddress(userAddress), "success");
        return true;
    } catch (err) {
        setStatus("❌ Wallet connection rejected.", "error");
        return false;
    }
}

// ─── Mint Flow ────────────────────────────────────────────────────────────────
async function handleMintClick() {
    mintBtn.disabled = true;

    // Step 1: Connect wallet if not already connected
    if (!userAddress) {
        const connected = await connectWallet();
        if (!connected) {
            mintBtn.disabled = false;
            return;
        }
    }

    // Step 2: Check one-per-wallet restriction BEFORE sending tx
    try {
        setStatus("⏳ Checking eligibility...", "pending");
        const alreadyMinted = await contract.hasMinted(userAddress);
        if (alreadyMinted) {
            setStatus("🎴 You already have a JCorp Business Card!", "error");
            mintBtn.disabled = false;
            return;
        }
    } catch (err) {
        setStatus("❌ Could not read contract. Is it deployed? " + err.message, "error");
        mintBtn.disabled = false;
        return;
    }

    // Step 3: Send mint transaction
    try {
        setStatus("⏳ Minting... Please confirm in MetaMask.", "pending");
        const tx = await contract.mintCard();
        setStatus("⏳ Transaction sent. Waiting for confirmation...", "pending");
        await tx.wait();
        setStatus("🎉 Success! Your Business Card NFT has been minted!", "success");
    } catch (err) {
        // Parse readable error messages from common revert reasons
        const msg = err?.reason || err?.message || "Unknown error";
        if (msg.includes("already have a Business Card")) {
            setStatus("🎴 You already have a JCorp Business Card!", "error");
        } else if (msg.includes("user rejected")) {
            setStatus("❌ Transaction rejected in MetaMask.", "error");
        } else {
            setStatus("❌ Minting failed: " + msg, "error");
        }
    }

    mintBtn.disabled = false;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    setStatus("Click the button to connect your wallet and mint.", "info");
    mintBtn.addEventListener("click", handleMintClick);
});