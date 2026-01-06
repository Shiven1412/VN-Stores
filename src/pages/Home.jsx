import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Play, X, Download, ShoppingCart, Star, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Pagination & Filtering State
  const [visibleCount, setVisibleCount] = useState(8);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Wedding", "Festival", "Trending", "Reels", "Posts", "Romantic"];

  useEffect(() => {
    fetchTemplates();
    fetchCarousels();
  }, []);

  const fetchTemplates = async () => {
    const { data } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    setTemplates(data || []);
  };

  const fetchCarousels = async () => {
    const { data } = await supabase.from('carousels').select('*').eq('active', true).order('position', { ascending: true });
    setCarousels(data || []);
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const handleBuy = async (template) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login to purchase");

    if (template.price === 0) {
      // Direct download for free items
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
        theme: { color: "#8b5cf6" } // Updated to match Cosmic theme brand color
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment Error. Check console.");
    }
  };

  // Filter Logic (Now uses actual category from Supabase)
  const filteredTemplates = activeCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div>
      {/* COSMIC BLUE SECTION - Carousel & Categories */}
      <div className="carousel-and-categories">
        <div className="container carousel-section">
        <div className="carousel-container">
          {carousels.length > 0 ? (
            carousels.map((carousel) => (
              <div 
                key={carousel.id}
                className="carousel-item" 
                style={{ backgroundImage: `url(${carousel.image_url})`, backgroundSize: 'cover' }}
                onClick={() => setActiveCategory(carousel.destination_category)}
                role="button"
                tabIndex={0}
              >
                <div className="carousel-overlay"></div>
                <div className="carousel-text">
                  <span className="category-pill" style={{background: 'var(--brand-secondary)', border:'none', marginBottom:'10px'}}>{carousel.destination_category}</span>
                  <h1>{carousel.name}</h1>
                  <p>Click to explore</p>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Fallback carousel items if none in DB */}
              <div className="carousel-item" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover' }}>
                <div className="carousel-overlay"></div>
                <div className="carousel-text">
                  <span className="category-pill" style={{background: 'var(--brand-primary)', border:'none', marginBottom:'10px'}}>New Arrival</span>
                  <h1>Cinematic Pack Vol. 1</h1>
                  <p>Elevate your travel vlogs instantly.</p>
                </div>
              </div>
              <div className="carousel-item" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop)', backgroundSize: 'cover' }}>
                <div className="carousel-overlay"></div>
                <div className="carousel-text">
                   <span className="category-pill" style={{background: 'var(--brand-secondary)', border:'none', marginBottom:'10px'}}>Trending</span>
                  <h1>Neon Glitch Effects</h1>
                  <p>Perfect for cyberpunk aesthetic reels.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- 2. CATEGORIES BAR --- */}
      <div className="container">
        <div className="categories-bar">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* WHITE SECTION - Products Grid */}
      <div className="grid-section">
        <div className="container">
        <div className="grid-layout">
          {filteredTemplates.slice(0, visibleCount).map((t) => (
            <div key={t.id} className="card">
              <div className="thumbnail-wrapper" onClick={() => setSelectedVideo(t)}>
                <img 
                  src={`https://img.youtube.com/vi/${t.youtube_video_id}/maxresdefault.jpg`} 
                  onError={(e) => e.target.src = `https://img.youtube.com/vi/${t.youtube_video_id}/hqdefault.jpg`}
                  className="thumbnail-img" alt={t.title}
                />
                <div className="play-icon"><Play size={24} fill="white" stroke="none" /></div>
                <div className="price-badge">{t.price === 0 ? "FREE" : `₹${t.price}`}</div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{t.title}</h3>
                <button onClick={() => handleBuy(t)} className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>
                  {t.price === 0 ? <Download size={18}/> : <ShoppingCart size={18}/>}
                  {t.price === 0 ? "Download" : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SHOW MORE BUTTON */}
        {visibleCount < filteredTemplates.length && (
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <button onClick={handleShowMore} className="btn btn-outline" style={{ padding: '12px 40px' }}>
              Show More Templates
            </button>
          </div>
        )}
        </div>
      </div>

      {/* --- 4. STATS SECTION --- */}
      <div className="stats-section" style={{ background: '#f5f5f7', borderTop: 'none' }}>
        <div className="stat-item">
          <Users size={40} color="var(--brand-primary)" />
          <h3>1,200+</h3>
          <p>Creators Joined</p>
        </div>
        <div className="stat-item">
          <Download size={40} color="var(--brand-secondary)" />
          <h3>5,800+</h3>
          <p>Templates Downloaded</p>
        </div>
        <div className="stat-item">
          <Star size={40} color="#fbbf24" />
          <h3>4.9/5</h3>
          <p>User Ratings</p>
        </div>
      </div>

      {/* --- 5. COSMIC VIDEO MODAL --- */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedVideo(null)}>
              <X size={20} />
            </button>
            <iframe
              className="video-frame"
              style={{ flexGrow: 1, width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?autoplay=1&controls=1&loop=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <div className="modal-footer">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                 <h3 style={{ fontSize:'1.1rem', margin:0 }}>{selectedVideo.title}</h3>
                 <span style={{color: 'var(--brand-primary)', fontWeight:'bold'}}>{selectedVideo.price === 0 ? "Free" : `₹${selectedVideo.price}`}</span>
              </div>
              <button onClick={() => handleBuy(selectedVideo)} className="btn btn-primary" style={{ width: '100%' }}>
                {selectedVideo.price === 0 ? "Download Now" : "Unlock Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}