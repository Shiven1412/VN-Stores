import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate with an email service like Nodemailer, SendGrid, etc.
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="page-wrapper" style={{ background: '#f5f5f7' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ color: '#09090b', marginBottom: '10px' }}>Contact Us</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>We'd love to hear from you. Get in touch with us for any inquiries or support.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Contact Information Cards */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={24} color="white" />
              </div>
              <div>
                <h3 style={{ color: '#09090b', margin: '0 0 8px 0' }}>Email</h3>
                <p style={{ color: '#666', margin: 0 }}>support@vnstores.com</p>
                <p style={{ color: '#999', margin: '5px 0 0 0', fontSize: '0.85rem' }}>Response time: 24-48 hours</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={24} color="white" />
              </div>
              <div>
                <h3 style={{ color: '#09090b', margin: '0 0 8px 0' }}>Phone</h3>
                <p style={{ color: '#666', margin: 0 }}>+1 (555) 123-4567</p>
                <p style={{ color: '#999', margin: '5px 0 0 0', fontSize: '0.85rem' }}>Available 9 AM - 6 PM IST</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={24} color="white" />
              </div>
              <div>
                <h3 style={{ color: '#09090b', margin: '0 0 8px 0' }}>Address</h3>
                <p style={{ color: '#666', margin: 0 }}>123 Creative Street</p>
                <p style={{ color: '#666', margin: '3px 0 0 0' }}>Digital City, DC 12345</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={24} color="white" />
              </div>
              <div>
                <h3 style={{ color: '#09090b', margin: '0 0 8px 0' }}>Business Hours</h3>
                <p style={{ color: '#666', margin: 0 }}>Monday - Friday</p>
                <p style={{ color: '#666', margin: '3px 0 0 0' }}>9:00 AM - 6:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#09090b', marginBottom: '10px' }}>Send Us a Message</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Fill out the form below and we'll get back to you as soon as possible.</p>

            {submitted && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #28a745'
              }}>
                ✓ Thank you! Your message has been sent successfully. We'll be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#09090b', fontWeight: '600', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#09090b', fontWeight: '600', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#09090b', fontWeight: '600', marginBottom: '8px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#09090b', fontWeight: '600', marginBottom: '8px' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  color: 'white',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Additional Contact Methods */}
        <div style={{ marginTop: '60px', padding: '40px', background: 'white', borderRadius: '16px' }}>
          <h2 style={{ color: '#09090b', marginBottom: '20px' }}>Other Ways to Reach Us</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#09090b', marginBottom: '10px' }}>📧 Refund Inquiries</h3>
              <p style={{ color: '#666', margin: 0 }}>refunds@vnstores.com</p>
            </div>
            <div>
              <h3 style={{ color: '#09090b', marginBottom: '10px' }}>💼 Business Partnerships</h3>
              <p style={{ color: '#666', margin: 0 }}>business@vnstores.com</p>
            </div>
            <div>
              <h3 style={{ color: '#09090b', marginBottom: '10px' }}>🔒 Security Issues</h3>
              <p style={{ color: '#666', margin: 0 }}>security@vnstores.com</p>
            </div>
            <div>
              <h3 style={{ color: '#09090b', marginBottom: '10px' }}>❓ General Support</h3>
              <p style={{ color: '#666', margin: 0 }}>support@vnstores.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
