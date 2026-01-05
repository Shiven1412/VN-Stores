import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          VN<span style={{ color: '#8b5cf6' }}>Stores</span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Templates</Link>
          {user && <Link to="/profile" onClick={closeMenu}>My Orders</Link>}
          {user && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
          
          {user ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }} onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}