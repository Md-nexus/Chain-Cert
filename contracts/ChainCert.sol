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
