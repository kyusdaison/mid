import React from 'react';

export default function RoadmapSection() {
  return (
    <section id="roadmap">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Deployment Schedule</span>
          <h2>Programme <em className="serif text-blue-light">Roadmap</em></h2>
        </div>
        <div className="roadmap-grid reveal">
          <div className="roadmap-phase">
            <div className="phase-tag">Phase I</div>
            <div className="phase-year">2025 — Q3/Q4</div>
            <h3>Foundation</h3>
            <p>Legislative enactment, Digital Residency Office establishment, platform deployment, initial KYC/AML pipeline activation.</p>
          </div>
          <div className="roadmap-phase">
            <div className="phase-tag">Phase II</div>
            <div className="phase-year">2026 — Q1/Q2</div>
            <h3>Market Entry</h3>
            <p>First 1,000 digital residents onboarded. IBC registration services launched. International marketing programme activated.</p>
          </div>
          <div className="roadmap-phase">
            <div className="phase-tag">Phase III</div>
            <div className="phase-year">2026 — Q3/Q4</div>
            <h3>Expansion</h3>
            <p>Digital wallet and financial services integration. Document authentication platform. Partner jurisdiction agreements.</p>
          </div>
          <div className="roadmap-phase">
            <div className="phase-tag">Phase IV</div>
            <div className="phase-year">2027+</div>
            <h3>Scale</h3>
            <p>Stable-coin infrastructure. Cross-border identity interoperability. Full digital economy ecosystem with scaled revenue generation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
