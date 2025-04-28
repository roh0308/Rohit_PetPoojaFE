'use client';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStockQuantity, setEditStockQuantity] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await fetch('http://localhost:3001/menu');
    const data = await res.json();
    setMenuItems(data);
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3001/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        price: parseFloat(price),
        stock_quantity: parseInt(stockQuantity)
      })
    });
    setName('');
    setPrice('');
    setStockQuantity('');
    fetchMenu();
  };

  const deleteMenuItem = async (id) => {
    await fetch(`http://localhost:3001/menu/${id}`, {
      method: 'DELETE'
    });
    fetchMenu();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditStockQuantity(item.stock_quantity);
  };

  const saveEdit = async (id) => {
    await fetch(`http://localhost:3001/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: editName, 
        price: parseFloat(editPrice),
        stock_quantity: parseInt(editStockQuantity)
      })
    });
    setEditingId(null);
    fetchMenu();
  };

  return (
    <Layout>
      <div className="min-h-screen p-10 bg-white text-black">
        <h1 className="text-2xl font-bold mb-6">Manage Menu</h1>

        {/* Add New Menu Item */}
        <form onSubmit={addMenuItem} className="flex flex-col gap-4 max-w-md mb-10">
          <input
            type="text"
            placeholder="Item Name"
            className="border border-gray-400 p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="border border-gray-400 p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            className="border border-gray-400 p-2 rounded"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Add Item
          </button>
        </form>

        {/* Menu List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow flex flex-col gap-2">
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    className="border border-gray-400 p-1 rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="border border-gray-400 p-1 rounded"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="border border-gray-400 p-1 rounded"
                    value={editStockQuantity}
                    onChange={(e) => setEditStockQuantity(e.target.value)}
                  />
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p>Price: ₹{parseFloat(item.price).toFixed(2)}</p>
                  <p>Stock: {item.stock_quantity} units</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
