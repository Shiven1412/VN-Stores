import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Play, X, Download, ShoppingCart } from 'lucide-react';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data } = await supabase.from('templates').select('*');
    setTemplates(data || []);
  };

  const handleBuy = async (template) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login to purchase");

    if (template.price === 0) {
      return alert(`Download Link: ${template.download_link}`);
    }

    try {
      // 1. Create Order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay-actions', {
        body: { action: 'create-order', amount: template.price }
      });
      if (orderError) throw new Error("Order creation failed");

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: "INR",
        name: "VN Stores",
        description: template.title,
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-actions', {
            body: {
              action: 'verify-payment',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id,
              template_id: template.id,
              amount: template.price
            }
          });

          if (verifyError || !verifyData.success) alert("Verification Failed");
          else {
            alert("Payment Successful!");
            setSelectedVideo(null);
          }
        },
        prefill: { email: user.email },
        theme: { color: "#3B82F6" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment Error. Check console.");
    }
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Trending VN Codes</h1>
        <p style={{ color: 'var(--text-light)' }}>Premium edits for your Reels & Shorts</p>
      </div>

      <div className="container">
        <div className="grid-layout">
          {templates.map((t) => (
            <div key={t.id} className="card">
              <div className="thumbnail-wrapper" onClick={() => setSelectedVideo(t)}>
                <img 
                  src={`https://img.youtube.com/vi/${t.youtube_video_id}/hqdefault.jpg`} 
                  className="thumbnail-img" alt={t.title}
                />
                <div className="play-icon"><Play size={20} fill="black" /></div>
                <div className="price-badge">{t.price === 0 ? "FREE" : `₹${t.price}`}</div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{t.title}</h3>
                <button onClick={() => handleBuy(t)} className="btn btn-primary" style={{ width: '100%' }}>
                  {t.price === 0 ? <Download size={18}/> : <ShoppingCart size={18}/>}
                  {t.price === 0 ? "Download" : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="modal-overlay">
          <button className="close-btn" onClick={() => setSelectedVideo(null)}>
            <X size={24} />
          </button>
          <div className="modal-content">
            <iframe
              className="video-frame"
              src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?autoplay=1&controls=0&loop=1&playlist=${selectedVideo.youtube_video_id}`}
              allow="autoplay; encrypted-media"
            ></iframe>
            <div className="modal-footer">
              <button onClick={() => handleBuy(selectedVideo)} className="btn btn-primary" style={{ width: '100%' }}>
                {selectedVideo.price === 0 ? "Download Free" : `Pay ₹${selectedVideo.price}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}