import { SettingsPage } from '@/pages/settings/ui/SettingsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Life Plan Simulation',
  description: 'Configure settings for life plan simulation',
};

export default function SettingsIndexPage(): JSX.Element {
  return <SettingsPage />;
}
