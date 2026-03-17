'use client';

import React, { useState } from 'react';

const faqs = [
  {
    q: 'What is the Montserrat Digital Residency Programme?',
    a: 'It is a government-operated programme that allows non-residents to obtain a verified digital identity under Montserrat law — a British Overseas Territory. This digital residency provides access to business formation, financial services, document authentication, and participation in the digital economy, all without physical relocation.',
  },
  {
    q: 'What legal authority governs the programme?',
    a: 'The programme is established by the Digital Residency Bill 2025, enacted by the Government of Montserrat. It is administered by the Digital Residency Office under Ministerial authority, with compliance screening conducted by the Financial Intelligence Unit (FIU).',
  },
  {
    q: 'How much does digital residency cost?',
    a: 'The initial 3-year entry costs $3,500 USD. Renewal for 5 years costs $3,000 USD. All fees include KYC/AML verification, digital identity issuance, and full access to the resident services portal.',
  },
  {
    q: 'Does this grant physical residency or citizenship?',
    a: 'No. Digital residency is a verified digital identity status. It does not confer physical residency, citizenship, right of abode, or immigration benefits. It provides a legal framework for digital participation in Montserrat\'s economy and governance systems.',
  },
  {
    q: 'What compliance standards are applied?',
    a: 'All applicants undergo comprehensive KYC (Know Your Customer) and AML (Anti-Money Laundering) screening through the Financial Intelligence Unit. The programme aligns with international compliance standards and British Overseas Territory regulatory frameworks.',
  },
  {
    q: 'Who built and operates the technology platform?',
    a: 'The technology platform is developed and operated under government oversight. The Government of Montserrat retains full sovereign control over policy, data governance, and programme administration. All infrastructure meets international security and compliance standards.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-dark">
      <div className="container">
        <div className="section-header reveal">
          <span className="label">Information</span>
          <h2>Frequently Asked <em className="serif text-blue-light">Questions</em></h2>
        </div>
        <div className="faq-list reveal">
          {faqs.map((faq, i) => (
            <div className={`faq-item ${openIndex === i ? 'open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => toggleOpen(i)}>
                <span>{faq.q}</span>
                <span className="faq-toggle">+</span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
