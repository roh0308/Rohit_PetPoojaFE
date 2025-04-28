'use client';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function Order() {
  const [tableId, setTableId] = useState('');
  const [menuItemId, setMenuItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const res = await fetch('http://localhost:3001/menu');
    const data = await res.json();
    setMenuItems(data);
  };

  const startSession = async () => {
    try {
      await fetch(`http://localhost:3001/table/start-session/${tableId}`, {
        method: 'POST'
      });
    } catch (err) {
      console.log('Session already exists or failed to start session.');
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');

    try {
      const body = {
        table_id: parseInt(tableId),
        items: [{ menu_item_id: parseInt(menuItemId), quantity: parseInt(quantity) }]
      };

      let res = await fetch('http://localhost:3001/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const message = await res.text();
        if (message.includes('No active session')) {
          // Start session if no session found
          await startSession();
          
          // Try placing order again
          res = await fetch('http://localhost:3001/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
        }
      }

      if (!res.ok) {
        const message = await res.text();
        setError(message);
        return;
      }

      const data = await res.json();
      setResult(`✅ Order Placed! Order ID: ${data.order_id} | Total: ₹${data.total_price}`);
      setTableId('');
      setMenuItemId('');
      setQuantity('');

    } catch (err) {
      setError('Something went wrong while placing the order.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-10 bg-white text-black">
        <h1 className="text-2xl font-bold mb-6">Place New Order</h1>

        <form onSubmit={placeOrder} className="flex flex-col gap-4 max-w-md">
          <input
            type="number"
            placeholder="Table ID"
            className="border border-gray-400 p-2 rounded"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            required
          />
          <select
            value={menuItemId}
            onChange={(e) => setMenuItemId(e.target.value)}
            className="border border-gray-400 p-2 rounded"
            required
          >
            <option value="">Select Menu Item</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - ₹{item.price}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            className="border border-gray-400 p-2 rounded"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Place Order
          </button>
        </form>

        {result && <p className="mt-6 text-green-700 font-semibold">{result}</p>}
        {error && <p className="mt-6 text-red-600 font-semibold">{error}</p>}
      </div>
    </Layout>
  );
}
