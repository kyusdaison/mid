import React from 'react';

export default function ProcessSection() {
  return (
    <section id="process" className="section-dark section-grid-bg">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Implementation Track</span>
          <h2>Application <em className="serif text-blue-light">Protocol</em></h2>
          <p>A structured compliance path from application to verified digital residency.</p>
        </div>
        <div className="process-grid reveal">
          <div className="process-step">
            <div className="step-number">01</div>
            <div className="step-label">Phase I</div>
            <h3>Submit Application</h3>
            <p>Complete the digital application with personal details, submit identification documents and proof of address through the secure portal.</p>
          </div>
          <div className="process-step">
            <div className="step-number">02</div>
            <div className="step-label">Phase II</div>
            <h3>KYC/AML Review</h3>
            <p>The Financial Intelligence Unit conducts comprehensive background verification including identity validation and compliance screening.</p>
          </div>
          <div className="process-step">
            <div className="step-number">03</div>
            <div className="step-label">Phase III</div>
            <h3>Fee Processing</h3>
            <p>Upon preliminary approval, application and residency fees are processed. Payment is confirmed through the secure government payment gateway.</p>
          </div>
          <div className="process-step">
            <div className="step-number">04</div>
            <div className="step-label">Phase IV</div>
            <h3>Identity Issuance</h3>
            <p>Blockchain-authenticated digital residency credential issued. Access granted to the resident portal and all associated digital services.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
