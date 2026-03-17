'use client';

import React from 'react';
import { useWeb3 } from '@/context/Web3Context';

export default function InteractiveIdCard() {
  const { registeredFCDID } = useWeb3();

  // Highlight effect when a new ID is minted
  const glowStyle = registeredFCDID ? { textShadow: '0 0 10px rgba(52,211,153,0.8)', color: '#34D399' } : {};

  return (
    <div className="card-scene">
      {/* Tangem-style orbital light ring */}
      <div className="orbital-ring-container">
        <div className="orbital-ring"></div>
        <div className="orbital-ring-2"></div>
        <div className="orbital-ambient"></div>
      </div>
      <div className="tap-prompt">Tap the card to the phone</div>
      <div className="card-flip-inner">
        {/* FRONT FACE */}
        <div className="card-face card-face--front">
          <div className="id-card">
            {/* Header */}
            <div className="card-header">
              <div className="card-gov-label">
                <span className="card-territory">British Overseas Territory</span>
                <span className="card-title">Montserrat</span>
                <span className="card-type">Digital Residency Card</span>
              </div>
              <div className="card-flag">
                <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
                  {/* Blue field */}
                  <rect width="60" height="40" fill="#012169" />
                  {/* Union Jack (upper-left canton) */}
                  <g transform="translate(0,0)">
                    {/* White diagonals */}
                    <line x1="0" y1="0" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="4" />
                    <line x1="30" y1="0" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="4" />
                    {/* Red diagonals */}
                    <line x1="0" y1="0" x2="30" y2="20" stroke="#C8102E" strokeWidth="2" />
                    <line x1="30" y1="0" x2="0" y2="20" stroke="#C8102E" strokeWidth="2" />
                    {/* White cross */}
                    <line x1="15" y1="0" x2="15" y2="20" stroke="#FFFFFF" strokeWidth="6" />
                    <line x1="0" y1="10" x2="30" y2="10" stroke="#FFFFFF" strokeWidth="6" />
                    {/* Red cross */}
                    <line x1="15" y1="0" x2="15" y2="20" stroke="#C8102E" strokeWidth="3.5" />
                    <line x1="0" y1="10" x2="30" y2="10" stroke="#C8102E" strokeWidth="3.5" />
                  </g>
                  {/* Montserrat Coat of Arms */}
                  <g transform="translate(38, 8)">
                    {/* Shield background */}
                    <path
                      d="M0,2 Q0,0 2,0 L14,0 Q16,0 16,2 L16,16 Q16,22 8,24 Q0,22 0,16 Z"
                      fill="#FFFFFF"
                      stroke="#C9A84C"
                      strokeWidth="0.8"
                    />
                    {/* Figure (Erin) */}
                    <ellipse cx="8" cy="6" rx="2" ry="2.2" fill="#2E7D32" />
                    {/* Dress */}
                    <path d="M5,8 Q8,7.5 11,8 L12,18 Q8,20 4,18 Z" fill="#2E7D32" />
                    {/* Cross */}
                    <line x1="12" y1="4" x2="12" y2="14" stroke="#8B4513" strokeWidth="1.2" />
                    <line x1="10" y1="6" x2="14" y2="6" stroke="#8B4513" strokeWidth="1.2" />
                    {/* Harp */}
                    <path d="M3,9 Q2,6 4,9" stroke="#C9A84C" strokeWidth="0.8" fill="none" />
                    <line x1="3" y1="9" x2="3" y2="14" stroke="#C9A84C" strokeWidth="0.6" />
                    <line x1="3.5" y1="9" x2="3.5" y2="13" stroke="#C9A84C" strokeWidth="0.3" />
                    <line x1="2.5" y1="9.5" x2="2.5" y2="13" stroke="#C9A84C" strokeWidth="0.3" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Body: Photo + Chip + Fields */}
            <div className="card-body">
              <div className="card-photo">
                <img className="card-photo-img" src="/IDphoto.jpg" alt="Resident Photo" />
                <div className="photo-corner photo-corner--tl"></div>
                <div className="photo-corner photo-corner--tr"></div>
                <div className="photo-corner photo-corner--bl"></div>
                <div className="photo-corner photo-corner--br"></div>
              </div>
              <div className="card-chip">
                <div className="chip-line-v"></div>
              </div>
              <div className="card-info">
                <div className="card-field">
                  <span className="card-field-label">Resident Name</span>
                  <span className="card-field-value" style={glowStyle}>
                    {registeredFCDID ? registeredFCDID.toUpperCase() : 'NUO WANG'}
                  </span>
                </div>
                <div className="card-row">
                  <div className="card-field">
                    <span className="card-field-label">Valid From</span>
                    <span className="card-field-value">2025.07.01</span>
                  </div>
                  <div className="card-field">
                    <span className="card-field-label">Expires</span>
                    <span className="card-field-value">2028.06.30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer">
              <span className="card-id-number">MS-DR-2025-004817</span>
              <div className="card-blockchain-badge">
                <span className="chain-dot"></span>
                <span>Blockchain Verified</span>
              </div>
            </div>

            <div className="card-scan-line"></div>

            <div className="card-corner card-corner--tl"></div>
            <div className="card-corner card-corner--tr"></div>
            <div className="card-corner card-corner--bl"></div>
            <div className="card-corner card-corner--br"></div>

            {/* Hex data overlay */}
            <div className="card-hex-data">
              A7F3 0B2E<br />
              C91D 4E8A<br />
              3F6B 72D1<br />
              E504 9AC8
            </div>

            {/* Decorative circuit SVG */}
            <svg className="card-circuit" viewBox="0 0 60 30">
              <line x1="0" y1="15" x2="20" y2="15" />
              <circle cx="20" cy="15" r="2" />
              <line x1="20" y1="15" x2="35" y2="5" />
              <circle cx="35" cy="5" r="2" />
              <line x1="20" y1="15" x2="35" y2="25" />
              <circle cx="35" cy="25" r="2" />
              <line x1="35" y1="5" x2="55" y2="5" />
              <circle cx="55" cy="5" r="1.5" />
              <line x1="35" y1="25" x2="50" y2="25" />
              <circle cx="50" cy="25" r="1.5" />
              <line x1="35" y1="5" x2="45" y2="15" />
              <circle cx="45" cy="15" r="2" />
              <line x1="45" y1="15" x2="58" y2="15" />
            </svg>

            {/* MID Sovereign Seal watermark */}
            <svg className="card-seal" viewBox="0 0 220 220" fill="none">
              <circle cx="110" cy="110" r="94" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" />
              <circle cx="110" cy="110" r="78" stroke="rgba(74,143,231,0.4)" strokeWidth="0.8" />
              <line x1="110" y1="16" x2="110" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="204" y1="110" x2="196" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="110" y1="204" x2="110" y2="196" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="16" y1="110" x2="24" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M60 152V72L82 104L110 68L138 104L160 72V152" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
              <line x1="110" y1="50" x2="110" y2="170" stroke="rgba(74,143,231,0.9)" strokeWidth="3" />
              <line x1="103" y1="50" x2="117" y2="50" stroke="rgba(74,143,231,0.7)" strokeWidth="2" />
              <line x1="103" y1="170" x2="117" y2="170" stroke="rgba(74,143,231,0.7)" strokeWidth="2" />
              <path d="M110 50C148 50 174 72 174 110C174 148 148 170 110 170" stroke="rgba(74,143,231,0.5)" strokeWidth="2.5" fill="none" />
              <line x1="56" y1="152" x2="164" y2="152" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="card-face card-face--back">
          <div className="card-back-content">
            <div className="back-magstripe"></div>
            <svg className="back-mid-watermark" viewBox="20 40 360 300" fill="none">
              <defs>
                <filter id="bk-node-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="bk-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <rect x="120" y="135" width="160" height="110" rx="8" stroke="rgba(160,180,210,0.45)" strokeWidth="1.2" fill="rgba(20,25,35,0.5)" />
              <rect x="132" y="147" width="136" height="86" rx="4" stroke="rgba(74,143,231,0.2)" strokeWidth="0.5" fill="none" />
              <g stroke="rgba(74,143,231,0.08)" strokeWidth="0.3">
                <line x1="160" y1="147" x2="160" y2="233" /><line x1="200" y1="147" x2="200" y2="233" /><line x1="240" y1="147" x2="240" y2="233" />
                <line x1="132" y1="175" x2="268" y2="175" /><line x1="132" y1="205" x2="268" y2="205" />
              </g>
              <text x="200" y="198" textAnchor="middle" fontFamily="var(--font-dm-sans), sans-serif" fontSize="36" fontWeight="700" letterSpacing="12" fill="rgba(200,210,225,0.8)" filter="url(#bk-soft-glow)">MID</text>
              <text x="200" y="220" textAnchor="middle" fontFamily="var(--font-ibm-plex-mono), monospace" fontSize="7" fontWeight="500" letterSpacing="4.5" fill="rgba(160,180,210,0.4)">SECURE  ELEMENT</text>
              <path d="M155 135 L155 105 L110 105 L110 70" stroke="rgba(74,143,231,0.4)" strokeWidth="1" fill="none" />
              <path d="M170 135 L170 95 L130 95 L130 55" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M190 135 L190 85 L175 60" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M210 135 L210 85 L225 60" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M230 135 L230 95 L270 95 L270 55" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M245 135 L245 105 L290 105 L290 70" stroke="rgba(74,143,231,0.4)" strokeWidth="1" fill="none" />
              <path d="M155 245 L155 275 L110 275 L110 310" stroke="rgba(74,143,231,0.4)" strokeWidth="1" fill="none" />
              <path d="M170 245 L170 285 L130 285 L130 325" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M190 245 L190 295 L175 320" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M210 245 L210 295 L225 320" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M230 245 L230 285 L270 285 L270 325" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M245 245 L245 275 L290 275 L290 310" stroke="rgba(74,143,231,0.4)" strokeWidth="1" fill="none" />
              <path d="M120 160 L90 160 L90 120 L55 120" stroke="rgba(74,143,231,0.4)" strokeWidth="1" fill="none" />
              <path d="M120 180 L80 180 L80 155 L45 155" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M120 200 L70 200" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M120 220 L80 220 L80 245 L45 245" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M280 160 L310 160 L310 120 L345 120" stroke="rgba(74,143,231,0.4)" strokeWidth="1" fill="none" />
              <path d="M280 180 L320 180 L320 155 L355 155" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M280 200 L330 200" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <path d="M280 220 L320 220 L320 245 L355 245" stroke="rgba(74,143,231,0.35)" strokeWidth="1" fill="none" />
              <g filter="url(#bk-node-glow)">
                <circle cx="110" cy="70" r="4" fill="rgba(74,143,231,0.8)" />
                <circle cx="130" cy="55" r="3.5" fill="rgba(74,143,231,0.75)" />
                <circle cx="175" cy="60" r="3.5" fill="rgba(74,143,231,0.7)" />
                <circle cx="225" cy="60" r="3.5" fill="rgba(74,143,231,0.7)" />
                <circle cx="270" cy="55" r="3.5" fill="rgba(74,143,231,0.75)" />
                <circle cx="290" cy="70" r="4" fill="rgba(74,143,231,0.8)" />
              </g>
              <g filter="url(#bk-node-glow)">
                <circle cx="110" cy="310" r="4" fill="rgba(74,143,231,0.8)" />
                <circle cx="130" cy="325" r="3.5" fill="rgba(74,143,231,0.75)" />
                <circle cx="175" cy="320" r="3.5" fill="rgba(74,143,231,0.7)" />
                <circle cx="225" cy="320" r="3.5" fill="rgba(74,143,231,0.7)" />
                <circle cx="270" cy="325" r="3.5" fill="rgba(74,143,231,0.75)" />
                <circle cx="290" cy="310" r="4" fill="rgba(74,143,231,0.8)" />
              </g>
              <g filter="url(#bk-node-glow)">
                <circle cx="55" cy="120" r="4" fill="rgba(74,143,231,0.8)" />
                <circle cx="45" cy="155" r="3.5" fill="rgba(74,143,231,0.75)" />
                <circle cx="70" cy="200" r="3.5" fill="rgba(74,143,231,0.7)" />
                <circle cx="45" cy="245" r="3.5" fill="rgba(74,143,231,0.75)" />
              </g>
              <g filter="url(#bk-node-glow)">
                <circle cx="345" cy="120" r="4" fill="rgba(74,143,231,0.8)" />
                <circle cx="355" cy="155" r="3.5" fill="rgba(74,143,231,0.75)" />
                <circle cx="330" cy="200" r="3.5" fill="rgba(74,143,231,0.7)" />
                <circle cx="355" cy="245" r="3.5" fill="rgba(74,143,231,0.75)" />
              </g>
              <text x="200" y="370" textAnchor="middle" fontFamily="var(--font-ibm-plex-mono), monospace" fontSize="7" fontWeight="400" letterSpacing="4" fill="rgba(160,180,210,0.25)">MONTSERRAT DIGITAL IDENTITY</text>
            </svg>

            {/* Additive center mark overlay */}
            <svg className="back-center-mark" viewBox="20 40 360 300" fill="none">
              <defs>
                <filter id="bk-center-node-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="bk-center-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.15" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="bk-center-chip-face" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#202C3C" stopOpacity="0.97" />
                  <stop offset="55%" stopColor="#18212F" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#24354A" stopOpacity="0.98" />
                </linearGradient>
              </defs>
              <rect x="132" y="146" width="136" height="92" rx="10" stroke="rgba(105,171,255,0.34)" strokeWidth="1.25" fill="rgba(13,18,27,0.72)" />
              <rect x="144" y="158" width="112" height="68" rx="5" stroke="rgba(104,170,255,0.52)" strokeWidth="0.72" fill="url(#bk-center-chip-face)" />
              <g stroke="rgba(102,168,255,0.16)" strokeWidth="0.42">
                <line x1="177" y1="158" x2="177" y2="226" />
                <line x1="200" y1="158" x2="200" y2="226" />
                <line x1="223" y1="158" x2="223" y2="226" />
                <line x1="144" y1="181" x2="256" y2="181" />
                <line x1="144" y1="203" x2="256" y2="203" />
              </g>
              <circle cx="140" cy="154" r="2.8" fill="rgba(111,173,255,0.22)" stroke="rgba(141,193,255,0.44)" strokeWidth="0.55" />
              <text x="200" y="196" textAnchor="middle" fontFamily="var(--font-dm-sans), sans-serif" fontSize="31" fontWeight="700" letterSpacing="8" fill="rgba(249,251,255,0.99)" filter="url(#bk-center-soft-glow)">MID</text>
              <text x="200" y="216" textAnchor="middle" fontFamily="var(--font-ibm-plex-mono), monospace" fontSize="6.5" fontWeight="600" letterSpacing="3.1" fill="rgba(115,176,255,0.88)">SECURE ELEMENT</text>
              <path d="M168 146 L168 118 L152 102" stroke="rgba(95,163,255,0.62)" strokeWidth="1.08" fill="none" />
              <path d="M200 146 L200 112 L200 92" stroke="rgba(95,163,255,0.70)" strokeWidth="1.1" fill="none" />
              <path d="M232 146 L232 118 L248 102" stroke="rgba(95,163,255,0.62)" strokeWidth="1.08" fill="none" />
              <path d="M168 238 L168 266 L152 282" stroke="rgba(95,163,255,0.62)" strokeWidth="1.08" fill="none" />
              <path d="M200 238 L200 272 L200 292" stroke="rgba(95,163,255,0.70)" strokeWidth="1.1" fill="none" />
              <path d="M232 238 L232 266 L248 282" stroke="rgba(95,163,255,0.62)" strokeWidth="1.08" fill="none" />
              <path d="M132 175 L102 175 L88 162" stroke="rgba(95,163,255,0.60)" strokeWidth="1.04" fill="none" />
              <path d="M132 209 L102 209 L88 222" stroke="rgba(95,163,255,0.60)" strokeWidth="1.04" fill="none" />
              <path d="M268 175 L298 175 L312 162" stroke="rgba(95,163,255,0.60)" strokeWidth="1.04" fill="none" />
              <path d="M268 209 L298 209 L312 222" stroke="rgba(95,163,255,0.60)" strokeWidth="1.04" fill="none" />
              <g filter="url(#bk-center-node-glow)">
                <circle cx="152" cy="102" r="3.3" fill="rgba(103,169,255,0.92)" />
                <circle cx="200" cy="92" r="3.6" fill="rgba(103,169,255,0.98)" />
                <circle cx="248" cy="102" r="3.3" fill="rgba(103,169,255,0.92)" />
                <circle cx="152" cy="282" r="3.3" fill="rgba(103,169,255,0.92)" />
                <circle cx="200" cy="292" r="3.6" fill="rgba(103,169,255,0.98)" />
                <circle cx="248" cy="282" r="3.3" fill="rgba(103,169,255,0.92)" />
                <circle cx="88" cy="162" r="3.1" fill="rgba(103,169,255,0.90)" />
                <circle cx="88" cy="222" r="3.1" fill="rgba(103,169,255,0.90)" />
                <circle cx="312" cy="162" r="3.1" fill="rgba(103,169,255,0.90)" />
                <circle cx="312" cy="222" r="3.1" fill="rgba(103,169,255,0.90)" />
              </g>
            </svg>

            <div className="back-chip-area">
              <div className="card-chip"><div className="chip-line-v"></div></div>
            </div>

            <div className="back-content">
              <div className="back-fields-grid">
                <div className="back-field">
                  <span className="back-field-label">Date of Issue</span>
                  <span className="back-field-value">2025.01.01</span>
                </div>
                <div className="back-field">
                  <span className="back-field-label">Issuing Authority</span>
                  <span className="back-field-value">MONTSERRAT</span>
                </div>
                <div className="back-field">
                  <span className="back-field-label">Document No.</span>
                  <span className="back-field-value">MONX86220001</span>
                </div>
                <div className="back-field">
                  <span className="back-field-label">Height</span>
                  <span className="back-field-value">1.68 m</span>
                </div>
                <div className="back-field">
                  <span className="back-field-label">Eye Colour</span>
                  <span className="back-field-value">BROWN</span>
                </div>
              </div>
            </div>

            <div className="back-bottom-bar">
              <svg className="back-qr-mini" viewBox="0 0 42 42" fill="none">
                <rect x="0" y="0" width="12" height="12" rx="1" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" fill="none" />
                <rect x="2.5" y="2.5" width="7" height="7" rx="0.5" fill="rgba(255,255,255,0.08)" />
                <rect x="30" y="0" width="12" height="12" rx="1" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" fill="none" />
                <rect x="32.5" y="2.5" width="7" height="7" rx="0.5" fill="rgba(255,255,255,0.08)" />
                <rect x="0" y="30" width="12" height="12" rx="1" stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" fill="none" />
                <rect x="2.5" y="32.5" width="7" height="7" rx="0.5" fill="rgba(255,255,255,0.08)" />
                <g fill="rgba(255,255,255,0.05)">
                  <rect x="14" y="2" width="2" height="2" /><rect x="18" y="2" width="2" height="2" /><rect x="22" y="2" width="2" height="2" /><rect x="26" y="2" width="2" height="2" />
                  <rect x="14" y="6" width="2" height="2" /><rect x="22" y="6" width="2" height="2" />
                  <rect x="14" y="10" width="2" height="2" /><rect x="18" y="10" width="2" height="2" /><rect x="26" y="10" width="2" height="2" />
                  <rect x="2" y="14" width="2" height="2" /><rect x="6" y="14" width="2" height="2" /><rect x="14" y="14" width="2" height="2" /><rect x="18" y="14" width="2" height="2" /><rect x="22" y="14" width="2" height="2" /><rect x="30" y="14" width="2" height="2" /><rect x="38" y="14" width="2" height="2" />
                  <rect x="2" y="18" width="2" height="2" /><rect x="10" y="18" width="2" height="2" /><rect x="14" y="18" width="2" height="2" /><rect x="26" y="18" width="2" height="2" /><rect x="34" y="18" width="2" height="2" />
                  <rect x="6" y="22" width="2" height="2" /><rect x="14" y="22" width="2" height="2" /><rect x="18" y="22" width="2" height="2" /><rect x="22" y="22" width="2" height="2" /><rect x="30" y="22" width="2" height="2" /><rect x="38" y="22" width="2" height="2" />
                  <rect x="2" y="26" width="2" height="2" /><rect x="10" y="26" width="2" height="2" /><rect x="18" y="26" width="2" height="2" /><rect x="26" y="26" width="2" height="2" /><rect x="34" y="26" width="2" height="2" />
                </g>
              </svg>
              <div className="back-sig-area">
                <div className="back-sig-label2">Signature of Holder / Signature du Titulaire</div>
                <div className="back-sig-line2"></div>
              </div>
            </div>

            <img className="back-fcb-logo" src="https://www.futurecitizen.io/branding/future-citizen-logo.png" alt="FCB" />

            <div className="back-mrz">
              {registeredFCDID ? (
                <>
                  <div className="back-mrz-line" style={glowStyle}>IDMSR8622000100{registeredFCDID.toUpperCase().replace('.FC', '').substring(0, 15)}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div className="back-mrz-line">9007135F3002115GBR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div className="back-mrz-line">MONX86220001&lt;{registeredFCDID.toUpperCase().replace('.FC', '').substring(0, 15)}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                </>
              ) : (
                <>
                  <div className="back-mrz-line">IDMSR8622000100NUO&lt;&lt;WANG&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div className="back-mrz-line">9007135F3002115GBR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div className="back-mrz-line">MONX86220001&lt;NUO&lt;&lt;WANG&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                </>
              )}
            </div>

            <div className="back-corner back-corner--tl"></div>
            <div className="back-corner back-corner--tr"></div>
            <div className="back-corner back-corner--bl"></div>
            <div className="back-corner back-corner--br"></div>
          </div>
        </div>
      </div>

      {/* NFC interaction effects */}
      <div className="nfc-pulse">
        <div className="nfc-flash-core"></div>
        <div className="nfc-ring"></div>
        <div className="nfc-ring"></div>
        <div className="nfc-ring"></div>
        <div className="nfc-ring"></div>
      </div>
      <div className="data-particles">
        <div className="data-particle"></div>
        <div className="data-particle"></div>
        <div className="data-particle"></div>
        <div className="data-particle"></div>
        <div className="data-particle"></div>
        <div className="data-particle"></div>
      </div>
      <div className="overlap-glow"></div>

      {/* Phone mockup (slides in like Tangem) */}
      <div className="phone-mockup">
        <div className="phone-frame">
          <div className="phone-notch"></div>
          <div className="phone-screen">

            {/* BOOT ANIMATION (plays first, then fades) */}
            <div className="phone-boot-scene" id="phoneBootScene">
              <div className="boot-ambient-glow"></div>
              <svg className="boot-chip-svg" viewBox="0 0 200 200" fill="none">
                <path className="boot-circuit" d="M100 30 L100 10 L160 10 L160 40" stroke="#4A8FE7" strokeWidth="0.5" fill="none" />
                <path className="boot-circuit boot-circuit-2" d="M100 154 L100 175 L45 175 L45 145" stroke="#4A8FE7" strokeWidth="0.5" fill="none" />
                <line className="boot-wire bw-1" x1="62" y1="52" x2="62" y2="34" stroke="#4A8FE7" strokeWidth="0.7" />
                <line className="boot-wire bw-2" x1="100" y1="52" x2="100" y2="28" stroke="#4A8FE7" strokeWidth="0.8" />
                <line className="boot-wire bw-3" x1="138" y1="52" x2="138" y2="34" stroke="#4A8FE7" strokeWidth="0.7" />
                <line className="boot-wire bw-4" x1="62" y1="132" x2="62" y2="150" stroke="#4A8FE7" strokeWidth="0.7" />
                <line className="boot-wire bw-5" x1="100" y1="132" x2="100" y2="156" stroke="#4A8FE7" strokeWidth="0.8" />
                <line className="boot-wire bw-6" x1="138" y1="132" x2="138" y2="150" stroke="#4A8FE7" strokeWidth="0.7" />
                <line className="boot-wire bw-7" x1="48" y1="92" x2="28" y2="92" stroke="#4A8FE7" strokeWidth="0.8" />
                <line className="boot-wire bw-8" x1="152" y1="92" x2="172" y2="92" stroke="#4A8FE7" strokeWidth="0.8" />
                <circle className="boot-pin bp-1" cx="62" cy="32" r="2.5" fill="#4A8FE7" />
                <circle className="boot-pin bp-2" cx="100" cy="26" r="3" fill="#4A8FE7" />
                <circle className="boot-pin bp-3" cx="138" cy="32" r="2.5" fill="#4A8FE7" />
                <circle className="boot-pin bp-4" cx="62" cy="152" r="2.5" fill="#4A8FE7" />
                <circle className="boot-pin bp-5" cx="100" cy="158" r="3" fill="#4A8FE7" />
                <circle className="boot-pin bp-6" cx="138" cy="152" r="2.5" fill="#4A8FE7" />
                <circle className="boot-pin bp-7" cx="26" cy="92" r="3" fill="#4A8FE7" />
                <circle className="boot-pin bp-8" cx="174" cy="92" r="3" fill="#4A8FE7" />
                <rect className="boot-chip-body" x="48" y="52" rx="4" ry="4" width="104" height="80" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                <rect className="boot-chip-die" x="62" y="62" rx="2" ry="2" width="76" height="60" fill="rgba(74,143,231,0.05)" stroke="rgba(74,143,231,0.15)" strokeWidth="0.5" />
                <text className="boot-mid-text" x="100" y="96" textAnchor="middle" dominantBaseline="central" fill="url(#boot-grad)" fontFamily="var(--font-dm-sans), sans-serif" fontSize="28" fontWeight="800" letterSpacing="5">MID</text>
                <text className="boot-se-text" x="100" y="113" textAnchor="middle" fill="#4A8FE7" fontFamily="var(--font-ibm-plex-mono), monospace" fontSize="6.5" fontWeight="500" letterSpacing="2.5">SECURE ELEMENT</text>
                <defs>
                  <linearGradient id="boot-grad" x1="75" y1="85" x2="125" y2="105">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="0.5" stopColor="#E0EEFF" />
                    <stop offset="1" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="boot-progress"><div className="boot-progress-fill"></div></div>
              <div className="boot-status-label">INITIALIZING SECURE ENCLAVE...</div>
              <div className="boot-flash"></div>
            </div>

            {/* MID WALLET APP (revealed after boot) */}
            <div className="phone-wallet-app" id="phoneWalletApp">
              <div className="mw-status-bar">
                <span className="mw-time">9:41</span>
                <div className="mw-indicators">
                  <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
                    <rect x="0" y="4" width="3" height="8" rx="0.8" fill="rgba(255,255,255,0.45)" />
                    <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.8" fill="rgba(255,255,255,0.45)" />
                    <rect x="9" y="0" width="3" height="12" rx="0.8" fill="rgba(255,255,255,0.45)" />
                  </svg>
                  <svg width="20" height="10" viewBox="0 0 22 12" fill="none">
                    <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                    <rect x="19" y="3.5" width="2.5" height="5" rx="1" fill="rgba(255,255,255,0.25)" />
                    <rect x="2" y="2" width="13" height="8" rx="1.5" fill="rgba(255,255,255,0.45)" />
                  </svg>
                </div>
              </div>
              <a href="/mid-wallet.html" target="_blank" rel="noopener noreferrer" className="mw-header" style={{ textDecoration: 'none' }}>
                <div className="mw-brand">
                  <div className="mw-app-icon">
                    <svg viewBox="0 0 40 40" fill="none">
                      <line x1="15" y1="10" x2="15" y2="6" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.5" />
                      <line x1="20" y1="10" x2="20" y2="5" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.6" />
                      <line x1="25" y1="10" x2="25" y2="6" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.5" />
                      <circle cx="15" cy="5.5" r="1" fill="#4A8FE7" opacity="0.7" />
                      <circle cx="20" cy="4.5" r="1.2" fill="#4A8FE7" opacity="0.85" />
                      <circle cx="25" cy="5.5" r="1" fill="#4A8FE7" opacity="0.7" />
                      <line x1="15" y1="30" x2="15" y2="34" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.5" />
                      <line x1="20" y1="30" x2="20" y2="35" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.6" />
                      <line x1="25" y1="30" x2="25" y2="34" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.5" />
                      <circle cx="15" cy="34.5" r="1" fill="#4A8FE7" opacity="0.7" />
                      <circle cx="20" cy="35.5" r="1.2" fill="#4A8FE7" opacity="0.85" />
                      <circle cx="25" cy="34.5" r="1" fill="#4A8FE7" opacity="0.7" />
                      <line x1="9" y1="20" x2="5" y2="20" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.55" />
                      <circle cx="4.5" cy="20" r="1" fill="#4A8FE7" opacity="0.75" />
                      <line x1="31" y1="20" x2="35" y2="20" stroke="#4A8FE7" strokeWidth="0.5" opacity="0.55" />
                      <circle cx="35.5" cy="20" r="1" fill="#4A8FE7" opacity="0.75" />
                      <rect x="9" y="10" rx="1.5" ry="1.5" width="22" height="20" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      <rect x="12.5" y="13" rx="0.8" ry="0.8" width="15" height="14" fill="rgba(74,143,231,0.04)" stroke="rgba(74,143,231,0.12)" strokeWidth="0.3" />
                      <text x="20" y="21.5" textAnchor="middle" dominantBaseline="central" fill="white" fontFamily="var(--font-dm-sans), sans-serif" fontSize="6.5" fontWeight="800" letterSpacing="1.2">MID</text>
                    </svg>
                  </div>
                  <span className="mw-app-title">MID Wallet</span>
                </div>
                <div className="mw-header-btns">
                  <div className="mw-hdr-btn"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="6" /><path d="M16.5 16.5L20 20" /></svg></div>
                  <div className="mw-hdr-btn"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></div>
                </div>
              </a>
              <div className="mw-balance">
                <div className="mw-balance-label">Total Balance</div>
                <div className="mw-balance-amount">$171,513<span className="mw-currency">.56</span></div>
                <div className="mw-balance-change">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5 2L8.5 7H1.5L5 2Z" fill="currentColor" /></svg>
                  +$4,283.12 (2.56%)
                </div>
              </div>
              <div className="mw-actions">
                <div className="mw-act mw-act--primary"><svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg><span>Buy</span></div>
                <div className="mw-act"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7M17 7H10M17 7v7" /></svg><span>Send</span></div>
                <div className="mw-act"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M17 7L7 17M7 17h7M7 17V10" /></svg><span>Receive</span></div>
                <div className="mw-act"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg><span>Swap</span></div>
              </div>
              <div className="mw-id-card">
                <div className="mw-id-row">
                  <div className="mw-id-avatar"><img src="/IDphoto.jpg" alt="" /></div>
                  <div className="mw-id-info">
                    <div className="mw-id-name">Nuo Wang</div>
                    <div className="mw-id-num">MS-DR-2025-004817</div>
                  </div>
                  <div className="mw-id-badge"><div className="mw-id-dot"></div><span>Active</span></div>
                </div>
              </div>
              <div className="mw-section-hdr"><span>Montserrat Network</span><span className="mw-see-all">See all</span></div>
              <div className="mw-asset-group">
                <div className="mw-asset">
                  <div className="mw-asset-icon mw-asset-icon--msd">
                    <svg viewBox="0 0 34 34" fill="none">
                      <path d="M17 4L28 10.5v13L17 30 6 23.5v-13L17 4z" fill="none" stroke="#4A8FE7" strokeWidth="0.8" opacity="0.4" />
                      <text x="17" y="21.5" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="var(--font-dm-sans), sans-serif" letterSpacing="-0.5">M</text>
                      <text x="23.5" y="16" textAnchor="middle" fill="#4A8FE7" fontSize="7.5" fontWeight="700" opacity="0.85">$</text>
                    </svg>
                  </div>
                  <div className="mw-asset-info"><div className="mw-asset-name">MSD</div><div className="mw-asset-amt">10,000.00 MSD</div></div>
                  <div className="mw-asset-vals"><div className="mw-asset-price">$10,000.00</div><div className="mw-asset-chg mw-asset-chg--stable">Stable</div></div>
                </div>
              </div>
              <div className="mw-section-hdr"><span>Assets</span><span className="mw-see-all">Manage</span></div>
              <div className="mw-asset-group">
                <div className="mw-asset">
                  <div className="mw-asset-icon mw-asset-icon--btc">
                    <svg viewBox="0 0 24 24" fill="white"><path d="M13 4.5V6c1.5.2 2.7.9 3 2.2h-1.7c-.2-.7-.8-.8-1.3-.8-.7 0-1.3.3-1.3.9s.4.8 1.5 1c1.7.4 2.8.9 2.8 2.3 0 1.3-1 2.2-3 2.4v1.5h-.8V14c-1.7-.3-2.8-1.1-3-2.4h1.7c.2.8.9 1 1.3 1 .8 0 1.3-.3 1.3-.9s-.3-.8-1.5-1c-1.5-.4-2.8-.8-2.8-2.3 0-1.2 1-2 2.5-2.2V4.5H13z" /></svg>
                  </div>
                  <div className="mw-asset-info"><div className="mw-asset-name">Bitcoin</div><div className="mw-asset-amt">5.873 BTC</div></div>
                  <div className="mw-asset-vals"><div className="mw-asset-price">$152,694</div><div className="mw-asset-chg mw-asset-chg--up">+4.7%</div></div>
                </div>
                <div className="mw-asset">
                  <div className="mw-asset-icon mw-asset-icon--eth">
                    <svg viewBox="0 0 24 24" fill="white" opacity="0.95"><path d="M12 3L6 12.5 12 16l6-3.5L12 3zM6 13.8L12 20l6-6.2L12 17.3 6 13.8z" /></svg>
                  </div>
                  <div className="mw-asset-info"><div className="mw-asset-name">Ethereum</div><div className="mw-asset-amt">11.420 ETH</div></div>
                  <div className="mw-asset-vals"><div className="mw-asset-price">$18,819</div><div className="mw-asset-chg mw-asset-chg--up">+5.2%</div></div>
                </div>
                <div className="mw-asset">
                  <div className="mw-asset-icon mw-asset-icon--usdc">
                    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.5" stroke="white" strokeWidth="1.2" opacity="0.9" /><text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="9.5" fontWeight="700" fontFamily="var(--font-dm-sans), sans-serif">$</text></svg>
                  </div>
                  <div className="mw-asset-info"><div className="mw-asset-name">USDC</div><div className="mw-asset-amt">1,500.00 USDC</div></div>
                  <div className="mw-asset-vals"><div className="mw-asset-price">$1,500</div><div className="mw-asset-chg mw-asset-chg--stable">Stable</div></div>
                </div>
              </div>
              <div className="mw-tab-bar">
                <div className="mw-tab mw-tab--active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg><span>Home</span></div>
                <div className="mw-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg><span>Card</span></div>
                <div className="mw-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg><span>Activity</span></div>
                <div className="mw-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3-7 7-7s7 3 7 7" /></svg><span>Profile</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
