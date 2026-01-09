import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export default function Admin() {
  const [templates, setTemplates] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    youtubeId: '', 
    originalPrice: '',
    discountedPrice: '',
    price: '', 
    qrFile: null,
    qrUrl: '',
    category: '',
    subcategory: '',
    carouselTags: []
  });
  const [carouselForm, setCarouselForm] = useState({
    id: null,
    name: '',
    imageFile: null,
    imageUrl: '',
    qrFile: null,
    qrUrl: '',
    destinationCategory: ''
  });
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin Email
  const ADMIN_EMAIL = "shivendratripathi2876@gmail.com"; 

  // Category options (main types)
  const categoryOptions = ["Wedding", "Festival", "Trending", "Reels", "Posts", "Romantic"];
  
  // Subcategory mapping for each main category
  const subcategoryMap = {
    "Reels": ["Cinematic", "Neon", "Wedding", "Festival", "Trending", "Shorty"],
    "Posts": ["Quote", "Carousel", "Minimalist", "VFX", "Typography", "Transition"],
    "Wedding": ["Cinematic", "Traditional", "Drone", "Highlight", "Teaser", "Album"],
    "Festival": ["Holi", "Diwali", "Christmas", "NewYear", "Cultural", "Music"],
    "Trending": ["Trending", "Viral", "Challenge", "Meme", "Audio-Sync", "Transition"],
    "Romantic": ["Love Story", "Couple", "Proposal", "Anniversary", "Duet", "Emotional"]
  };
  
  // Carousel Tag Options
  const carouselTagOptions = ["Cinematic", "Neon", "Wedding", "Festival", "Trending", "Reels"]; 

  useEffect(() => {
    checkUser();
    fetchTemplates();
    fetchCarousels();
  }, []);

  // 2. Security Check Function
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      // Optional: Redirect them away
      // window.location.href = "/";
    }
  };

  const fetchTemplates = async () => {
    const { data } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    
    // Fetch sales count for each template
    if (data) {
      const templatesWithSales = await Promise.all(
        data.map(async (template) => {
          const { count } = await supabase.from('orders').select('id', { count: 'exact' }).eq('template_id', template.id);
          return { ...template, sales_count: count || 0 };
        })
      );
      setTemplates(templatesWithSales);
    } else {
      setTemplates([]);
    }
  };

  const fetchCarousels = async () => {
    const { data } = await supabase.from('carousels').select('*').order('created_at', { ascending: false });
    setCarousels(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.youtubeId || !form.title || !form.category) return alert("Fill all required fields");

    let qrUrl = form.qrUrl;

    // Upload QR code if provided
    if (form.qrFile) {
      try {
        const timestamp = Date.now();
        const qrFilename = `template-qr-${timestamp}-${form.qrFile.name}`;
        const { error: qrUploadError } = await supabase.storage
          .from('qrcodes')
          .upload(qrFilename, form.qrFile, { upsert: false });

        if (qrUploadError) throw qrUploadError;

        const { data: qrUrlData } = supabase.storage.from('qrcodes').getPublicUrl(qrFilename);
        qrUrl = qrUrlData.publicUrl;
      } catch (err) {
        console.error('QR upload error', err);
        return alert('QR upload failed: ' + (err.message || String(err)));
      }
    }

    const { error } = await supabase.from('templates').insert([{
      title: form.title,
      youtube_video_id: form.youtubeId,
      original_price: form.originalPrice ? parseFloat(form.originalPrice) : null,
      discounted_price: form.discountedPrice ? parseFloat(form.discountedPrice) : null,
      price: parseFloat(form.price) || 0,
      download_link: qrUrl || null,
      category: form.category,
      carousel_tags: form.carouselTags.length > 0 ? form.carouselTags : null
    }]);

    if (!error) {
      alert("Template added!");
      setForm({ title: '', youtubeId: '', originalPrice: '', discountedPrice: '', price: '', qrFile: null, qrUrl: '', category: '', carouselTags: [] });
      fetchTemplates();
    } else {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this template?")) {
      await supabase.from('templates').delete().eq('id', id);
      fetchTemplates();
    }
  };

  // Carousel Handlers
  const handleCarouselSubmit = async (e) => {
    e.preventDefault();
    if (!carouselForm.name || !carouselForm.destinationCategory) {
      return alert("Fill all carousel fields (name, image, category)");
    }

    let imageUrl = carouselForm.imageUrl;
    let qrUrl = carouselForm.qrUrl;

    // Upload image to Supabase Storage if a new file is selected
    if (carouselForm.imageFile) {
      try {
        const timestamp = Date.now();
        const filename = `carousel-${timestamp}-${carouselForm.imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('carousel-images')
          .upload(filename, carouselForm.imageFile, { upsert: false });
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('carousel-images').getPublicUrl(filename);
        imageUrl = urlData.publicUrl;
      } catch (err) {
        console.error('Image upload error', err);
        return alert('Image upload failed: ' + (err.message || String(err)));
      }
    }

    // Upload QR code if a new file is selected
    if (carouselForm.qrFile) {
      try {
        const timestamp = Date.now();
        const qrFilename = `qr-code-${timestamp}-${carouselForm.qrFile.name}`;
        const { error: qrUploadError } = await supabase.storage
          .from('qr-codes')
          .upload(qrFilename, carouselForm.qrFile, { upsert: false });
        
        if (qrUploadError) throw qrUploadError;
        
        const { data: qrUrlData } = supabase.storage.from('qr-codes').getPublicUrl(qrFilename);
        qrUrl = qrUrlData.publicUrl;
      } catch (err) {
        console.error('QR Code upload error', err);
        return alert('QR Code upload failed: ' + (err.message || String(err)));
      }
    }

    if (carouselForm.id) {
      // Edit existing carousel
      const { error } = await supabase.from('carousels').update({
        name: carouselForm.name,
        image_url: imageUrl,
        qr_url: qrUrl,
        destination_category: carouselForm.destinationCategory
      }).eq('id', carouselForm.id);

      if (!error) {
        alert("Carousel updated!");
        resetCarouselForm();
        fetchCarousels();
      } else {
        alert(error.message);
      }
    } else {
      // Add new carousel
      const { error } = await supabase.from('carousels').insert([{
        name: carouselForm.name,
        image_url: imageUrl,
        qr_url: qrUrl,
        destination_category: carouselForm.destinationCategory
      }]);

      if (!error) {
        alert("Carousel added!");
        resetCarouselForm();
        fetchCarousels();
      } else {
        alert(error.message);
      }
    }
  };

  const handleEditCarousel = (carousel) => {
    setCarouselForm({
      id: carousel.id,
      name: carousel.name,
      imageUrl: carousel.image_url,
      qrUrl: carousel.qr_url,
      destinationCategory: carousel.destination_category
    });
    setShowCarouselForm(true);
  };

  const handleDeleteCarousel = async (id) => {
    if (confirm("Delete this carousel item?")) {
      await supabase.from('carousels').delete().eq('id', id);
      fetchCarousels();
    }
  };

  const resetCarouselForm = () => {
    setCarouselForm({
      id: null,
      name: '',
      imageFile: null,
      imageUrl: '',
      qrFile: null,
      qrUrl: '',
      destinationCategory: ''
    });
    setShowCarouselForm(false);
  };

  // Block Access if not Admin
  if (!isAdmin) {
    return (
      <div className="admin-page-wrapper">
        <div className="container" style={{ padding: '50px 20px', textAlign: 'center', color: '#fca5a5' }}>
          <h2>⛔ Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <div className="admin-container">
        <h1 style={{ marginBottom: '20px' }}>Admin Dashboard</h1>
        
        {/* Upload Form */}
        <div className="card" style={{ padding: '25px', marginBottom: '40px' }}>
          <h2>Add New Template</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <input 
              placeholder="Title" className="input-field"
              value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            />
            <input 
              placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" className="input-field"
              value={form.youtubeId} onChange={e => setForm({...form, youtubeId: e.target.value})}
            />
            <select 
              className="input-field"
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value, subcategory: ''})}
            >
              <option value="">Select Category</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            {form.category && subcategoryMap[form.category] && (
              <select 
                className="input-field"
                value={form.subcategory || ''} 
                onChange={e => setForm({...form, subcategory: e.target.value})}
              >
                <option value="">Select Subcategory (Optional)</option>
                {subcategoryMap[form.category].map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            )}

            {/* Carousel Tags */}
            <div>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block', fontWeight: '500' }}>
                Carousel Tags (Optional - Multiple)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                {carouselTagOptions.map(tag => (
                  <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white' }}>
                    <input 
                      type="checkbox"
                      checked={form.carouselTags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({...form, carouselTags: [...form.carouselTags, tag]});
                        } else {
                          setForm({...form, carouselTags: form.carouselTags.filter(t => t !== tag)});
                        }
                      }}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Price Section - Grid for desktop, stacked on mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <input 
                type="number" placeholder="Original Price" className="input-field"
                value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})}
              />
              <input 
                type="number" placeholder="Discounted Price" className="input-field"
                value={form.discountedPrice} onChange={e => setForm({...form, discountedPrice: e.target.value})}
              />
            </div>
            <input 
              type="number" placeholder="Price (Base/Sale Price - 0 for free)" className="input-field"
              value={form.price} onChange={e => setForm({...form, price: e.target.value})}
            />
            <div>
              <label style={{ color: 'white', marginBottom: '8px', display: 'block', fontWeight: '500' }}>Upload QR Code (replaces Download Link)</label>
              <input 
                type="file" 
                accept="image/*"
                className="input-field"
                onChange={e => setForm({...form, qrFile: e.target.files[0]})}
              />
              {form.qrUrl && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Current QR: <a href={form.qrUrl} target="_blank" rel="noreferrer">View</a></p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Upload Template</button>
          </form>
        </div>

        {/* Inventory Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td>
                  <img src={`https://img.youtube.com/vi/${t.youtube_video_id}/default.jpg`} width="80" style={{borderRadius: '6px'}}/>
                </td>
                <td>{t.title}</td>
                <td>{t.price === 0 ? "Free" : `₹${t.price}`}</td>
                <td><strong style={{ color: 'var(--brand-primary)', fontSize: '1.1rem' }}>{t.sales_count || 0}</strong></td>
                <td>
                  <button onClick={() => handleDelete(t.id)} className="btn btn-danger" style={{ padding: '8px' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Carousel Management Section */}
      <div className="card" style={{ padding: '25px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Manage Carousel</h2>
          {!showCarouselForm && (
            <button 
              onClick={() => setShowCarouselForm(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
              <Plus size={18} /> Add Carousel Item
            </button>
          )}
        </div>

        {showCarouselForm && (
          <form onSubmit={handleCarouselSubmit} className="admin-form" style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 5vw, 1.2rem)' }}>{carouselForm.id ? 'Edit Item' : 'Add Item'}</h3>
              <button 
                type="button"
                onClick={resetCarouselForm}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
              >
                <X size={20} />
              </button>
            </div>
            <input 
              placeholder="Name" 
              className="input-field"
              value={carouselForm.name} 
              onChange={e => setCarouselForm({...carouselForm, name: e.target.value})}
            />
            <div>
              <label style={{ color: 'white', marginBottom: '6px', display: 'block', fontWeight: '500', fontSize: '0.9rem' }}>Image</label>
              <input 
                type="file" 
                accept="image/*"
                className="input-field"
                onChange={e => setCarouselForm({...carouselForm, imageFile: e.target.files[0]})}
              />
              {carouselForm.imageUrl && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Current: {carouselForm.imageUrl}</p>}
            </div>

            <div>
              <label style={{ color: 'white', marginBottom: '6px', display: 'block', fontWeight: '500', fontSize: '0.9rem' }}>QR (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                className="input-field"
                onChange={e => setCarouselForm({...carouselForm, qrFile: e.target.files[0]})}
              />
              {carouselForm.qrUrl && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}><a href={carouselForm.qrUrl} target="_blank" rel="noreferrer">View QR</a></p>}
            </div>

            <select 
              className="input-field"
              value={carouselForm.destinationCategory} 
              onChange={e => setCarouselForm({...carouselForm, destinationCategory: e.target.value})}
            >
              <option value="">Category</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {carouselForm.id ? 'Update Carousel Item' : 'Add Carousel Item'}
            </button>
          </form>
        )}

        {/* Carousel Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {carousels.map((carousel) => (
            <div 
              key={carousel.id} 
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <img 
                src={carousel.image_url} 
                alt={carousel.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=Image+Not+Found'}
              />
              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{carousel.name}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  → {carousel.destination_category}
                </p>
              </div>
              {/* Buttons positioned below image and text */}
              <div style={{ display: 'flex', gap: '8px', padding: '0 15px 15px 15px' }}>
                <button 
                  onClick={() => handleEditCarousel(carousel)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteCarousel(carousel.id)}
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {carousels.length === 0 && !showCarouselForm && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p>No carousel items yet. Click "Add Carousel Item" to create one.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}