import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Rohit PetPooja System</h1>
      <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
        Go to Dashboard
      </Link>
    </div>
  );
}
