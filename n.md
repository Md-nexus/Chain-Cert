## 1. System Architecture & Directory Layout

Code output
File created successfully at chaincert-project-spec.md

```text
chaincert/
├── package.json
├── vite.config.js
├── index.html
├── contracts/
│   └── ChainCert.sol
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── abi.json
│   └── utils/
│       └── crypto.js
└── README.md
2. Smart Contract Layer
The backend logic is handled by a gas-optimized Solidity smart contract. It maps a cryptographic SHA-256 hash of a certificate file directly to its issuance metadata on-chain.

contracts/ChainCert.sol
Solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChainCert
 * @dev Decentralized Registry for Verifiable Academic & Professional Credentials
 */
contract ChainCert {
    address public owner;

    struct Certificate {
        string recipientName;
        string courseName;
        string issuingAuthority;
        uint256 issueDate;
        bool isValid;
    }

    // Mapping of SHA-256 File Hashes (bytes32) to Certificate Metadata
    mapping(bytes32 => Certificate) private certificates;

    // Events
    event CertificateIssued(bytes32 indexed certHash, string recipientName, string courseName, string issuingAuthority);
    event CertificateRevoked(bytes32 indexed certHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "ChainCert: Only the contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Issue a new cryptographic certificate registry entry
     * @param _certHash The SHA-256 hash of the certificate document
     * @param _recipientName Full name of the recipient
     * @param _courseName Name of the degree, certification, or course
     * @param _issuingAuthority Name of the school, university, or organization
     */
    function issueCertificate(
        bytes32 _certHash,
        string calldata _recipientName,
        string calldata _courseName,
        string calldata _issuingAuthority
    ) external onlyOwner {
        require(!certificates[_certHash].isValid, "ChainCert: Certificate hash already registered");
        require(_certHash != bytes32(0), "ChainCert: Invalid certificate hash");

        certificates[_certHash] = Certificate({
            recipientName: _recipientName,
            courseName: _courseName,
            issuingAuthority: _issuingAuthority,
            issueDate: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(_certHash, _recipientName, _courseName, _issuingAuthority);
    }

    /**
     * @notice Revoke an existing certificate registry entry due to error or disciplinary action
     * @param _certHash The SHA-256 hash of the certificate document
     */
    function revokeCertificate(bytes32 _certHash) external onlyOwner {
        require(certificates[_certHash].isValid, "ChainCert: Certificate does not exist or is already invalid");
        certificates[_certHash].isValid = false;
        emit CertificateRevoked(_certHash);
    }

    /**
     * @notice Public function to verify the authenticity of a document hash
     * @param _certHash The SHA-256 hash generated from the uploaded file
     */
    function verifyCertificate(bytes32 _certHash) external view returns (
        string memory recipientName,
        string memory courseName,
        string memory issuingAuthority,
        uint256 issueDate,
        bool isValid
    ) {
        Certificate memory cert = certificates[_certHash];
        require(cert.isValid, "ChainCert: Certificate hash not found or has been revoked");
        return (cert.recipientName, cert.courseName, cert.issuingAuthority, cert.issueDate, cert.isValid);
    }
}
3. Configuration & Dependency Layer
package.json
JSON
{
  "name": "chaincert",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "ethers": "^6.13.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.1"
  }
}
vite.config.js
JavaScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
index.html
HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ChainCert — Decentralized Verification Protocol</title>
    <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
    <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
    <link href="[https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap)" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
4. Frontend Application Layer
src/main.jsx
JavaScript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
src/utils/crypto.js
This helper uses the browser's native Web Crypto API to generate a standard SHA-256 string from any file array buffer asynchronously without external bloating libraries.

JavaScript
/**
 * Generates a SHA-256 hash string from a File object
 * @param {File} file 
 * @returns {Promise<string>} Hex representation of the SHA-256 hash prefixed with 0x
 */
export const calculateFileHash = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve('0x' + hashHex);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
src/abi.json
Compiled application binary interface (ABI) matching the Solidity implementation for frontend runtime interactions.

JSON
[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "recipientName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "issuingAuthority",
        "type": "string"
      }
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certHash",
        "type": "bytes32"
      }
    ],
    "name": "CertificateRevoked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_certHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_recipientName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_courseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_issuingAuthority",
        "type": "string"
      }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_certHash",
        "type": "bytes32"
      }
    ],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_certHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [
      {
        "internalType": "string",
        "name": "recipientName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "issuingAuthority",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
src/App.jsx
Main dashboard frontend logic. It includes wallet connection handling, responsive tab layout systems, drag-and-drop file readers, SHA-256 client side processing, and state display blocks.

JavaScript
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { calculateFileHash } from './utils/crypto';
import contractAbi from './abi.json';

// Paste your deployed smart contract address here after deployment
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

function App() {
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' or 'issue'
  const [account, setAccount] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields for Issuance
  const [issueForm, setIssueForm] = useState({
    recipientName: '',
    courseName: '',
    issuingAuthority: '',
    file: null,
    computedHash: ''
  });

  // Verification State
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifiedCert, setVerifiedCert] = useState(null);

  // Connect Web3 Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      showStatus('error', 'MetaMask or a Web3 wallet extension was not detected.');
      return;
    }
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      showStatus('success', 'Wallet successfully synchronized.');
    } catch (err) {
      showStatus('error', err.message || 'Failed connecting to account.');
    } finally {
      setIsLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    if (type === 'success' || type === 'error') {
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 7000);
    }
  };

  // Track Wallet Accounts Shifts
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
    }
  }, []);

  // Handle Issuance File Change
  const handleIssueFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showStatus('info', 'Computing cryptographic identity signature...');
      const fileHash = await calculateFileHash(file);
      setIssueForm(prev => ({ ...prev, file, computedHash: fileHash }));
      showStatus('success', 'SHA-256 signature calculated locally.');
    } catch (err) {
      showStatus('error', 'Failed parsing cryptographic signature.');
    }
  };

  // Submit Issuance Transaction
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!account) return showStatus('error', 'Please link your administrative wallet first.');
    if (!issueForm.computedHash) return showStatus('error', 'Please attach the source certificate file.');

    try {
      setIsLoading(true);
      showStatus('info', 'Requesting signature from provider ledger...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

      const tx = await contract.issueCertificate(
        issueForm.computedHash,
        issueForm.recipientName,
        issueForm.courseName,
        issueForm.issuingAuthority
      );

      showStatus('info', `Transaction submitted. Awaiting processing confirmation: ${tx.hash.substring(0, 14)}...`);
      await tx.wait();

      showStatus('success', 'Certificate successfully certified and recorded securely on-chain.');
      setIssueForm({ recipientName: '', courseName: '', issuingAuthority: '', file: null, computedHash: '' });
    } catch (err) {
      console.error(err);
      showStatus('error', err.reason || err.message || 'Blockchain contract execution rejected.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Document Upload Process
  const handleVerifyFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVerifyFile(file);
    setVerifiedCert(null);
    
    try {
      setIsLoading(true);
      showStatus('info', 'Analyzing asset cryptographic values...');
      const targetHash = await calculateFileHash(file);

      // We read-only verify, we can use a standard JSON-RPC or standard window.ethereum instance
      const provider = window.ethereum 
        ? new ethers.BrowserProvider(window.ethereum)
        : ethers.getDefaultProvider('sepolia'); // Fallback to public standard endpoint node

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);
      
      const result = await contract.verifyCertificate(targetHash);
      
      setVerifiedCert({
        recipientName: result[0],
        courseName: result[1],
        issuingAuthority: result[2],
        issueDate: new Date(Number(result[3]) * 1000).toLocaleString(),
        isValid: result[4],
        hash: targetHash
      });
      showStatus('success', 'Authentication review completed successfully.');
    } catch (err) {
      console.error(err);
      showStatus('error', 'Verification Failed: Document signature missing from registration records.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand">
          <div className="logo-icon">⛓️</div>
          <h1>ChainCert</h1>
          <span className="badge">v1.0 Protocol</span>
        </div>
        <button 
          className={`btn-connect ${account ? 'connected' : ''}`}
          onClick={connectWallet}
          disabled={isLoading}
        >
          {account ? `${account.substring(0,6)}...${account.substring(account.length-4)}` : 'Synchronize Node'}
        </button>
      </header>

      <main className="main-content">
        <section className="hero">
          <h2>Immutable Document Authenticator</h2>
          <p>Instantly prove academic or industry credentials through cryptographic ledger verification without exposing personal identifiable data databases.</p>
        </section>

        <div className="tabs-navigation">
          <button 
            className={`tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => { setActiveTab('verify'); setStatusMessage({type:'', text:''}); }}
          >
            🛡️ Verify Document
          </button>
          <button 
            className={`tab-btn ${activeTab === 'issue' ? 'active' : ''}`}
            onClick={() => { setActiveTab('issue'); setStatusMessage({type:'', text:''}); }}
          >
            ✍️ Issuance Desk
          </button>
        </div>

        {statusMessage.text && (
          <div className={`status-banner ${statusMessage.type}`}>
            <span className="spinner-dot"></span>
            <p>{statusMessage.text}</p>
          </div>
        )}

        <div className="card-container">
          {activeTab === 'verify' && (
            <div className="tab-pane">
              <h3>Verify Certificate Integrity</h3>
              <p className="pane-desc">Upload a digital certificate file (PDF/PNG). System matches its dynamic file hash locally before looking up registration timestamps on-chain.</p>
              
              <div className="upload-box">
                <input 
                  type="file" 
                  id="verifier-file" 
                  onChange={handleVerifyFileChange} 
                  disabled={isLoading} 
                />
                <label htmlFor="verifier-file" className="upload-label">
                  <div className="icon">📁</div>
                  <span>{verifyFile ? `Target: ${verifyFile.name}` : 'Drop certification record or click to browse'}</span>
                </label>
              </div>

              {verifiedCert && (
                <div className="verification-results-card">
                  <div className="success-badge">✅ CRYPTOGRAPHICALLY SECURE</div>
                  <div className="grid-meta">
                    <div className="meta-row"><strong>Recipient Name:</strong> <span>{verifiedCert.recipientName}</span></div>
                    <div className="meta-row"><strong>Award/Course:</strong> <span>{verifiedCert.courseName}</span></div>
                    <div className="meta-row"><strong>Issuing Body:</strong> <span>{verifiedCert.issuingAuthority}</span></div>
                    <div className="meta-row"><strong>Block Timestamp:</strong> <span>{verifiedCert.issueDate}</span></div>
                    <div className="meta-row hash-row"><strong>File SHA-256:</strong> <code>{verifiedCert.hash}</code></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'issue' && (
            <div className="tab-pane">
              <h3>Issuance Registration Gateway</h3>
              <p className="pane-desc">Authorized credential nodes only. Input parameters to lock validation record properties inside the distributed execution layers.</p>
              
              <form onSubmit={handleIssueSubmit} className="styled-form">
                <div className="input-group">
                  <label>Recipient Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    required 
                    value={issueForm.recipientName}
                    onChange={(e) => setIssueForm(p => ({...p, recipientName: e.target.value}))}
                  />
                </div>

                <div className="input-group">
                  <label>Certification / Degree Name</label>
                  <input 
                    type="text" 
                    placeholder="B.S. in Computer Science" 
                    required 
                    value={issueForm.courseName}
                    onChange={(e) => setIssueForm(p => ({...p, courseName: e.target.value}))}
                  />
                </div>

                <div className="input-group">
                  <label>Issuing Institution</label>
                  <input 
                    type="text" 
                    placeholder="Decentralized Tech Institute" 
                    required 
                    value={issueForm.issuingAuthority}
                    onChange={(e) => setIssueForm(p => ({...p, issuingAuthority: e.target.value}))}
                  />
                </div>

                <div className="input-group">
                  <label>Certificate File (To Compute Ledger Hash)</label>
                  <input 
                    type="file" 
                    id="issuer-file" 
                    required 
                    onChange={handleIssueFileChange} 
                  />
                  {issueForm.computedHash && (
                    <div className="hash-preview">
                      <strong>Generated Blueprint Identity:</strong> <code>{issueForm.computedHash}</code>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-submit" disabled={isLoading || !account}>
                  {isLoading ? 'Executing Smart Contract Transaction...' : 'Write Record to Ledger'}
                </button>
                {!account && <small className="warning-text">⚠️ Please synchronize node wallet to access deployment state functions.</small>}
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 ChainCert Protocol — Cryptographic Academic Proof-of-Authority.</p>
      </footer>
    </div>
  );
}

export default App;
src/index.css
Premium, bespoke design template utilizing dark tech aesthetics combined with clean, legible font pairings.

CSS
:root {
  --bg-main: #0B0F19;
  --bg-card: #161F30;
  --bg-input: #1F2A40;
  --accent-cyan: #00F2FE;
  --accent-purple: #4FACFE;
  --text-primary: #F3F4F6;
  --text-secondary: #9CA3AF;
  --success: #10B981;
  --error: #EF4444;
  --info: #3B82F6;
  --border-color: #24334D;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-main);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(22, 31, 48, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.brand h1 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge {
  font-size: 0.7rem;
  background: var(--border-color);
  padding: 2px 8px;
  border-radius: 12px;
  color: var(--text-secondary);
}

.btn-connect {
  background: linear-gradient(135deg, #1E293B, #0F172A);
  color: white;
  border: 1px solid var(--border-color);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-connect:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.2);
}

.btn-connect.connected {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.main-content {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.hero h2 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.75px;
}

.hero p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.tabs-navigation {
  display: flex;
  background-color: var(--bg-card);
  padding: 0.4rem;
  border-radius: 10px;
  gap: 0.4rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  background-color: var(--bg-input);
  color: var(--accent-cyan);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-banner.info { background: rgba(59, 130, 246, 0.15); color: #93C5FD; border: 1px solid rgba(59, 130, 246, 0.3); }
.status-banner.success { background: rgba(16, 185, 129, 0.15); color: #6EE7B7; border: 1px solid rgba(16, 185, 129, 0.3); }
.status-banner.error { background: rgba(239, 68, 68, 0.15); color: #FCA5A5; border: 1px solid rgba(239, 68, 68, 0.3); }

.card-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

.tab-pane h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.pane-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.75rem;
  line-height: 1.5;
}

.upload-box {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  padding: 3rem 1rem;
  text-align: center;
  transition: border-color 0.2s ease;
  background-color: rgba(31, 42, 64, 0.2);
}

.upload-box:hover {
  border-color: var(--accent-cyan);
}

.upload-box input[type="file"] {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-label .icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.upload-label span {
  font-weight: 500;
  color: var(--text-secondary);
}

.verification-results-card {
  margin-top: 2rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--success);
  border-radius: 8px;
  padding: 1.5rem;
}

.success-badge {
  color: var(--success);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.grid-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 0.5rem;
}

.meta-row strong {
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-row code {
  background: var(--bg-main);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--accent-cyan);
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.styled-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-group input[type="text"] {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.input-group input[type="text"]:focus {
  outline: none;
  border-color: var(--accent-purple);
}

.hash-preview {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  background: rgba(0, 242, 254, 0.05);
  padding: 8px;
  border-radius: 6px;
  border: 1px dashed rgba(0, 242, 254, 0.2);
}

.hash-preview code {
  color: var(--accent-cyan);
}

.btn-submit {
  background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
  color: #0B0F19;
  border: none;
  padding: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.1s ease, opacity 0.2s ease;
}

.btn-submit:hover {
  opacity: 0.95;
}

.btn-submit:active {
  transform: scale(0.99);
}

.btn-submit:disabled {
  background: var(--border-color);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.warning-text {
  text-align: center;
  color: #FBBF24;
}

.footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
}
5. Execution & Deployment Guide
To deploy this project end-to-end completely, execute the following steps sequential to compilation:

Smart Contract Compilation:

Open Remix IDE.

Create a file named ChainCert.sol and paste the Contract code block inside.

Compile using compiler version 0.8.20 or higher.

Contract Deployment:

Change Environment tab to "Injected Provider - MetaMask".

Select Sepolia or Polygon Amoy Testnet in your browser wallet extension interface.

Deploy contract. Copy the resulting Deployed Contract Address.

Frontend Implementation:

Scaffold files locally via workspace structure definitions.

Replace the const CONTRACT_ADDRESS = "0x00..." value inside src/App.jsx with your deployed address string.

Run installation commands:

Bash
npm install
npm run dev
Access the development workspace at http://localhost:3000.
"""

file_path = "chaincert-project-spec.md"
with open(file_path, "w", encoding="utf-8") as f:
f.write(markdown_content)

print(f"File created successfully at {file_path}")