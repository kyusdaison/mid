import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Montserrat Digital Residency</h3>
            <p>An official programme of the Government of Montserrat, a British Overseas Territory. Operated under the Digital Residency Bill 2025 with sovereign-grade digital infrastructure.</p>
          </div>
          <div className="footer-col">
            <h4>Programme</h4>
            <Link href="#overview">Overview</Link>
            <Link href="#benefits">Benefits</Link>
            <Link href="#process">Application</Link>
            <Link href="#pricing">Pricing</Link>
          </div>
          <div className="footer-col">
            <h4>Governance</h4>
            <Link href="#framework">Legal Framework</Link>
            <Link href="#technology">Technology</Link>
            <Link href="#economics">Economics</Link>
            <Link href="#roadmap">Roadmap</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="#framework">Legislation Text</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="https://montserrat.gov.ms/press" target="_blank" rel="noopener noreferrer">Press Kit</Link>
            <Link href="#cta">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Government of Montserrat. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="https://montserrat.gov.ms/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
            <Link href="https://montserrat.gov.ms/terms" target="_blank" rel="noopener noreferrer">Terms of Use</Link>
            <Link href="https://montserrat.gov.ms/accessibility" target="_blank" rel="noopener noreferrer">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
