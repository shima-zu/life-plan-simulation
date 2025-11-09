'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import { Button } from './Button';

export const Header = () => {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Show full header when authenticated or loading
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

            {!loading && user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.displayName || user.email}
                </span>
                <Button variant="outline" onClick={() => void handleSignOut()}>
                  Sign Out
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
