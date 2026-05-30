import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { calculateFileHash } from './utils/crypto';
import contractAbi from './abi.json';

// Paste your deployed smart contract address here after deployment
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138"

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
            console.error("Verification Error Detail:", err);
            const errorMessage = err.reason || (err.message && err.message.length < 100 ? err.message : 'Registry lookup failed: Document not found or contract error.');
            showStatus('error', `Verification Failed: ${errorMessage}`);
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
                    {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Synchronize Node'}
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
                        onClick={() => { setActiveTab('verify'); setStatusMessage({ type: '', text: '' }); }}
                    >
                        🛡️ Verify Document
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'issue' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('issue'); setStatusMessage({ type: '', text: '' }); }}
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
                                        onChange={(e) => setIssueForm(p => ({ ...p, recipientName: e.target.value }))}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Certification / Degree Name</label>
                                    <input
                                        type="text"
                                        placeholder="B.S. in Computer Science"
                                        required
                                        value={issueForm.courseName}
                                        onChange={(e) => setIssueForm(p => ({ ...p, courseName: e.target.value }))}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Issuing Institution</label>
                                    <input
                                        type="text"
                                        placeholder="Decentralized Tech Institute"
                                        required
                                        value={issueForm.issuingAuthority}
                                        onChange={(e) => setIssueForm(p => ({ ...p, issuingAuthority: e.target.value }))}
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
