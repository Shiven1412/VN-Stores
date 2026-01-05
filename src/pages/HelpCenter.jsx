import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function HelpCenter() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "How do I purchase a template?",
      answer: "Simply browse our collection, click on a template that interests you, watch the preview, and click 'Buy Now'. You'll be redirected to Razorpay for secure payment. After payment confirmation, you'll receive your download link."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods through Razorpay including Credit Cards, Debit Cards, UPI, Net Banking, and Wallets. Razorpay ensures secure and encrypted transactions."
    },
    {
      question: "Can I download a free template without payment?",
      answer: "Yes! All templates marked as 'FREE' can be downloaded directly without any payment. Just click the Download button on the free template."
    },
    {
      question: "How long does it take to receive my download?",
      answer: "You'll receive your download link immediately after successful payment. If you don't see the link, check your email (including spam folder) or visit your 'My Orders' page to access all your purchases."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer refunds within 30 days of purchase if the product is defective or doesn't match the description. Please visit our Refund Policy page for detailed information or contact our support team."
    },
    {
      question: "What video editing software do these templates work with?",
      answer: "Our templates are primarily designed for CapCut, Adobe Premiere Pro, DaVinci Resolve, and other professional video editing software. Each template listing includes compatibility information. Some templates include VN editor codes for direct import."
    },
    {
      question: "Can I use these templates commercially?",
      answer: "Yes, most of our templates can be used for commercial projects. However, please check the specific template's usage rights in the product description. Some may have restrictions."
    },
    {
      question: "How do I access my purchased templates?",
      answer: "Visit your 'My Orders' page (login required) to view all your purchases. You'll find download links and direct access to all the templates you've bought."
    },
    {
      question: "Are these templates compatible with mobile editing?",
      answer: "Some templates work with mobile editors like CapCut Mobile, while others require desktop software. Check each product description for compatibility details."
    },
    {
      question: "Can I modify the templates after downloading?",
      answer: "Yes! All templates are fully editable. You can modify colors, text, durations, and other elements to suit your needs. We provide both the edited version and source files where available."
    },
    {
      question: "What should I do if I'm having trouble downloading?",
      answer: "First, check your internet connection and try clearing your browser cache. If the issue persists, contact our support team at support@vnstores.com with your order number, and we'll help you immediately."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "For bulk purchases or business inquiries, please contact us at business@vnstores.com. We'd be happy to discuss special pricing options for your needs."
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="page-wrapper" style={{ background: '#f5f5f7' }}>
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ color: '#09090b', marginBottom: '10px' }}>Help Center</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Find answers to common questions and get support for your VN Stores experience.</p>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* FAQ Section */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#09090b', fontSize: '1.5rem', marginBottom: '30px' }}>Frequently Asked Questions</h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      textAlign: 'left',
                      background: expandedFaq === index ? '#f0f0f0' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.3s'
                    }}
                  >
                    <span style={{ color: '#09090b', fontWeight: '600', fontSize: '1rem' }}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        color: '#8b5cf6',
                        flexShrink: 0,
                        marginLeft: '10px'
                      }}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div style={{
                      padding: '20px',
                      borderTop: '1px solid #e0e0e0',
                      background: '#fafafa',
                      color: '#666',
                      lineHeight: '1.8'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Getting Started Section */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#09090b', fontSize: '1.5rem', marginBottom: '20px' }}>Getting Started</h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#09090b', fontSize: '1.1rem', marginBottom: '10px' }}>📝 Creating an Account</h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Click the "Login" button in the navbar. You can sign up using your email address. You'll receive a confirmation email to activate your account.
                </p>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#09090b', fontSize: '1.1rem', marginBottom: '10px' }}>🔍 Browsing Templates</h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Use the category filters and carousel to explore templates. You can search by category (Wedding, Trending, etc.) and view preview videos before purchasing.
                </p>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#09090b', fontSize: '1.1rem', marginBottom: '10px' }}>💳 Making a Purchase</h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Click "Buy Now" on any paid template. You'll be redirected to Razorpay for secure payment. After successful payment, your download link will be available immediately.
                </p>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <h3 style={{ color: '#09090b', fontSize: '1.1rem', marginBottom: '10px' }}>📥 Downloading Your Templates</h3>
                <p style={{ color: '#666', margin: 0 }}>
                  Visit "My Orders" page to access all your purchases. You'll find direct download links and access to all templates you've bought.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting Section */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#09090b', fontSize: '1.5rem', marginBottom: '20px' }}>Troubleshooting</h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '12px', border: '1px solid #ffc107' }}>
                <h3 style={{ color: '#856404', fontSize: '1.1rem', marginBottom: '10px' }}>⚠️ Payment Not Processing?</h3>
                <ul style={{ color: '#856404', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Check your internet connection</li>
                  <li>Ensure your payment method has sufficient balance</li>
                  <li>Clear browser cache and cookies</li>
                  <li>Try a different browser</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>

              <div style={{ background: '#d4edda', padding: '20px', borderRadius: '12px', border: '1px solid #28a745' }}>
                <h3 style={{ color: '#155724', fontSize: '1.1rem', marginBottom: '10px' }}>✅ Download Link Not Working?</h3>
                <ul style={{ color: '#155724', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Check your email inbox and spam folder</li>
                  <li>Visit "My Orders" page to access downloads</li>
                  <li>Try downloading with a different browser</li>
                  <li>Disable ad-blockers temporarily</li>
                  <li>Contact support with your order number</li>
                </ul>
              </div>

              <div style={{ background: '#cfe2ff', padding: '20px', borderRadius: '12px', border: '1px solid #0d6efd' }}>
                <h3 style={{ color: '#084298', fontSize: '1.1rem', marginBottom: '10px' }}>ℹ️ Template Not Working in My Editor?</h3>
                <ul style={{ color: '#084298', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Check template compatibility with your software</li>
                  <li>Update your video editing software to the latest version</li>
                  <li>Check the template instructions and documentation</li>
                  <li>Try importing the template again</li>
                  <li>Contact support for technical assistance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Support CTA */}
          <section style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            padding: '40px',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ color: 'white', marginBottom: '15px' }}>Still Need Help?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <a 
              href="/contact-us"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#8b5cf6',
                padding: '12px 30px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
