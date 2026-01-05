import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Instagram, Youtube, Mail, MapPin, Phone, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(Boolean(session?.user));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h4>About VN Stores</h4>
            <p>
              VN Stores is your ultimate destination for premium video templates and creative assets. 
              Elevate your content creation with our curated collection of cinematic, trending, and 
              professional-grade templates.
            </p>
            <div className="social-links">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                title="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@vnstores.com" 
                className="social-icon"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/">Templates</a>
            <a href="/profile">My Orders</a>
            {!isLoggedIn && <a href="/login">Login</a>}
            <a href="#">Browse Collections</a>
            <a href="#">Trending Now</a>
            <a href="#">New Arrivals</a>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <a href="/help-center">Help Center</a>
            <a href="/help-center">FAQ</a>
            <a href="/contact-us">Contact Us</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/refund-policy">Refund Policy</a>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Get in Touch</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Mail size={18} color="var(--brand-primary)" />
              <a href="mailto:support@vnstores.com" style={{ display: 'inline' }}>
                support@vnstores.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Phone size={18} color="var(--brand-primary)" />
              <p style={{ margin: 0 }}>+1 (555) 123-4567</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={18} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ margin: 0 }}>123 Creative Street, Digital City, DC 12345</p>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} VN Stores. All rights reserved.</p>
          <p>Made with <span style={{ color: 'var(--brand-secondary)' }}>❤</span> for Creators</p>
        </div>
      </div>
    </footer>
  );
}
