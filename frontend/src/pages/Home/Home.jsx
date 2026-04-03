import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid-overlay"></div>
        </div>

        <div className="hero-content animate-fade-in-up">

          <h1 className="hero-title">
            Smart <span className="gradient-text">Patient Care</span><br />
            Management System
          </h1>
          <p className="hero-subtitle">
            Streamline your hospital operations with our intelligent platform. Manage patients,
            prescriptions, billing, QR profiles, and staff — all from one powerful dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg btn-glow" id="btn-get-started">
              Get Started
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#features" className="btn btn-glass btn-lg" id="btn-learn-more">
              Explore Features
            </a>
          </div>


        </div>

        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="preview-title">ApexCare Dashboard</span>
            </div>
            <img src="/dashboard.png" alt="ApexCare Dashboard" className="preview-image" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header animate-fade-in">
            <span className="section-badge">Features</span>
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Manage</span> Your Hospital
            </h2>
            <p className="section-desc">
              A comprehensive suite of tools designed for modern healthcare facilities.
            </p>
          </div>

          <div className="features-grid stagger">
            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon fi-primary">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Patient Management</h3>
              <p>Register, track, and manage patient records with detailed medical histories, room assignments, and treatment status.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon fi-accent">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h6"/><path d="M11 6h2a2 2 0 0 1 0 4h-2"/><path d="m13 10 2 4"/>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
              </div>
              <h3>Prescription & Medical Records</h3>
              <p>Create detailed prescriptions with medicine tracking, dosage, frequency, timing, and generate professional PDF reports.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon fi-cyan">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                  <path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/>
                </svg>
              </div>
              <h3>Billing & Invoicing</h3>
              <p>Generate patient invoices with line items, tax calculation, payment tracking, and downloadable professional PDF invoices.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon fi-violet">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3>QR Code Patient Profiles</h3>
              <p>Generate unique QR codes for each patient. Scan opens a public portal with full medical history, allergies, and prescriptions.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon fi-amber">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
                </svg>
              </div>
              <h3>Doctor & Staff Directory</h3>
              <p>Manage doctor profiles, specializations, nurse shifts, and staff operations with complete role-based directory management.</p>
            </div>

            <div className="feature-card glass-card animate-fade-in">
              <div className="feature-icon fi-rose">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Secure Role-Based Access</h3>
              <p>JWT authentication with role-based dashboards for Admin, Doctor, Nurse, and Staff. Each role sees only what they need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how">
        <div className="section-container">
          <div className="section-header animate-fade-in">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">
              Get Running in <span className="gradient-text">3 Simple</span> Steps
            </h2>
          </div>

          <div className="steps-grid stagger">
            <div className="step-card animate-fade-in">
              <div className="step-number">01</div>
              <h3>Register & Login</h3>
              <p>Create an account as Doctor, Nurse, or Staff. Admin accounts are securely provisioned via database.</p>
            </div>
            <div className="step-connector">
              <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="var(--primary-300)" strokeWidth="2" strokeDasharray="6 4"/></svg>
            </div>
            <div className="step-card animate-fade-in">
              <div className="step-number">02</div>
              <h3>Manage Records</h3>
              <p>Add patients, write prescriptions, generate invoices, and create QR profiles — all from the dashboard.</p>
            </div>
            <div className="step-connector">
              <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="var(--primary-300)" strokeWidth="2" strokeDasharray="6 4"/></svg>
            </div>
            <div className="step-card animate-fade-in">
              <div className="step-number">03</div>
              <h3>Share & Export</h3>
              <p>Download PDF prescriptions & invoices, share QR codes with patients for instant access to their records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text animate-slide-left">
              <span className="section-badge">About Us</span>
              <h2 className="section-title">
                Built for <span className="gradient-text">Modern</span> Healthcare
              </h2>
              <p className="about-desc">
                ApexCare is designed from the ground up to handle the complexities of modern hospital
                management. Our system integrates seamlessly with your existing workflows while providing
                powerful new capabilities.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="about-check">✓</div>
                  <span>Full prescription management with PDF export</span>
                </div>
                <div className="about-feature">
                  <div className="about-check">✓</div>
                  <span>Patient billing with invoice generation</span>
                </div>
                <div className="about-feature">
                  <div className="about-check">✓</div>
                  <span>QR code profiles for instant patient lookup</span>
                </div>
                <div className="about-feature">
                  <div className="about-check">✓</div>
                  <span>Role-based access for Admin, Doctor, Nurse, Staff</span>
                </div>
                <div className="about-feature">
                  <div className="about-check">✓</div>
                  <span>Real-time analytics & overview dashboard</span>
                </div>
              </div>
            </div>
            <div className="about-visual animate-slide-right">
              <div className="about-card-stack">
                <div className="about-float-card afc-1">
                  <div className="afc-icon afc-icon-1">👨‍⚕️</div>
                  <div>
                    <strong>Doctor Portal</strong>
                    <p>Prescriptions & Patient Records</p>
                  </div>
                </div>
                <div className="about-float-card afc-2">
                  <div className="afc-icon afc-icon-2">📱</div>
                  <div>
                    <strong>QR Scan Access</strong>
                    <p>Instant Patient Profile Lookup</p>
                  </div>
                </div>
                <div className="about-float-card afc-3">
                  <div className="afc-icon afc-icon-3">📄</div>
                  <div>
                    <strong>PDF Generation</strong>
                    <p>Prescriptions & Invoices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="section-container">
          <div className="contact-card glass-card">
            <div className="contact-content">
              <span className="section-badge">Contact</span>
              <h2 className="section-title">
                Ready to <span className="gradient-text">Transform</span> Your Hospital?
              </h2>
              <p className="contact-desc">
                Get in touch with our team to learn how ApexCare can help modernize your healthcare operations.
              </p>
              <div className="contact-info-row">
                <div className="contact-info-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>contact@apexcare.com</span>
                </div>
                <div className="contact-info-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              <Link to="/login" className="btn btn-primary btn-lg btn-glow" id="btn-contact-start">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-highlight">Apex</span>Care
            <span className="footer-copy">© 2026 All rights reserved.</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
