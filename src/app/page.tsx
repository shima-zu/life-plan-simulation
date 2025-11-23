'use client';

import { useAuth } from '@/shared/lib/auth-context';
import { LoginScreen } from '@/shared/ui/LoginScreen';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <main className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Life Plan Simulation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You are signed in as {user.displayName || user.email}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
