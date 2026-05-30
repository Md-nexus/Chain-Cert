# ⛓️ ChainCert — Decentralized Credential Verification Protocol

[![License: Custom Non-Commercial](https://img.shields.io/badge/License-Non--Commercial_&_Attribution-red.svg)](#-license-architecture)
[![Network: Ethereum Sepolia](https://img.shields.io/badge/Network-Ethereum_Sepolia-purple.svg)](https://sepolia.etherscan.io/)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-cyan.svg)](https://vitejs.dev/)
[![Deployment: Netlify](https://img.shields.io/badge/Deployment-Netlify-00AD9F.svg)](https://stirring-concha-e69322.netlify.app/)

An immutable, decentralized application (dApp) designed to combat resume and certification fraud. **ChainCert** allows academic institutions, corporations, and bootcamps to anchor digital credentials securely to the blockchain. By leveraging client-side cryptographic hashing, the protocol guarantees absolute data privacy while offering instant, single-click verification for employers without intermediaries.

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

1. Open the raw contract file found at `contracts/ChainCert.sol` within [Remix IDE](https://www.google.com/search?q=https://remix.ethereum.org).
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

## 📑 Core Smart Contract Logic Mapping

The backend implementation relies on high-efficiency mapping keys to execute reading routines in constant computational time, minimizing network resource consumption.

### Main Protocol Methods

* `issueCertificate(bytes32 _certHash, string _recipientName, string _courseName, string _issuingAuthority)`: Restricted explicitly to the deploying administrative node (`onlyOwner`). Seals validation data directly to the ledger structure.
* `verifyCertificate(bytes32 _certHash)`: Open read method accessible globally. Accepts a local client file calculation and securely evaluates validity, returning matching registration properties if validated.

---

## 📜 License Architecture

This repository is strictly protected under a **Custom Non-Commercial & Mandatory Attribution License**. Commercial exploitation, unauthorized sales, or uncredited redistribution of this software or its derivative architectural elements are strictly prohibited. See the `LICENSE` file for exact legal specifications.
