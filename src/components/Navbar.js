'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-2xl font-bold">
        Rohit PetPooja
      </div>
      <div className="space-x-6">
        <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link href="/order" className="hover:text-gray-300">Place Order</Link>
        <Link href="/close-order" className="hover:text-gray-300">Close Order</Link>
        <Link href="/menu" className="hover:text-gray-300">Manage Menu</Link>

      </div>
    </nav>
  );
}
