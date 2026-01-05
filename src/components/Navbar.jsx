import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, LogOut, Menu, X } from 'lucide-react'; // Added Menu & X icons

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // New state for mobile menu

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false); // Close menu on logout
    navigate('/login');
  };

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          VN<span style={{ color: '#3B82F6' }}>Stores</span>
        </Link>

        {/* MOBILE HAMBURGER BUTTON (Visible only on mobile via CSS) */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* NAVIGATION LINKS */}
        {/* We add the 'active' class if isOpen is true */}
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