import React from 'react';

export default function BenefitsSection() {
  return (
    <section id="benefits">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Resident Capabilities</span>
          <h2>What Digital Residency <em className="serif text-blue-light">Unlocks</em></h2>
          <p>
            A verified digital identity under British Overseas Territory law, enabling cross-border access to services, commerce, and governance.
          </p>
        </div>
        <div className="benefits-grid reveal">
          <div className="benefit-card">
            <div className="benefit-icon">🌐</div>
            <h3>Global Business Formation</h3>
            <p>Establish and operate international business companies registered in a British Overseas Territory jurisdiction with transparent regulatory standards.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔐</div>
            <h3>Sovereign Digital Identity</h3>
            <p>Blockchain-authenticated digital identity with cryptographic proof of residency status, verifiable by third parties and government institutions.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💳</div>
            <h3>Digital Financial Services</h3>
            <p>Access to compliant digital wallets, banking integration, and future stable-coin infrastructure under regulated financial frameworks.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📄</div>
            <h3>Document Authentication</h3>
            <p>Government-backed digital notarisation and document certification services with full international legal recognition.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🏢</div>
            <h3>IBC Registration</h3>
            <p>Streamlined international business company registration through the digital platform with real-time compliance monitoring.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h3>Governance Participation</h3>
            <p>Digital tools for civic engagement, public consultations, and participation in the Montserrat digital economy ecosystem.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
