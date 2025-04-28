'use client';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [sales, setSales] = useState(0); // 🛠️ default 0, not []
  const [orders, setOrders] = useState(0);
  const [stock, setStock] = useState([]);
  const [itemSales, setItemSales] = useState([]);
  const [filter, setFilter] = useState('daily');

  useEffect(() => {
    fetchDashboardData();
    fetchItemSales();
  }, [filter]);

  const fetchDashboardData = async () => {
    const res = await fetch(`http://localhost:3001/dashboard?period=${filter}`);
    const data = await res.json();
    setSales(data.sales || 0);
    setOrders(data.orders || 0);
    setStock(Array.isArray(data.stock) ? data.stock : []);
  };

  const fetchItemSales = async () => {
    const res = await fetch(`http://localhost:3001/dashboard/sales-by-item?filter=${filter}`);
    const data = await res.json();
    setItemSales(Array.isArray(data) ? data : []);
  };

  const barData = {
    labels: itemSales.map(item => item.item_name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: itemSales.map(item => item.total_sold),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      }
    ]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-8 bg-gray-100 text-black">
        <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Overview</h1>

        {/* TOP CARDS: Sales and Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Sales Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4 text-green-700">{filter.charAt(0).toUpperCase() + filter.slice(1)} Sales Summary</h2>
            <div className="mt-2">
              <p><strong>Orders:</strong> {orders}</p>
              <p><strong>Sales:</strong> ₹{parseFloat(sales).toFixed(2)}</p>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4 text-yellow-700">Inventory Status</h2>
            {stock.length > 0 ? stock.map((item, idx) => (
              <div key={idx} className="flex justify-between mt-2">
                <span>{item.name}</span>
                <span>{item.stock_quantity} units</span>
              </div>
            )) : <p>No Inventory Data Available</p>}
          </div>
        </div>

        {/* Bottom Card: Top Selling Items Graph */}
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">Top Selling Items ({filter.charAt(0).toUpperCase() + filter.slice(1)})</h2>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-400 p-2 rounded"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="h-[400px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>
    </Layout>
  );
}
