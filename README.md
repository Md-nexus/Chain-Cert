# ⛓️ ChainCert — Decentralized Credential Verification Protocol

[![License: Custom Non-Commercial](https://img.shields.io/badge/License-Non--Commercial_&_Attribution-red.svg)](#-license-architecture)
[![Network: Ethereum Sepolia](https://img.shields.io/badge/Network-Ethereum_Sepolia-purple.svg)](https://sepolia.etherscan.io/)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-cyan.svg)](https://vitejs.dev/)
[![Deployment: Netlify](https://img.shields.io/badge/Deployment-Netlify-00AD9F.svg)](https://stirring-concha-e69322.netlify.app/)

An immutable, decentralized application (dApp) engineered to eliminate credential and certificate fraud. **ChainCert** anchors digital credentials securely to the blockchain. By leveraging client-side cryptographic hashing, the protocol guarantees absolute data privacy while offering instant, single-click verification without centralized intermediaries.

🚀 **Live Production Demo:** [Launch ChainCert App](https://stirring-concha-e69322.netlify.app/)

---

## 📌 Key Architectural Pillars

* **Zero-Knowledge Privacy Alignment:** The application calculates a unique SHA-256 fingerprint of the document locally within the browser engine via the Web Crypto API. Raw files or personal identity attributes are never broadcasted or exposed to centralized servers.
* **Immutable Cryptographic Ledger:** Validated document signatures are anchored to a Solidity smart contract registry deployed on a public decentralized network, creating an unalterable proof of authority.
* **Tamper Detection:** If even a single character, pixel, or byte of data within an issued certificate is manipulated post-issuance, the generated runtime hash changes drastically, triggering an immediate validation failure on-chain.

---

## 🛠️ Tech Stack & Protocols

* **Smart Contracts:** Solidity `^0.8.20` (Gas-optimized registries using explicit `bytes32` mappings over intensive strings).
* **Frontend Interface:** React.js framework compiled through Vite, optimized with custom glassmorphic styling paradigms.
* **Web3 State Machinery:** Ethers.js (v6) protocol providers interacting natively with browser wallet engines (e.g., MetaMask).
* **Development Sandbox:** Remix IDE for runtime ledger compilation and isolated contract deployment pipelines.

---

## ⚡ Quick Start & Development Installation

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or higher suggested)
* An active Web3 browser extension interface (e.g., [MetaMask](https://metamask.io/)) provisioned with test funds from an Ethereum Sepolia Testnet Faucet.

### 1. Clone & Set Up Directory Space

```bash
git clone https://github.com/Md-nexus/chaincert.git
cd chaincert
```

### 2. Synchronize Dependencies

```bash
npm install
```

### 3. Deploy & Configure Your Smart Contract

1. Open the raw contract file found at `contracts/ChainCert.sol` within [Remix IDE](https://remix.ethereum.org).
2. Compile using a target version of `0.8.20` or higher.
3. Switch your deployment network tab to **Injected Provider - MetaMask** (Ensure your wallet extension is explicitly set to the **Sepolia Test Network**).
4. Deploy the contract and duplicate the resulting deployed hash string.
5. Open your local project directory, navigate to `src/App.jsx`, and patch your custom address line:

```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
```

### 4. Execute Local Development Subsystems

```bash
npm run dev
```

Open your local loopback address at `http://localhost:3000` to interact with your execution environment.

---

## 🛠️ Complete Web3 Installation & Deployment Flow (Detailed)

Follow these step-by-step instructions to configure your development workspace, bypass testnet restrictions, deploy the smart contract, and launch the frontend application.

### Step 1: Wallet Prep & Network Overrides
MetaMask hides test networks by default. You must unhide them to access the deployment pipeline:
1. Open your **MetaMask extension**.
2. Click the **Network Dropdown** menu in the top-left corner (defaults to "Ethereum Mainnet").
3. Toggle **"Show test networks"** to **ON**. If you do not see the toggle, go to **Settings ➡️ Advanced ➡️ Show test networks**.
4. Select **Sepolia** from the dropdown menu.

*⚠️ Troubleshooting Fallback: If Sepolia is missing entirely from your client list, click **Add Network ➡️ Add a network manually** and input these parameters:*
* **Network Name:** Sepolia Test Network
* **RPC URL:** `https://rpc.sepolia.org`
* **Chain ID:** `11155111`
* **Currency Symbol:** `ETH`
* **Block Explorer URL:** `https://sepolia.etherscan.io`

### Step 2: Acquiring Free Testnet Gas (Bypassing Faucet Balance Barriers)
Standard faucets (like Alchemy or QuickNode) enforce an "Anti-Sybil" check requiring a mainnet balance of real ETH to mitigate bot scripts. **To acquire testnet gas 100% free without a mainnet balance, use one of these developer bypasses:**

* **Bypass A: Proof-of-Work Mining Faucet (Recommended):** Navigate to `sepolia-faucet.pk910.de`. Paste your wallet address and click **Start Mining**. Your computer will perform light CPU-based calculations. After 2–5 minutes, click **Stop Mining & Claim Rewards** to receive your Sepolia ETH.
* **Bypass B: GitHub Authentication Faucet:** Navigate to `learnweb3.io/faucets/sepolia`. Authenticate with a free GitHub account to bypass the mainnet balance verification and receive your testnet drip instantly.

### Step 3: Smart Contract Deployment via Remix IDE
1. Open your browser and navigate to **[remix.ethereum.org](https://remix.ethereum.org)**.
2. In the left-hand File Explorer, create a new file named `ChainCert.sol`.
3. Copy the Solidity code located within the `/contracts` directory of this repo and paste it into the Remix editor window.
4. Select the **Solidity Compiler** tab (3rd icon down on the sidebar) and click **Compile ChainCert.sol** (Ensure compiler version is set to match `^0.8.20`).
5. Select the **Deploy & Run Transactions** tab (4th icon down on the sidebar).
6. Change the **Environment** dropdown from *Remix VM* to **Injected Provider - MetaMask**. Approve the incoming connection request from MetaMask.
7. Verify that the *Account* field displays your Sepolia wallet address, then click the orange **Deploy** button.
8. Confirm the gas transaction inside your MetaMask popup wallet.

### Step 4: Handling False-Positive Security Interceptions
Because you are interacting with a brand-new, unverified smart contract with zero global transaction history, MetaMask's automated security filter (**Blockaid**) will flag your transaction with a red warning screen reading: *"This is a deceptive request... a third party known for scams will take all your assets."*

**This is a false positive.** Your assets are completely secure. To authorize your contract deployment and function interactions, choose one of these routes:
* **The Quick Bypass:** On the warning banner, click **"See details"** ➡️ **"Proceed anyway"** or **"Continue at your own risk"**. This unlocks the standard verification screen, allowing you to click **Confirm**.
* **The Permanent Developer Tweak:** If you are actively modifying code and want to suppress recurrent alerts: Open MetaMask ➡️ **Settings** ➡️ **Security & Privacy** ➡️ Scroll down and switch the **"Security Alerts" (Powered by Blockaid)** toggle to **OFF**. *(Remember to turn this back on when interacting with untrusted, live web environments).*

### Step 5: Frontend Configuration & Compilation
1. Once the contract deployment transaction is confirmed, navigate to the bottom left of the Remix sidebar under **Deployed Contracts**. Click the **Copy** icon next to the contract entry to grab your live address string.
2. Open your local project code directory and open `src/App.jsx`.
3. Locate the contract definition on line 7:
```javascript
   const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```
Replace the placeholder string with your live deployed contract address and save the file.

Synchronize local workspace project dependencies and execute the development server:

```bash
npm install
npm run dev
```
Open your local web engine link at http://localhost:3000.

---

🚀 ## Production Hosting & Build Operations (Netlify)
To deploy your working build to a live public server using Netlify Drop without Git automation, avoid stale builds and credential locks by following this procedure:

1. **Compile the Distribution Bundle**
Whenever you modify your frontend code or change your `CONTRACT_ADDRESS` variable, you must re-generate your static build. If you skip this step, your deployed site will use a stale snapshot containing old placeholder values.

```bash
npm run build
```
This generates a newly updated, production-ready directory titled `/dist` in your root workspace.

2. **Resolving Password Prompts & Account Rules**
If your hosted Netlify site prompts visitors for a site-wide password, or locks anonymous uploads behind an unverified access barrier, apply these configuration remedies:

- **Remedy A: Eliminate Anonymous Drops**: Anonymous uploads via Netlify Drop often expire or require authorization checks. Go to [app.netlify.com](https://app.netlify.com), create a free account, log in, navigate to your team dashboard, click **Add New Site**, and drag your `/dist` folder into the secure upload drop zone. This guarantees a clean, public link with no password requirement.
- **Remedy B: Purge Inherited Auth Configuration Boilerplates**: Check your repository's root folder and `/public` folder for an inherited file named `_headers`. If this file contains a line defining `Basic-Auth: user:password`, it will force a password challenge on production builds. Delete the `_headers` file, execute `npm run build` again, and re-upload your distribution assets.

---

## 📂 System Topology

```text
chaincert/
├── contracts/
│   └── ChainCert.sol          # Immutable Ledger Validation Logic
├── src/
│   ├── utils/
│   │   └── crypto.js          # In-Browser SHA-256 State Calculation Engine
│   ├── App.jsx                # Main Web3 Dashboard UI Flow Matrix
│   ├── abi.json               # Contract Application Binary Interface
│   ├── main.jsx               # App Mount Entry Point
│   └── index.css              # Custom Premium Production Styling Definitions
├── package.json               # Modular Dependency Architecture
└── vite.config.js             # Compilation Asset Engine Definitions
```

---

## 📑 Core Smart Contract Logic Mapping

The backend implementation relies on high-efficiency mapping keys to execute reading routines in constant computational time, minimizing network resource consumption.

### Main Protocol Methods

- `issueCertificate(bytes32 _certHash, string _recipientName, string _courseName, string _issuingAuthority)`: Restricted explicitly to the deploying administrative node (`onlyOwner`). Seals validation data directly to the ledger structure.
- `verifyCertificate(bytes32 _certHash)`: Open read method accessible globally. Accepts a local client file calculation and securely evaluates validity, returning matching registration properties if validated.

---

## 📜 License Architecture

This repository is strictly protected under a **Custom Non-Commercial & Mandatory Attribution License**. Commercial exploitation, unauthorized sales, or uncredited redistribution of this software or its derivative architectural elements are strictly prohibited. See the `LICENSE` file for exact legal specifications.
