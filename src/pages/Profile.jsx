import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import { Download, FileText } from 'lucide-react';

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase
        .from('orders')
        .select(`*, order_items (price_at_purchase, templates (title, download_link))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.text(`INVOICE #${order.id}`, 20, 20);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 30);
    doc.text(`Total: Rs. ${order.total_amount}`, 20, 40);
    
    let y = 60;
    order.order_items.forEach(item => {
      doc.text(`${item.templates?.title} - Rs. ${item.price_at_purchase}`, 20, y);
      y += 10;
    });
    
    doc.save(`invoice_${order.id}.pdf`);
  };

  if (!user) return (
    <div className="page-wrapper">
      <div className="container" style={{padding: '50px 20px', textAlign:'center'}}>
        <h2>Please Login</h2>
        <p style={{ color: 'var(--text-muted)' }}>You need to login to view your orders.</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="profile-wrapper container">
        {/* User Profile Header */}
        <div className="profile-header">
          <h1>My Orders</h1>
          <p>{user.email}</p>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <div className="order-date">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>₹{order.total_amount}</div>
                </div>
                
                <div className="order-items">
                  {order.order_items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span>{item.templates?.title}</span>
                      <a href={item.templates?.download_link} target="_blank" rel="noopener noreferrer">
                        Download <Download size={14}/>
                      </a>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => generateInvoice(order)} 
                  className="btn btn-outline" 
                  style={{ marginTop: '15px', width: '100%', fontSize: '0.9rem' }}
                >
                  <FileText size={14}/> Download Invoice
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="order-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '1.1rem' }}>No orders yet</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Start exploring templates to make your first purchase!</p>
          </div>
        )}
      </div>
    </div>
  );
}