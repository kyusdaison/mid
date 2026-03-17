import React from 'react';

export default function NewsTicker() {
  return (
    <div className="ticker">
      <div className="ticker-inner">
        <span className="ticker-tag">DISPATCH</span>
        <span className="ticker-item">
          DIGITAL RESIDENCY BILL 2025 ENACTED — PROGRAMME OPEN FOR APPLICATIONS{' '}
          <span className="source">gov.ms</span>
        </span>
        <span className="ticker-sep">◆</span>
        <span className="ticker-item">
          BRITISH OVERSEAS TERRITORY LEGAL FRAMEWORK — HIGHEST COMPLIANCE STANDARDS{' '}
          <span className="source">verified</span>
        </span>
        <span className="ticker-sep">◆</span>
        <span className="ticker-item">
          SOVEREIGN DIGITAL IDENTITY — BLOCKCHAIN-AUTHENTICATED CREDENTIALS{' '}
          <span className="source">verified</span>
        </span>
        <span className="ticker-sep">◆</span>
        <span className="ticker-item">
          10-YEAR PROJECTION: $73M+ DIRECT GOVERNMENT REVENUE{' '}
          <span className="source">forecast</span>
        </span>
        <span className="ticker-sep">◆</span>
        {/* Duplicate for seamless loop */}
        <span className="ticker-tag">DISPATCH</span>
        <span className="ticker-item">
          DIGITAL RESIDENCY BILL 2025 ENACTED — PROGRAMME OPEN FOR APPLICATIONS{' '}
          <span className="source">gov.ms</span>
        </span>
        <span className="ticker-sep">◆</span>
        <span className="ticker-item">
          BRITISH OVERSEAS TERRITORY LEGAL FRAMEWORK — HIGHEST COMPLIANCE STANDARDS{' '}
          <span className="source">verified</span>
        </span>
        <span className="ticker-sep">◆</span>
        <span className="ticker-item">
          SOVEREIGN DIGITAL IDENTITY — BLOCKCHAIN-AUTHENTICATED CREDENTIALS{' '}
          <span className="source">verified</span>
        </span>
        <span className="ticker-sep">◆</span>
        <span className="ticker-item">
          10-YEAR PROJECTION: $73M+ DIRECT GOVERNMENT REVENUE{' '}
          <span className="source">forecast</span>
        </span>
      </div>
    </div>
  );
}
