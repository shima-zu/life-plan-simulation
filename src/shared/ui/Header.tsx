'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header(): JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Life Plan Simulation
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/settings'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
