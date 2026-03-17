import React from 'react';

export default function PricingSection() {
  return (
    <section id="pricing">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Fee Schedule</span>
          <h2>Programme <em className="serif text-blue-light">Pricing</em></h2>
          <p>Transparent, fixed-term pricing with no hidden costs.</p>
        </div>
        <div className="pricing-grid reveal">
          <div className="pricing-card pricing-featured">
            <div className="pricing-tier">Initial Entry</div>
            <div className="pricing-amount">$3,500 <small>/ 3 years</small></div>
            <p className="pricing-desc">Full access to the Digital Residency Programme with a three-year initial term.</p>
            <ul className="pricing-features">
              <li>Blockchain-authenticated digital identity</li>
              <li>KYC/AML verification included</li>
              <li>Government digital services portal</li>
              <li>Document authentication access</li>
              <li>Business formation eligibility</li>
              <li>48-hour processing target</li>
            </ul>
          </div>
          <div className="pricing-card">
            <div className="pricing-tier">Renewal</div>
            <div className="pricing-amount">$3,000 <small>/ 5 years</small></div>
            <p className="pricing-desc">Extended five-year renewal with continued access to all programme benefits.</p>
            <ul className="pricing-features">
              <li>All initial entry benefits</li>
              <li>Extended 5-year term</li>
              <li>Streamlined renewal process</li>
              <li>Priority service access</li>
              <li>Reduced per-year cost</li>
              <li>Continuous identity verification</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
