import React from 'react';

export default function OverviewSection() {
  return (
    <section id="overview" className="section-dark section-grid-bg">
      <div className="container">
        <div className="overview-grid reveal">
          <div className="overview-text">
            <span className="label">Programme Mandate</span>
            <h3>A New Model for Sovereign Digital Participation</h3>
            <p>
              The Montserrat Digital Residency Programme establishes a lawful, compliance-ready framework for non-residents to obtain a verified digital identity anchored in British Overseas Territory legislation.
            </p>
            <p>
              Enacted through the <strong className="text-blue-light">Digital Residency Bill 2025</strong>, the programme is governed by the Digital Residency Office under Ministerial authority, with all identity verification conducted by the Financial Intelligence Unit (FIU).
            </p>
            <p>
              The Government of Montserrat retains full sovereign control over policy, data, and programme governance, ensuring that the digital residency infrastructure serves national interests and maintains the highest standards of public trust.
            </p>
          </div>
          <div className="overview-sidebar">
            <h4>Programme Architecture</h4>
            <div className="sidebar-item">
              <div className="sidebar-icon">⚖</div>
              <div>
                <div className="sidebar-item-title">Digital Residency Office</div>
                <div className="sidebar-item-desc">Government body led by a Director, responsible for programme operations</div>
              </div>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon">🔍</div>
              <div>
                <div className="sidebar-item-title">Financial Intelligence Unit</div>
                <div className="sidebar-item-desc">Conducts KYC/AML background checks on all applicants</div>
              </div>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon">🏛</div>
              <div>
                <div className="sidebar-item-title">Ministerial Authority</div>
                <div className="sidebar-item-desc">Final authority over denials, revocations, and blacklisted jurisdictions</div>
              </div>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon">⚡</div>
              <div>
                <div className="sidebar-item-title">Digital Infrastructure</div>
                <div className="sidebar-item-desc">Sovereign-grade platform with blockchain identity verification</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
