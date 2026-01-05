import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) alert(error.message);
    else alert("Check your email for the magic link!");
  };

  return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Login to access your store</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email" required placeholder="Enter your email" className="input-field"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Sending..." : "Send Login Link"}
          </button>
        </form>
      </div>
    </div>
  );
}