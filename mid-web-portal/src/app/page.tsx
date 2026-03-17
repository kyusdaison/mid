'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import OverviewSection from '@/components/sections/OverviewSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import PricingSection from '@/components/sections/PricingSection';
import FrameworkSection from '@/components/sections/FrameworkSection';
import TechnologySection from '@/components/sections/TechnologySection';
import EconomicsSection from '@/components/sections/EconomicsSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import FaqSection from '@/components/sections/FaqSection';
import AdvancedOnboardingFlow from '@/components/sections/AdvancedOnboardingFlow';
import VerificationScanner from '@/components/ui/VerificationScanner';

export default function Home() {
  useEffect(() => {
    // Scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      
      <main>
        <HeroSection />
        <div className="section-divider"></div>

        <OverviewSection />
        <div className="section-divider"></div>

        <BenefitsSection />
        <div className="section-divider"></div>

        <ProcessSection />
        <div className="section-divider"></div>

        <PricingSection />
        <div className="section-divider"></div>

        <FrameworkSection />
        <div className="section-divider"></div>

        <TechnologySection />
        <div className="section-divider"></div>

        <EconomicsSection />
        <div className="section-divider"></div>

        <RoadmapSection />
        <div className="section-divider"></div>

        <FaqSection />
        <div className="section-divider"></div>

        <section className="verify-section" id="verify">
          <div className="container">
            <div className="verify-content reveal">
              <h2 className="verify-title">
                Zero-Knowledge <span>Verification</span>
              </h2>
              <p className="verify-desc" style={{ transitionDelay: '0.1s' }}>
                Experience the cryptographic handshake. Scan this QR code with your MID Wallet to prove your sovereign identity securely.
              </p>
            </div>
            <VerificationScanner />
          </div>
        </section>
        <div className="section-divider"></div>

        <AdvancedOnboardingFlow />
      </main>

      <Footer />
    </>
  );
}
