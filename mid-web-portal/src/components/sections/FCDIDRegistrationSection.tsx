'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';

export default function FCDIDRegistrationSection() {
  const { isConnected, address, connectWallet, setRegisteredFCDID } = useWeb3();
  const [domainName, setDomainName] = useState('');
  const [years, setYears] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'available' | 'taken' | 'invalid'>('idle');
  const [registrationState, setRegistrationState] = useState<'idle' | 'committing' | 'registering' | 'success' | 'error'>('idle');

  // Calculates price per year based on length
  const getPricePerYear = (name: string) => {
    const len = name.length;
    if (len === 0) return 0;
    if (len <= 3) return 3500;
    if (len === 4) return 1000;
    return 100; // 5+ chars
  };

  const currentPrice = getPricePerYear(domainName);
  const totalPrice = currentPrice * years;

  useEffect(() => {
    if (domainName.length === 0) {
      setStatus('idle');
      return;
    }

    // Basic validation: only alphanumeric and hyphens
    const isValid = /^[a-z0-9-]+$/.test(domainName.toLowerCase());
    if (!isValid) {
      setStatus('invalid');
      return;
    }

    setIsChecking(true);
    setStatus('idle');

    // Simulate network delay for checking availability
    const timer = setTimeout(() => {
      // Mock: everything is available unless it explicitly is 'satoshi' or 'admin'
      const mockTaken = ['satoshi', 'admin', 'montserrat', 'vitalik'].includes(domainName.toLowerCase());
      setStatus(mockTaken ? 'taken' : 'available');
      setIsChecking(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [domainName]);

  const handleRegister = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    if (status !== 'available' || registrationState !== 'idle') return;

    setRegistrationState('committing');
    
    // Simulate commit transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRegistrationState('registering');
    
    // Simulate registration transaction
    await new Promise(resolve => setTimeout(resolve, 2500));
    setRegistrationState('success');
    setRegisteredFCDID(domainName.toLowerCase() + '.fc');
  };

  return (
    <section className="cta-section" id="apply" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(74,143,231,0.05) 0%, transparent 60%)',
        zIndex: 0, pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label label-block" style={{ marginBottom: '1rem', display: 'block' }}>Web3 Identity Portal</span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-dm-sans)', marginBottom: '1rem', color: '#F4F5F7' }}>
            Secure Your <span style={{ color: 'var(--blue-light)' }}>.fc</span> Sovereign ID
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Mint your on-chain Montserrat Digital Residency. This FCDID serves as your universal identifier across the entire ecosystem.
          </p>
        </div>

        <div style={{
          background: 'var(--black-card)', border: '1px solid var(--border)', borderRadius: '24px',
          padding: '3rem', maxWidth: '700px', margin: '0 auto', position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}>
          
          {/* Success State Overlay */}
          {registrationState === 'success' && (
            <div style={{
              position: 'absolute', inset: 0, background: 'var(--black-card)', borderRadius: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, border: '1px solid var(--green)', boxShadow: '0 0 30px rgba(52,211,153,0.1)'
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(52,211,153,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-dm-sans)' }}>Identity Minted Successfully</h3>
              <p style={{ color: 'var(--green)', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {domainName.toLowerCase()}.fc
              </p>
              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => { setRegistrationState('idle'); setDomainName(''); setStatus('idle'); }}
                  className="btn-outline"
                >
                  Register Another
                </button>
                <a href="#hero" className="btn-primary">
                  View Smart Card
                </a>
              </div>
            </div>
          )}

          {/* Search Input */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', overflow: 'hidden', padding: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Search domain (e.g. satoshi)" 
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', 
                  padding: '1rem', outline: 'none', fontFamily: 'var(--font-ibm-plex-mono)'
                }}
              />
              <div style={{ 
                background: 'var(--black-elevated)', border: '1px solid var(--border)', borderRadius: '8px',
                display: 'flex', alignItems: 'center', padding: '0 1.5rem', color: 'var(--blue-light)', 
                fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '1.2rem', fontWeight: 600
              }}>
                .fc
              </div>
            </div>
            
            {/* Status indicator */}
            <div style={{ height: '24px', marginTop: '0.75rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '0.85rem' }}>
              {isChecking && <span style={{ color: 'var(--text-secondary)' }}>Checking availability...</span>}
              {!isChecking && status === 'available' && <span style={{ color: 'var(--green)' }}>✓ Available for registration</span>}
              {!isChecking && status === 'taken' && <span style={{ color: '#F87171' }}>✗ Domain is already registered</span>}
              {!isChecking && status === 'invalid' && <span style={{ color: '#F87171' }}>✗ Invalid format (lowercase letters & hyphens only)</span>}
            </div>
          </div>

          {/* Configuration Area (only show fully if available/idle, fade if unavailable) */}
          <div style={{ opacity: status === 'taken' || status === 'invalid' ? 0.4 : 1, transition: 'opacity 0.3s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* Duration Selector */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '1rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>Registration Period</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => setYears(Math.max(1, years - 1))}
                    style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >-</button>
                  <div style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-ibm-plex-mono)' }}>{years} {years === 1 ? 'Year' : 'Years'}</div>
                  <button 
                    onClick={() => setYears(Math.min(10, years + 1))}
                    style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: '0.75rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>Total Cost</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--blue-bright)', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                    {domainName.length > 0 ? totalPrice.toLocaleString() : '0'}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-ibm-plex-mono)' }}>FCC</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  {domainName.length > 0 ? `(${currentPrice.toLocaleString()} FCC / yr)` : '(Enter name for price)'}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="btn-primary" 
              onClick={handleRegister}
              disabled={domainName.length === 0 || status === 'taken' || status === 'invalid' || registrationState !== 'idle' || isChecking}
              style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', justifyContent: 'center' }}
            >
              {!isConnected && 'Connect Wallet to Register'}
              {isConnected && registrationState === 'idle' && status !== 'available' && 'Enter Domain to Register'}
              {isConnected && registrationState === 'idle' && status === 'available' && 'Register Identity'}
              {registrationState === 'committing' && 'Committing Transaction...'}
              {registrationState === 'registering' && 'Confirming Registration...'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-inter)' }}>
              Network fees (Gas) apply. Ensure you have sufficient FCC tokens in your wallet.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
