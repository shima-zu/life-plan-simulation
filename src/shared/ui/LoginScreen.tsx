'use client';

import { useAuth } from '@/shared/lib/auth-context';
import { Button } from './Button';

export const LoginScreen = () => {
  const { loading, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Life Plan Simulation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to continue
        </p>
        <Button variant="primary" onClick={() => void handleSignIn()}>
          Sign In with Google
        </Button>
      </div>
    </div>
  );
};
