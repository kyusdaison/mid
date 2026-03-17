'use client';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function VerificationScanner() {
  const [nonce, setNonce] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'verified'>('idle');
  const [fcdid, setFcdid] = useState('');

  // Generate a random nonce on mount
  useEffect(() => {
    setNonce(Math.random().toString(36).substring(7));
  }, []);

  // Poll for verification status
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'pending' && nonce) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/verify/${nonce}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'verified') {
              setStatus('verified');
              setFcdid(data.fcdid || 'Unknown FCDID');
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Error polling verification status:', error);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => clearInterval(interval);
  }, [status, nonce]);

  const handleStartVerification = () => {
    setStatus('pending');
  };

  const getQRPayload = () => {
    // Generate the deeplink payload for the mobile wallet
    return `fcid://verify?service=Montserrat_Digital_Gov&nonce=${nonce}&requirements=proof_of_humanity,kyc`;
  };

  return (
    <div className="scanner-card">
      <div className="scanner-glow-1" />
      <div className="scanner-glow-2" />

      <div className="scanner-header">
        <h3 className="scanner-h3">
          Identity Verification
        </h3>
        <p className="scanner-p">
          Prove your sovereign identity without revealing raw PII.
        </p>
      </div>

      {status === 'idle' && (
        <button
          onClick={handleStartVerification}
          className="scanner-btn"
        >
          INITIATE ZKP SCAN
        </button>
      )}

      {status === 'pending' && (
        <div className="scanner-pending">
          <div className="qr-frame">
            <div className="qr-frame-inner">
              <div className="qr-bg">
                <QRCodeSVG
                  value={getQRPayload()}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              <div className="scan-line" />
            </div>
          </div>
          
          <div className="pending-text-box">
            <div className="pending-row">
              <div className="ping-dot" />
              <span className="pending-label">AWAITING WALLET SCAN</span>
            </div>
            <p className="pending-desc">
              Open <span style={{ color: '#fff' }}>MID Mobile</span> and scan to securely authorize binding.
            </p>
          </div>
        </div>
      )}

      {status === 'verified' && (
        <div className="scanner-verified">
          <div className="success-icon">
            <svg viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="granted-text">Access Granted</h4>
          <div className="fcdid-box">
            <span className="fcdid-label">Verified Resident:</span>
            <span className="fcdid-value">{fcdid}</span>
          </div>
          <p className="zkp-validated">
            {"// Zero-Knowledge Proof Validated //"}
          </p>
        </div>
      )}
    </div>
  );
}
