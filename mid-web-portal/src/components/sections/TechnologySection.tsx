import React from 'react';

export default function TechnologySection() {
  return (
    <section id="technology">
      <div className="container">
        <div className="tech-content reveal">
          <div className="tech-text">
            <span className="label">Platform Foundation</span>
            <h3>Sovereign-Grade Architecture</h3>
            <p>Built on government-controlled digital infrastructure with blockchain verification, ensuring data integrity, privacy, and sovereign ownership of all resident information.</p>
            <p>The platform is designed for scalability and interoperability, supporting future expansion into digital wallets, stable-coin infrastructure, IBC registration, and cross-jurisdictional identity verification.</p>
          </div>
          <div className="tech-stack">
            <div className="tech-item">
              <div className="tech-item-icon">⛓</div>
              <div className="tech-item-text">
                <h4>Blockchain Identity Registry</h4>
                <p>Immutable sovereign identity records with cryptographic verification</p>
              </div>
            </div>
            <div className="tech-item">
              <div className="tech-item-icon">🔒</div>
              <div className="tech-item-text">
                <h4>End-to-End Encryption</h4>
                <p>Military-grade encryption for all data transmission and storage</p>
              </div>
            </div>
            <div className="tech-item">
              <div className="tech-item-icon">🛡</div>
              <div className="tech-item-text">
                <h4>KYC/AML Integration</h4>
                <p>Automated compliance screening aligned with international standards</p>
              </div>
            </div>
            <div className="tech-item">
              <div className="tech-item-icon">🌍</div>
              <div className="tech-item-text">
                <h4>Cross-Border Interoperability</h4>
                <p>Designed for recognition across jurisdictions and partner institutions</p>
              </div>
            </div>
            <div className="tech-item">
              <div className="tech-item-icon">📊</div>
              <div className="tech-item-text">
                <h4>Real-Time Analytics Dashboard</h4>
                <p>Government oversight with live programme metrics and compliance monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
