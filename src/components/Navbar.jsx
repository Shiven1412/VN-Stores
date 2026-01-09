import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, Menu, X } from 'lucide-react';
import Logo from '../assets/logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const ADMIN_EMAIL = "shivendratripathi2876@gmail.com";
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(u?.email === ADMIN_EMAIL);
    });
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
          <img src={Logo} alt="VN Stores" style={{ height: 36 }} />
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
          <div className="templates-dropdown" style={{ position: 'relative' }}>
            <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
              Templates
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
              <Link to="/templates/reels" onClick={() => { closeMenu(); setDropdownOpen(false); }}>Reel Templates</Link>
              <Link to="/templates/posts" onClick={() => { closeMenu(); setDropdownOpen(false); }}>Post Templates</Link>
            </div>
          </div>
          {user && <Link to="/profile" onClick={closeMenu}>My Orders</Link>}
          {isAdmin && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
          
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