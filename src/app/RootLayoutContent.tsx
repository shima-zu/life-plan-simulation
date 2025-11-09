'use client';

import { useAuth } from '@/shared/lib/auth-context';
import { Header } from '@/shared/ui/Header';
import { LoginScreen } from '@/shared/ui/LoginScreen';

export const RootLayoutContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, loading } = useAuth();

  // Show login screen when not authenticated
  if (!loading && !user) {
    return <LoginScreen />;
  }

  // Show header and content when authenticated
  return (
    <>
      <Header />
      {children}
    </>
  );
};
