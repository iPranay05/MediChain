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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0 mr-8">
            <div className="flex items-center">
              <img
                className="h-10 w-10"
                src="/logo-white.svg"
                alt="MediChain"
              />
              <span className="ml-3 text-xl font-semibold">MediChain</span>
            </div>
          </div>
          <div className="flex items-baseline space-x-4">
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
        </div>
      </div>
    </nav>
  );
}
