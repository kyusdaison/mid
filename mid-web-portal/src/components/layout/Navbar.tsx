'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NewsTicker from '../ui/NewsTicker';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = navRef.current;
      if (!navbar) return;
      
      if (window.scrollY > 100) {
        navbar.style.borderBottomColor = 'rgba(74,143,231,0.15)';
        navbar.style.background = 'rgba(10,12,16,0.95)';
      } else {
        navbar.style.borderBottomColor = '';
        navbar.style.background = '';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* GOV TOPBAR */}
      <div className="gov-topbar">
        <div className="container">
          <div className="gov-topbar-left">
            <span className="status-dot"></span>
            <span className="mono text-gov-mono">AN OFFICIAL WEBSITE OF THE GOVERNMENT OF MONTSERRAT</span>
          </div>
          <div className="gov-topbar-right">
            <Link href="https://montserrat.gov.ms" target="_blank" rel="noopener noreferrer">GOV.MS</Link>
            <Link href="#framework">LEGISLATION</Link>
            <Link href="#cta">CONTACT</Link>
          </div>
        </div>
      </div>

      <NewsTicker />

      {/* NAVBAR */}
      <nav id="navbar">
        <div className="nav-inner">
          <Link href="#" className="nav-brand">
            <div className="nav-crest">
              <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="110" cy="110" r="94" stroke="rgba(255,255,255,0.18)" strokeWidth="4" fill="none" />
                <path d="M60 152V72L82 104L110 68L138 104L160 72V152" stroke="rgba(255,255,255,0.38)" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
                <line x1="110" y1="50" x2="110" y2="170" stroke="rgba(74,143,231,0.55)" strokeWidth="3.5" />
                <path d="M110 50C148 50 174 72 174 110C174 148 148 170 110 170" stroke="rgba(74,143,231,0.28)" strokeWidth="3" fill="none" />
              </svg>
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-title">Montserrat</span>
              <span className="nav-brand-sub">Digital Residency</span>
            </div>
          </Link>
          <div className={`nav-links ${isOpen ? 'open' : ''}`} id="navLinks">
            <Link href="#overview">Mandate</Link>
            <Link href="#benefits">Benefits</Link>
            <Link href="#process">Process</Link>
            <Link href="#framework">Framework</Link>
            <Link href="#economics">Economics</Link>
            <Link href="#apply" className="nav-cta">Apply Now &rarr;</Link>
          </div>
          <div className="nav-actions">
            <a href="/mid-wallet.html" className="wallet-link" title="Open MID Wallet">
              <svg className="mid-logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <g fill="rgba(255,255,255,0.7)">
                  <circle cx="50" cy="8" r="2.5" />
                  <circle cx="71" cy="13" r="2.5" />
                  <circle cx="87" cy="29" r="2.5" />
                  <circle cx="92" cy="50" r="2.5" />
                  <circle cx="87" cy="71" r="2.5" />
                  <circle cx="71" cy="87" r="2.5" />
                  <circle cx="50" cy="92" r="2.5" />
                  <circle cx="29" cy="87" r="2.5" />
                  <circle cx="13" cy="71" r="2.5" />
                  <circle cx="8" cy="50" r="2.5" />
                  <circle cx="13" cy="29" r="2.5" />
                  <circle cx="29" cy="13" r="2.5" />
                </g>
                <text x="50" y="54" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-dm-sans), var(--font-inter), sans-serif" fontSize="22" fontWeight="600" fill="rgba(255,255,255,0.85)" letterSpacing="2">MID</text>
              </svg>
              MID Wallet
            </a>
            <Link href="/montserrat-digital-residency-zh.html" className="lang-switch" title="Switch to Chinese">中文/ZH</Link>
            <div className="hamburger" id="hamburger" onClick={() => setIsOpen(!isOpen)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
