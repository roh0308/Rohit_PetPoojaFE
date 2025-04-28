'use client';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function CloseOrder() {
  const [selectedTable, setSelectedTable] = useState('');
  const [openSessions, setOpenSessions] = useState([]);
  const [result, setResult] = useState('');
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchOpenSessions();
  }, []);

  const fetchOpenSessions = async () => {
    const res = await fetch('http://localhost:3001/table/open-sessions');
    const data = await res.json();
    setOpenSessions(data);
  };

  const closeOrder = async (e) => {
    e.preventDefault();
    setResult('');
    setBill(null);

    try {
      const res = await fetch(`http://localhost:3001/table/close-session/${selectedTable}`, {
        method: 'PUT'
      });
      const data = await res.json();
      const session_id = data.session_id;

      setResult('✅ Session closed successfully!');

      // Fetch Bill
      fetchBill(session_id);
    } catch (err) {
      setResult('❌ Failed to close session.');
    }
  };

  const fetchBill = async (session_id) => {
    const res = await fetch(`http://localhost:3001/order/bill-by-session/${session_id}`);
    const data = await res.json();
    setBill(data);
  };

  return (
    <Layout>
      <div className="min-h-screen p-10 bg-white text-black">
        <h1 className="text-2xl font-bold mb-6">Close an Order (Session Based)</h1>

        <form onSubmit={closeOrder} className="flex flex-col gap-4 max-w-md">
        <select
  value={selectedTable}
  onChange={(e) => setSelectedTable(e.target.value)}
  className="border border-gray-400 p-2 rounded"
  required
>
  <option value="">Select Table</option>
  {openSessions.map((session) => (
    <option key={session.id} value={session.table_id}>
      Table {session.table_number} - ₹{parseFloat(session.total_open_bill).toFixed(2)}
    </option>
  ))}
</select>


          <button type="submit" className="bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Close Table
          </button>
        </form>

        {result && <p className="mt-6 text-green-700 font-semibold">{result}</p>}

        {bill && (
          <div className="mt-8 p-6 border rounded shadow bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Final Bill (Session {bill.session_id})</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Item Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.itemTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4 font-bold text-lg">
              Grand Total: ₹{bill.finalTotal}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
