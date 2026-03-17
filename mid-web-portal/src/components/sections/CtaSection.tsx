import React from 'react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="cta-section" id="apply">
      <div className="container">
        <span className="label label-block">Ready to Begin</span>
        <h2>Apply for Montserrat<br/>Digital Residency</h2>
        <p>Join the next generation of sovereign digital participation.</p>
        <Link href="#apply" className="btn-primary btn-relative">
          Begin Application &rarr;
        </Link>
      </div>
    </section>
  );
}
