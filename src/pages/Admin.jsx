import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2 } from 'lucide-react';

export default function Admin() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ title: '', youtubeId: '', price: '', link: '' });
  const [isAdmin, setIsAdmin] = useState(false); // Track admin status

  // 1. YOUR ADMIN EMAIL
  const ADMIN_EMAIL = "shivendratripathi2876@gmail.com"; 

  useEffect(() => {
    checkUser();
    fetchTemplates();
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
    setTemplates(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.youtubeId || !form.title) return alert("Fill all fields");

    const { error } = await supabase.from('templates').insert([{
      title: form.title,
      youtube_video_id: form.youtubeId,
      price: parseFloat(form.price) || 0,
      download_link: form.link
    }]);

    if (!error) {
      alert("Added!");
      setForm({ title: '', youtubeId: '', price: '', link: '' });
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

  // 3. Block Access if not Admin
  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
        <h2>⛔ Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container admin-container">
      <h1 style={{ marginBottom: '20px' }}>Admin Dashboard</h1>
      
      {/* Upload Form */}
      <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
        <h2>Add New Template</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
          <input 
            placeholder="Title" className="input-field"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})}
          />
          <input 
            placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" className="input-field"
            value={form.youtubeId} onChange={e => setForm({...form, youtubeId: e.target.value})}
          />
          <input 
            type="number" placeholder="Price (0 for free)" className="input-field"
            value={form.price} onChange={e => setForm({...form, price: e.target.value})}
          />
          <input 
            placeholder="Download Link / VN Code URL" className="input-field"
            value={form.link} onChange={e => setForm({...form, link: e.target.value})}
          />
          <button type="submit" className="btn btn-primary">Upload Template</button>
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
    </div>
  );
}