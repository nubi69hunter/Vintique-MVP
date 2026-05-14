import { useEffect, useRef, useState } from 'react';
import './pitch.css';

export default function Pitch() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 4 + 'px';
        cursorRef.current.style.top = e.clientY - 4 + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    const fadeUpElems = document.querySelectorAll('.p-fade-up');
    fadeUpElems.forEach(el => observer.observe(el));

    const handleScroll = () => {
      if (navRef.current) {
        if (window.innerWidth <= 900) {
          navRef.current.classList.remove('scrolled');
          return;
        }
        if (window.scrollY > 60) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      fadeUpElems.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="pitch-page">
      <div className="p-cursor" ref={cursorRef}></div>

      {/* NAV */}
      <nav className="p-nav" ref={navRef}>
        <a href="#" className="p-nav-logo">Vintique</a>

        <button
          className={`p-nav-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`p-nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><a href="#how" onClick={() => setIsMobileMenuOpen(false)}>How it works</a></li>
          <li><a href="#opportunity" onClick={() => setIsMobileMenuOpen(false)}>Market</a></li>
          <li><a href="#tech" onClick={() => setIsMobileMenuOpen(false)}>Technology</a></li>
          <li><a href="#roadmap" onClick={() => setIsMobileMenuOpen(false)}>Roadmap</a></li>
          <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="p-hero">
        <div className="p-hero-left">
          <div className="p-hero-tag">Saudi Arabia's First P2P Fashion Marketplace</div>
          <h1 className="p-hero-title">
            Pre-loved.<br />
            <em>Reworn.</em><br />
            Rewired.
          </h1>
          <p className="p-hero-desc">
            Vintique is a peer-to-peer fashion resale marketplace built for Saudi Arabia — where anyone can buy and sell pre-loved clothing, safely and instantly.
          </p>
          <div className="p-hero-ctas">
            <a href="https://vintique-mvp.vercel.app/" target="_blank" rel="noreferrer" className="p-btn-primary">View Live MVP</a>
            <a href="#opportunity" className="p-btn-ghost">See the opportunity</a>
          </div>
        </div>
        <div className="p-hero-right">
          <div className="p-hero-mockup">
            <div className="p-phone">
              <div className="p-phone-notch"><div className="p-phone-notch-inner"></div></div>
              <div className="p-phone-screen">
                <div className="p-phone-header">
                  <div className="p-phone-logo">Vintique</div>
                  <div className="p-phone-location">Riyadh</div>
                </div>
                <div className="p-phone-search">
                  <span>🔍</span>
                  <span>Search pre-loved pieces...</span>
                </div>
                <div className="p-phone-cats">
                  <div className="p-phone-cat active">All</div>
                  <div className="p-phone-cat">Abayas</div>
                  <div className="p-phone-cat">Casual</div>
                  <div className="p-phone-cat">Bags</div>
                </div>
                <div className="p-phone-grid">
                  <div className="p-phone-card">
                    <div className="p-phone-badge">NEW</div>
                    <div className="p-phone-card-img" style={{ background: '#d4c9b8' }}>👗</div>
                    <div className="p-phone-card-info">
                      <div className="p-phone-card-name">Vintage Abaya</div>
                      <div className="p-phone-card-size">Size M · Like New</div>
                      <div className="p-phone-card-price">120 SAR</div>
                    </div>
                  </div>
                  <div className="p-phone-card">
                    <div className="p-phone-card-img" style={{ background: '#c9bfb0' }}>👜</div>
                    <div className="p-phone-card-info">
                      <div className="p-phone-card-name">Leather Tote</div>
                      <div className="p-phone-card-size">One size · Good</div>
                      <div className="p-phone-card-price">85 SAR</div>
                    </div>
                  </div>
                  <div className="p-phone-card">
                    <div className="p-phone-card-img" style={{ background: '#d8d0c4' }}>👠</div>
                    <div className="p-phone-card-info">
                      <div className="p-phone-card-name">Block Heels</div>
                      <div className="p-phone-card-size">38 · Excellent</div>
                      <div className="p-phone-card-price">200 SAR</div>
                    </div>
                  </div>
                  <div className="p-phone-card">
                    <div className="p-phone-badge">HOT</div>
                    <div className="p-phone-card-img" style={{ background: '#cac2b6' }}>🧣</div>
                    <div className="p-phone-card-info">
                      <div className="p-phone-card-name">Silk Scarf</div>
                      <div className="p-phone-card-size">One size · New</div>
                      <div className="p-phone-card-price">65 SAR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="p-marquee-wrap">
        <div className="p-marquee-track">
          <div className="p-marquee-item">VINTAGE <span>✦</span> UNIQUE <span>✦</span> ANTIQUE <span>✦</span> PRE-LOVED <span>✦</span> SUSTAINABLE FASHION <span>✦</span> SAUDI ARABIA <span>✦</span> RESELL <span>✦</span> REWEAR <span>✦</span></div>
          <div className="p-marquee-item">VINTAGE <span>✦</span> UNIQUE <span>✦</span> ANTIQUE <span>✦</span> PRE-LOVED <span>✦</span> SUSTAINABLE FASHION <span>✦</span> SAUDI ARABIA <span>✦</span> RESELL <span>✦</span> REWEAR <span>✦</span></div>
        </div>
      </div>

      {/* STATS */}
      <div className="p-stats">
        <div className="p-stat p-fade-up">
          <div className="p-stat-num">0<span className="p-stat-accent">*</span></div>
          <div className="p-stat-label">Direct competitors in KSA</div>
        </div>
        <div className="p-stat p-fade-up" style={{ transitionDelay: '0.1s' }}>
          <div className="p-stat-num">35<span className="p-stat-accent">M+</span></div>
          <div className="p-stat-label">KSA population, 70% under 35</div>
        </div>
        <div className="p-stat p-fade-up" style={{ transitionDelay: '0.2s' }}>
          <div className="p-stat-num">2-5<span className="p-stat-accent">%</span></div>
          <div className="p-stat-label">Commission per transaction</div>
        </div>
        <div className="p-stat p-fade-up" style={{ transitionDelay: '0.3s' }}>
          <div className="p-stat-num">~<span className="p-stat-accent">0</span></div>
          <div className="p-stat-label">SAR build cost — self-built</div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="p-section" id="how">
        <div className="p-section-eyebrow">The flow</div>
        <h2 className="p-section-title">How <em>Vintique</em> works</h2>
        <div className="p-steps">
          <div className="p-step p-fade-up">
            <div className="p-step-num">01</div>
            <div className="p-step-icon">📸</div>
            <div className="p-step-title">List in 2 minutes</div>
            <div className="p-step-desc">Snap photos, set your price, pick size and condition. Your item is live instantly.</div>
          </div>
          <div className="p-step p-fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="p-step-num">02</div>
            <div className="p-step-icon">💳</div>
            <div className="p-step-title">Buyer pays securely</div>
            <div className="p-step-desc">Payment via MADA, Apple Pay or Visa — held in escrow by Vintique until delivery confirmed.</div>
          </div>
          <div className="p-step p-fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="p-step-num">03</div>
            <div className="p-step-icon">📦</div>
            <div className="p-step-title">Seller ships via Aramex</div>
            <div className="p-step-desc">Generate a shipping label in-app. Book a home pickup. No trips to the post office.</div>
          </div>
          <div className="p-step p-fade-up" style={{ transitionDelay: '0.3s' }}>
            <div className="p-step-num">04</div>
            <div className="p-step-icon">💰</div>
            <div className="p-step-title">Get paid</div>
            <div className="p-step-desc">Buyer confirms delivery. Funds released to your Vintique wallet, transferred to your bank in 1-3 days.</div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY */}
      <section className="p-opportunity" id="opportunity">
        <div>
          <div className="p-opp-eyebrow">The gap</div>
          <h2 className="p-opp-title">A market <em>begging</em> for a solution</h2>
          <p className="p-opp-desc">
            Thrifting culture is exploding in Saudi Arabia. Gen Z is buying and selling pre-loved fashion on WhatsApp groups and Instagram DMs. It's chaotic, unsafe, and slow. No dedicated platform exists.
          </p>
          <div className="p-opp-points">
            <div className="p-opp-point">
              <div className="p-opp-point-dot"></div>
              <div className="p-opp-point-text"><strong>Bazaara</strong> — the only regional P2P fashion app — was acquired in 2024 and exited the market entirely.</div>
            </div>
            <div className="p-opp-point">
              <div className="p-opp-point-dot"></div>
              <div className="p-opp-point-text"><strong>Haraj</strong> is too general, cluttered, and built for electronics not fashion.</div>
            </div>
            <div className="p-opp-point">
              <div className="p-opp-point-dot"></div>
              <div className="p-opp-point-text"><strong>AMUSED</strong> targets luxury only — excludes the everyday seller with a closet full of unworn clothes.</div>
            </div>
            <div className="p-opp-point">
              <div className="p-opp-point-dot"></div>
              <div className="p-opp-point-text">The window is <strong>open right now</strong>. First mover wins.</div>
            </div>
          </div>
        </div>
        <div className="p-opp-right">
          <div className="p-competitor-card">
            <div className="p-comp-name">Bazaara</div>
            <div className="p-comp-status p-status-gone">Exited 2024</div>
            <div className="p-comp-desc">UAE-based P2P fashion app that planned KSA expansion — acquired and shut down before it could.</div>
          </div>
          <div className="p-competitor-card">
            <div className="p-comp-name">Haraj</div>
            <div className="p-comp-status p-status-weak">Not fashion</div>
            <div className="p-comp-desc">General classifieds with 50M+ monthly visitors — but zero fashion focus, trust issues, and poor UX.</div>
          </div>
          <div className="p-competitor-card">
            <div className="p-comp-name">AMUSED</div>
            <div className="p-comp-status p-status-weak">Luxury only</div>
            <div className="p-comp-desc">Authenticated luxury pieces — great for Chanel bags, useless for everyday pre-loved clothing.</div>
          </div>
          <div className="p-vintique-card">
            <div className="p-comp-name" style={{ color: '#F5F0E8' }}>Vintique</div>
            <div className="p-comp-desc" style={{ color: 'rgba(245,240,232,0.6)' }}>The only dedicated P2P fashion resale marketplace for everyday KSA sellers. First mover. Zero direct competition.</div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="p-trust p-section" id="trust">
        <div className="p-section-eyebrow">Safety first</div>
        <h2 className="p-section-title">Built on <em>trust</em></h2>
        <div className="p-trust-grid">
          <div className="p-trust-item p-fade-up">
            <div className="p-trust-icon">🔒</div>
            <div className="p-trust-title">Escrow payments</div>
            <div className="p-trust-desc">Money is held by Vintique until the buyer confirms receipt. Sellers can't ghost. Buyers can't chargeback unfairly.</div>
          </div>
          <div className="p-trust-item p-fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="p-trust-icon">⭐</div>
            <div className="p-trust-title">Seller ratings</div>
            <div className="p-trust-desc">Every completed transaction builds a seller's reputation. Bad actors get flagged fast. Good sellers get rewarded.</div>
          </div>
          <div className="p-trust-item p-fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="p-trust-icon">🛡️</div>
            <div className="p-trust-title">Buyer protection</div>
            <div className="p-trust-desc">48-hour dispute window after delivery. Item not as described? You're covered. No questions asked.</div>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="p-tech" id="tech">
        <div className="p-section-eyebrow" style={{ color: '#B85C3A' }}>Under the hood</div>
        <h2 className="p-section-title" style={{ color: '#F5F0E8' }}>Lean, <em>scalable</em> tech</h2>
        <div className="p-tech-grid">
          <div className="p-tech-card p-fade-up">
            <div className="p-tech-label">Mobile App</div>
            <div className="p-tech-name">React Native</div>
            <div className="p-tech-desc">iOS and Android from a single codebase. Built in-house. No agency, no bloat.</div>
          </div>
          <div className="p-tech-card p-fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="p-tech-label">Backend</div>
            <div className="p-tech-name">Supabase</div>
            <div className="p-tech-desc">Auth, database, storage, and realtime messaging. Scales from day 1 to day 10,000.</div>
          </div>
          <div className="p-tech-card p-fade-up" style={{ transitionDelay: '0.2s' }}>
            <div className="p-tech-label">Payments</div>
            <div className="p-tech-name">Moyasar</div>
            <div className="p-tech-desc">MADA, Apple Pay, Visa. SAMA-licensed. Escrow-ready for marketplace split payments.</div>
          </div>
          <div className="p-tech-card p-fade-up" style={{ transitionDelay: '0.3s' }}>
            <div className="p-tech-label">Shipping</div>
            <div className="p-tech-name">Aramex API</div>
            <div className="p-tech-desc">Label generation and home pickup booking — all inside the app. No external redirects.</div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="p-roadmap p-section" id="roadmap">
        <div className="p-section-eyebrow">The plan</div>
        <h2 className="p-section-title">Road to <em>launch</em></h2>
        <div className="p-timeline">
          <div className="p-tl-item p-fade-up">
            <div>
              <div className="p-tl-phase">Phase 1</div>
              <div className="p-tl-time">Week 1–2</div>
            </div>
            <div>
              <div className="p-tl-title">Foundation & outreach</div>
              <div className="p-tl-tasks">
                <span className="p-tl-task">Register vintique.sa</span>
                <span className="p-tl-task">Aramex API deal</span>
                <span className="p-tl-task">Moyasar escrow confirmation</span>
                <span className="p-tl-task">Wireframes</span>
              </div>
            </div>
          </div>
          <div className="p-tl-item p-fade-up">
            <div>
              <div className="p-tl-phase">Phase 2</div>
              <div className="p-tl-time">Month 1</div>
            </div>
            <div>
              <div className="p-tl-title">Design & branding</div>
              <div className="p-tl-tasks">
                <span className="p-tl-task">Figma wireframes</span>
                <span className="p-tl-task">Brand identity</span>
                <span className="p-tl-task">Supabase setup</span>
                <span className="p-tl-task">DB schema</span>
              </div>
            </div>
          </div>
          <div className="p-tl-item p-fade-up">
            <div>
              <div className="p-tl-phase">Phase 3</div>
              <div className="p-tl-time">Month 2–4</div>
            </div>
            <div>
              <div className="p-tl-title">Build MVP</div>
              <div className="p-tl-tasks">
                <span className="p-tl-task">Auth & profiles</span>
                <span className="p-tl-task">Listings & search</span>
                <span className="p-tl-task">Escrow payments</span>
                <span className="p-tl-task">Shipping integration</span>
                <span className="p-tl-task">In-app messaging</span>
              </div>
            </div>
          </div>
          <div className="p-tl-item p-fade-up">
            <div>
              <div className="p-tl-phase">Phase 4</div>
              <div className="p-tl-time">Month 4–5</div>
            </div>
            <div>
              <div className="p-tl-title">Beta & legal</div>
              <div className="p-tl-tasks">
                <span className="p-tl-task">50–100 Riyadh beta users</span>
                <span className="p-tl-task">Commercial Registration</span>
                <span className="p-tl-task">App Store submission</span>
              </div>
            </div>
          </div>
          <div className="p-tl-item p-fade-up">
            <div>
              <div className="p-tl-phase">Phase 5</div>
              <div className="p-tl-time">Month 5–6</div>
            </div>
            <div>
              <div className="p-tl-title">Public launch</div>
              <div className="p-tl-tasks">
                <span className="p-tl-task">TikTok & Instagram push</span>
                <span className="p-tl-task">Seed listings</span>
                <span className="p-tl-task">Vintique goes live 🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="p-founder">
        <div>
          <p className="p-founder-quote">
            "Saudi Arabia has a generation of young people with closets full of clothes they don't wear. They want to sell. They want to buy. There's just nowhere to do it safely. That's Vintique."
          </p>
          <div className="p-founder-name">Musab Alshehri</div>
          <div className="p-founder-title">Architecture Student · KSU · Solo Builder</div>
          <a href="https://www.linkedin.com/in/thegrinder/" target="_blank" rel="noreferrer" className="p-linkedin-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
        <div className="p-founder-right">
          <div className="p-founder-stat">
            <div className="p-founder-stat-num">~0 SAR</div>
            <div className="p-founder-stat-label">Build cost — self-developed on Supabase</div>
          </div>
          <div className="p-founder-stat">
            <div className="p-founder-stat-num">5–6 mo.</div>
            <div className="p-founder-stat-label">Time to MVP launch</div>
          </div>
          <div className="p-founder-stat">
            <div className="p-founder-stat-num">2-5%</div>
            <div className="p-founder-stat-label">Commission per sale — only revenue when users succeed</div>
          </div>
          <div className="p-founder-stat">
            <div className="p-founder-stat-num">0</div>
            <div className="p-founder-stat-label">Direct competitors in the KSA P2P fashion space today</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="p-cta-section" id="contact">
        <div className="p-cta-bg-text">VINTIQUE</div>
        <div className="p-cta-eyebrow">Join the movement</div>
        <h2 className="p-cta-title">The window<br />is <em>open.</em></h2>
        <p className="p-cta-desc">
          Vintique is looking for support — academic, financial, or mentorship — to bring Saudi Arabia's first P2P fashion resale marketplace to life.
        </p>
        <div className="p-cta-btns">
          <a href="https://vintique-mvp.vercel.app/" target="_blank" rel="noreferrer" className="p-btn-primary">View Live MVP</a>
          <a href="mailto:srtmusab@gmail.com" className="p-btn-ghost">Email us</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="p-footer">
        <div className="p-footer-logo">Vintique</div>
        <div className="p-footer-tagline">Vintage · Antique · Unique</div>
        <div className="p-footer-copy">© 2026 Vintique. Saudi Arabia.</div>
      </footer>
    </div>
  );
}
