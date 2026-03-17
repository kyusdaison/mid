'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import InteractiveIdCard from '../ui/InteractiveIdCard';

export default function HeroSection() {
  const glowRef = useRef<HTMLDivElement>(null);
  const patchRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const starfieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate deep-sky starfield
    if (starfieldRef.current && starfieldRef.current.children.length === 0) {
      const stars: { cls: string, x: number, y: number, dur?: string, lo?: string, hi?: string }[] = [];
      // 80 dim stars
      for (let i = 0; i < 80; i++) {
        stars.push({ cls: 'hero-star hero-star--dim', x: Math.random() * 100, y: Math.random() * 100 });
      }
      // 30 medium stars
      for (let i = 0; i < 30; i++) {
        stars.push({ cls: 'hero-star hero-star--mid', x: Math.random() * 100, y: Math.random() * 100 });
      }
      // 12 bright stars (some twinkle)
      for (let i = 0; i < 12; i++) {
        const twinkle = Math.random() > 0.4;
        stars.push({
          cls: `hero-star hero-star--bright${twinkle ? ' hero-star--twinkle' : ''}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          dur: (3 + Math.random() * 5).toFixed(1),
          lo: (0.08 + Math.random() * 0.15).toFixed(2),
          hi: (0.3 + Math.random() * 0.25).toFixed(2)
        });
      }
      stars.forEach(s => {
        const el = document.createElement('div');
        el.className = s.cls;
        el.style.left = s.x + '%';
        el.style.top = s.y + '%';
        if (s.dur) {
          el.style.setProperty('--dur', s.dur + 's');
          el.style.setProperty('--lo', s.lo || '0');
          el.style.setProperty('--hi', s.hi || '1');
        }
        starfieldRef.current?.appendChild(el);
      });
    }

    // Position glow + stars behind card, at hero level
    const positionElements = () => {
      const glow = glowRef.current;
      const patch = patchRef.current;
      const scene = sceneRef.current;
      const hero = scene?.closest('.hero') as HTMLElement;

      if (!glow || !patch || !scene || !hero) return;

      const heroRect = hero.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      
      // Card is at top of scene, ~400x252
      const cardCenterX = sceneRect.left - heroRect.left + sceneRect.width / 2;
      const cardCenterY = sceneRect.top - heroRect.top + 126; // half card height

      glow.style.left = (cardCenterX - 350) + 'px';
      glow.style.top = (cardCenterY - 250) + 'px';
      patch.style.left = (cardCenterX - 350) + 'px';
      patch.style.top = (cardCenterY - 250) + 'px';
    };

    positionElements();
    window.addEventListener('resize', positionElements);

    // Generate local stars for sky patch
    if (patchRef.current && patchRef.current.children.length === 0) {
      let html = '';
      for (let i = 0; i < 560; i++) {
        html += `<div class="sky-dot sky-dot--sm" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%"></div>`;
      }
      for (let i = 0; i < 280; i++) {
        let cls = 'sky-dot sky-dot--md';
        if (Math.random() > 0.35) cls += ' sky-dot--twinkle';
        const dur = (3 + Math.random() * 5).toFixed(1);
        html += `<div class="${cls}" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-duration:${dur}s"></div>`;
      }
      for (let i = 0; i < 110; i++) {
        const dur = (3 + Math.random() * 6).toFixed(1);
        html += `<div class="sky-dot sky-dot--lg sky-dot--twinkle" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-duration:${dur}s"></div>`;
      }
      patchRef.current.innerHTML = html;
    }

    return () => {
      window.removeEventListener('resize', positionElements);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-glow" id="heroGlow" ref={glowRef}></div>
      <div className="hero-sky-patch" id="heroSkyPatch" ref={patchRef}></div>
      <div className="hero-bg"></div>
      <div className="hero-starfield" id="hero-starfield" ref={starfieldRef}></div>
      <div className="hero-grid"></div>
      <div className="hero-orb"></div>
      
      <div className="container">
        <div className="hero-content">
          {/* LEFT: Text content */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="dot"></span>
              <span>Programme Active — Accepting Applications</span>
            </div>
            <h1>Sovereign Digital Identity for a <em className="italic">Borderless World</em></h1>
            <p className="hero-desc">
              The Montserrat Digital Residency Programme offers a premium, blockchain-authenticated sovereign identity under British Overseas Territory legal standards. Designed for global entrepreneurs, remote professionals, and digital-first citizens.
            </p>
            <div className="hero-actions">
              <Link href="#apply" className="btn-primary">Begin Application &rarr;</Link>
              <Link href="#overview" className="btn-outline">View Programme Details</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">$3,500</div>
                <div className="hero-stat-label">3-Year Entry</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">BOT</div>
                <div className="hero-stat-label">Legal Jurisdiction</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">AML/KYC</div>
                <div className="hero-stat-label">Compliance Grade</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">48hr</div>
                <div className="hero-stat-label">Processing Target</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Digital ID Card */}
          <div className="hero-card-wrapper" ref={sceneRef}>
            <InteractiveIdCard />
          </div>
        </div>
      </div>
    </section>
  );
}
