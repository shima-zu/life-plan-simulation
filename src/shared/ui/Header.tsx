'use client';

import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';

export const Header = () => {
  const { user, loading, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

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
            {!loading && user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={() => void handleSignOut()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
