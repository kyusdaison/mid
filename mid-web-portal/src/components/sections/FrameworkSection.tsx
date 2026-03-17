import React from 'react';

export default function FrameworkSection() {
  return (
    <section id="framework" className="section-dark section-grid-bg">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Legal Architecture</span>
          <h2>Legislative <em className="serif text-blue-light">Framework</em></h2>
          <p>Built on enacted legislation with clear governance structures and oversight mechanisms.</p>
        </div>
        <div className="legal-grid reveal">
          <div className="legal-card">
            <div className="legal-card-icon">📜</div>
            <div>
              <h3>Digital Residency Bill 2025</h3>
              <p>Primary legislation establishing the legal basis for digital residency, defining rights, obligations, and administrative procedures under Montserrat law.</p>
            </div>
          </div>
          <div className="legal-card">
            <div className="legal-card-icon">🏛</div>
            <div>
              <h3>Digital Residency Office</h3>
              <p>Statutory government body led by a Director appointed by the Minister, responsible for all programme operations, policy implementation, and resident oversight.</p>
            </div>
          </div>
          <div className="legal-card">
            <div className="legal-card-icon">🔍</div>
            <div>
              <h3>FIU Compliance</h3>
              <p>All applicants undergo comprehensive KYC/AML screening through the Financial Intelligence Unit, ensuring alignment with international anti-money laundering standards.</p>
            </div>
          </div>
          <div className="legal-card">
            <div className="legal-card-icon">⚖</div>
            <div>
              <h3>Ministerial Authority</h3>
              <p>The responsible Minister retains sovereign authority over programme policy, including denial and revocation powers, blacklisted jurisdictions, and regulatory adjustments.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
