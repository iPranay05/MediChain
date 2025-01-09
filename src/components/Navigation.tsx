'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
        <Link 
          href="/"
          className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
        >
          Home
        </Link>
        <Link 
          href="/patient"
          className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/patient')}`}
        >
          Patient Portal
        </Link>
        <Link 
          href="/hospital"
          className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/hospital')}`}
        >
          Hospital Portal
        </Link>
        <Link 
          href="/appointments"
          className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/appointments')}`}
        >
          Appointments
        </Link>
        <Link 
          href="/store"
          className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/store')}`}
        >
          Health Store
        </Link>
        <Link 
          href="/analytics"
          className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/analytics')}`}
        >
          Analytics
        </Link>
      </div>
    </nav>
  );
}
