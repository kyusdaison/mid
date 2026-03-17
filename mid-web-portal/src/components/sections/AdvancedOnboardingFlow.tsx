'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
import FCDIDRegistryABI from '@/contracts/FCDIDRegistry.json';

export default function AdvancedOnboardingFlow() {
  const { isConnected, connectWallet, setRegisteredFCDID, signer } = useWeb3();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1 State: Domain
  const [domainName, setDomainName] = useState('');
  const [years, setYears] = useState(1);
  const [domainStatus, setDomainStatus] = useState<'idle' | 'available' | 'taken' | 'invalid'>('idle');
  const [isChecking, setIsChecking] = useState(false);

  // Step 2 State: ZKP KYC
  const [zkpStatus, setZkpStatus] = useState<'idle' | 'scanning' | 'hashing' | 'complete'>('idle');

  // Step 3 State: Shipping
  const [shippingData, setShippingData] = useState({ name: '', address: '', country: '' });

  // Step 4 State: Payment
  const [paymentMethod, setPaymentMethod] = useState<'fcc' | 'fiat'>('fcc');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Helper functions
  const getPricePerYear = (name: string) => {
    const len = name.length;
    if (len === 0) return 0;
    if (len <= 3) return 3500;
    if (len === 4) return 1000;
    return 100; // 5+ chars
  };

  const currentPrice = getPricePerYear(domainName);
  const totalPrice = currentPrice * years;
  const fiatPrice = (totalPrice * 0.05).toFixed(2); // Mock exchange rate: 1 FCC = $0.05

  // Navigation handlers
  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Step 1: Domain check effect
  useEffect(() => {
    if (step !== 1) return;
    if (domainName.length === 0) {
      setDomainStatus('idle');
      return;
    }
    const isValid = /^[a-z0-9-]+$/.test(domainName.toLowerCase());
    if (!isValid) {
      setDomainStatus('invalid');
      return;
    }

    setIsChecking(true);
    setDomainStatus('idle');
    const timer = setTimeout(() => {
      const mockTaken = ['satoshi', 'admin', 'montserrat', 'vitalik'].includes(domainName.toLowerCase());
      setDomainStatus(mockTaken ? 'taken' : 'available');
      setIsChecking(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [domainName, step]);

  // Step 2: ZKP simulation trigger
  const simulateZKP = async () => {
    setZkpStatus('scanning');
    await new Promise(r => setTimeout(r, 1500));
    setZkpStatus('hashing');
    await new Promise(r => setTimeout(r, 2000));
    setZkpStatus('complete');
  };

  // Step 4: Final Payment Execution
  const handlePayment = async () => {
    if (!isConnected || !signer) {
      connectWallet();
      return;
    }
    setPaymentStatus('processing');
    
    try {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const registry = new ethers.Contract(contractAddress, FCDIDRegistryABI.abi, signer);
      
      const domainWithoutExt = domainName.toLowerCase();
      // Generate a simple salt
      const salt = ethers.encodeBytes32String("test-salt-123");
      
      console.log("Generating commitment...", domainWithoutExt);
      const address = await signer.getAddress();
      
      // Keccak256(abi.encodePacked(name, msg.sender, salt))
      const commitment = ethers.solidityPackedKeccak256(
        ["string", "address", "bytes32"],
        [domainWithoutExt, address, salt]
      );
      
      console.log("Committing...", commitment);
      const commitTx = await registry.commit(commitment);
      await commitTx.wait();
      
      console.log("Fast-forwarding time to pass MIN_COMMIT_AGE...");
      // Fast forward the local Hardhat node by 61 seconds since we are just testing
      const provider = signer.provider as ethers.JsonRpcProvider;
      if (provider && typeof provider.send === 'function') {
        await provider.send("evm_increaseTime", [61]);
        await provider.send("evm_mine", []);
      }
      
      console.log("Revealing and registering...", domainWithoutExt);
      // Native FCC is acting as ETH on local
      const currentPrice = getPricePerYear(domainWithoutExt);
      // In FCDIDRegistry, getPrice() returns value with 18 decimals, so we need to multiply by 1 ether
      const priceWei = currentPrice === 3500 ? ethers.parseEther("3500") : 
                       currentPrice === 1000 ? ethers.parseEther("1000") : 
                       ethers.parseEther("100");
                       
      // Assuming durationYears = years
      const totalWei = priceWei * BigInt(years);
      
      const regTx = await registry.register(domainWithoutExt, salt, years, {
        value: totalWei
      });
      await regTx.wait();
      
      console.log("Successfully minted FCDID!");
      setPaymentStatus('success');
      setRegisteredFCDID(domainWithoutExt + '.fc');
    } catch (e) {
      console.error("Payment failed", e);
      setPaymentStatus('idle');
      alert("Transaction failed! Check console.");
    }
  };

  // Renderers for each step
  const renderStepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
      {[
        { id: 1, label: 'Identity' },
        { id: 2, label: 'Sovereign KYC' },
        { id: 3, label: 'Cards Logistics' },
        { id: 4, label: 'Activation' }
      ].map((s) => (
        <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: step >= s.id ? 1 : 0.4 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: step === s.id ? 'var(--blue-light)' : (step > s.id ? 'var(--green)' : 'var(--black-elevated)'),
            color: step === s.id || step > s.id ? '#fff' : 'var(--text-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
            border: `2px solid ${step >= s.id ? 'transparent' : 'var(--border)'}`,
            marginBottom: '0.5rem', transition: 'all 0.3s ease'
          }}>
            {step > s.id ? '✓' : s.id}
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-ibm-plex-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="fade-in">
      <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-dm-sans)' }}>Reserve your FCDID</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This serves as your on-chain routing address and digital passport hook.</p>

      <div style={{ display: 'flex', alignItems: 'stretch', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', overflow: 'hidden', padding: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text" placeholder="Search domain (e.g. satoshi)" value={domainName} onChange={(e) => setDomainName(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', padding: '1rem', outline: 'none', fontFamily: 'var(--font-ibm-plex-mono)' }}
        />
        <div style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 1.5rem', color: 'var(--blue-light)', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '1.2rem', fontWeight: 600 }}>.fc</div>
      </div>
      
      <div style={{ height: '24px', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        {isChecking && <span style={{ color: 'var(--text-secondary)' }}>Checking global registry...</span>}
        {!isChecking && domainStatus === 'available' && <span style={{ color: 'var(--green)' }}>✓ Domain available</span>}
        {!isChecking && domainStatus === 'taken' && <span style={{ color: '#F87171' }}>✗ Domain is already registered</span>}
        {!isChecking && domainStatus === 'invalid' && <span style={{ color: '#F87171' }}>✗ Invalid format (lowercase & hyphens only)</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={nextStep} disabled={domainStatus !== 'available'} className="btn-primary">Continue to KYC →</button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="fade-in">
      <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-dm-sans)' }}>Zero-Knowledge KYC</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your biometric data is mathematically hashed locally. Only the ZK-Proof is published on-chain, guaranteeing your absolute privacy.</p>
      
      <div style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem', textAlign: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        {zkpStatus === 'idle' && (
          <div>
            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--blue-light)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <button onClick={simulateZKP} className="btn-outline">Initiate Local Secure Enclave</button>
          </div>
        )}
        
        {zkpStatus === 'scanning' && (
          <div>
            <div className="scan-line-animation" style={{ width: '100%', height: '2px', background: 'var(--blue-light)', position: 'absolute', top: 0, left: 0, boxShadow: '0 0 10px var(--blue-light)' }}></div>
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--blue-bright)' }}>Scanning Identification Document...</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Extracting MRZ and matching FaceID vectors.</p>
          </div>
        )}

        {zkpStatus === 'hashing' && (
          <div>
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', color: 'var(--green)' }}>Generating zk-SNARK Proof...</p>
            <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-dim)', wordBreak: 'break-all', fontFamily: 'var(--font-ibm-plex-mono)', opacity: 0.7 }}>
              0x04838b939c3948302194a0049b49929294829... (Local Hash Only)
            </div>
          </div>
        )}

        {zkpStatus === 'complete' && (
          <div style={{ color: 'var(--green)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-dm-sans)' }}>Proof Generated & Verified</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No raw personal data will be transmitted.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={prevStep} className="btn-outline" style={{ border: 'none' }}>← Back</button>
        <button onClick={nextStep} disabled={zkpStatus !== 'complete'} className="btn-primary">Continue to Logistics →</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="fade-in">
      <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-dm-sans)' }}>Physical Smart Card</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We will ship your cryptographically bound polycarbonate FCDID smart card. Its internal NFC chip acts as your ultimate cold wallet signer.</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        <input type="text" placeholder="Full Legal Name (For Shipping)" value={shippingData.name} onChange={e => setShippingData({...shippingData, name: e.target.value})} style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', color: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '1rem' }} />
        <input type="text" placeholder="Full Address" value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', color: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '1rem' }} />
        <input type="text" placeholder="Country" value={shippingData.country} onChange={e => setShippingData({...shippingData, country: e.target.value})} style={{ background: 'var(--black-elevated)', border: '1px solid var(--border)', color: '#fff', padding: '1rem', borderRadius: '8px', fontSize: '1rem' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={prevStep} className="btn-outline" style={{ border: 'none' }}>← Back</button>
        <button onClick={nextStep} disabled={!shippingData.name || !shippingData.address || !shippingData.country} className="btn-primary">Proceed to Activation →</button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    if (paymentStatus === 'success') {
      return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--green)', boxShadow: '0 0 30px rgba(52,211,153,0.2)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-dm-sans)' }}>Identity Formally Enshrined</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your sovereign vault is now active on the FC Public Chain.</p>
          <p style={{ color: 'var(--green)', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '1.5rem', letterSpacing: '0.05em', marginBottom: '2.5rem' }}>{domainName.toLowerCase()}.fc</p>
          <a href="#hero" className="btn-primary" style={{ padding: '1rem 3rem' }}>View Smart Card</a>
        </div>
      );
    }

    return (
      <div className="fade-in">
        <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff', fontFamily: 'var(--font-dm-sans)' }}>Unified Activation Gateway</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Finalize your {years}-year registration. You can pay via natively routed FC crypto or standard Fiat rails.</p>

        {/* Invoice Summary */}
        <div style={{ background: 'var(--black-elevated)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>FCDID Registration ({years} yr)</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-ibm-plex-mono)' }}>{domainName}.fc</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Physical Card Shipping</span>
            <span style={{ color: 'var(--green)' }}>Included</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '1.2rem', color: '#fff' }}>Total Due</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--blue-bright)', fontWeight: 'bold', fontFamily: 'var(--font-ibm-plex-mono)' }}>{totalPrice.toLocaleString()} FCC</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>≈ ${fiatPrice} USD</div>
            </div>
          </div>
        </div>

        {/* Payment Toggles */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setPaymentMethod('fcc')}
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: paymentMethod === 'fcc' ? 'rgba(74,143,231,0.1)' : 'var(--black-elevated)', border: `1px solid ${paymentMethod === 'fcc' ? 'var(--blue-light)' : 'var(--border)'}`, color: paymentMethod === 'fcc' ? 'var(--blue-light)' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Pay with Web3 Wallet (FCC)
          </button>
          <button 
            onClick={() => setPaymentMethod('fiat')}
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: paymentMethod === 'fiat' ? 'rgba(74,143,231,0.1)' : 'var(--black-elevated)', border: `1px solid ${paymentMethod === 'fiat' ? 'var(--blue-light)' : 'var(--border)'}`, color: paymentMethod === 'fiat' ? 'var(--blue-light)' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Pay with Credit Card (USD)
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={prevStep} className="btn-outline" style={{ border: 'none' }} disabled={paymentStatus === 'processing'}>← Back</button>
          <button 
            onClick={handlePayment} 
            disabled={paymentStatus === 'processing'} 
            className="btn-primary" 
            style={{ padding: '1.2rem 2.5rem' }}
          >
             {!isConnected && paymentMethod === 'fcc' ? 'Connect Wallet to Pay' : (paymentStatus === 'processing' ? 'Signing Transaction...' : `Pay ${paymentMethod === 'fcc' ? totalPrice.toLocaleString() + ' FCC' : '$' + fiatPrice}`)}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="cta-section" id="apply" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(74,143,231,0.03) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label label-block" style={{ marginBottom: '1rem', display: 'block' }}>Sovereignty Onboarding process</span>
          <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-dm-sans)', marginBottom: '1rem', color: '#F4F5F7' }}>
            Claim Your <span style={{ color: 'var(--blue-light)' }}>Digital Sovereignty</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem' }}>
            A cryptographically verifiable pipeline protecting your identity while issuing your physical hardware wallet.
          </p>
        </div>

        <div style={{ background: 'var(--black-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '3.5rem', maxWidth: '800px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', minHeight: '520px' }}>
          
          {paymentStatus !== 'success' && renderStepIndicator()}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanLine { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .scan-line-animation { animation: scanLine 2s infinite ease-in-out; }
      `}} />
    </section>
  );
}
