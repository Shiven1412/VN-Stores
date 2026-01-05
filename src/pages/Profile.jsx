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

  if (!user) return <div className="container" style={{padding: '50px', textAlign:'center'}}>Please Login</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>My Orders</h1>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map((order) => (
          <div key={order.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <div>
                <strong>Order #{order.id}</strong>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</div>
              </div>
              <button onClick={() => generateInvoice(order)} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
                <FileText size={14}/> Invoice
              </button>
            </div>
            
            {order.order_items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span>{item.templates?.title}</span>
                <a href={item.templates?.download_link} target="_blank" style={{ color: '#3B82F6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Download <Download size={14}/>
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}