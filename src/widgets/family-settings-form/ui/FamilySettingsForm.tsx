'use client';

import { useFamilyForm } from '../model/useFamilyForm';
import { FamilyMemberCard } from '@/features/edit-family-member/ui/FamilyMemberCard';

export const FamilySettingsForm = (): JSX.Element => {
  const { self, spouse, isLoading, handleSaveMember } = useFamilyForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FamilyMemberCard
        role="self"
        member={self}
        onSave={handleSaveMember}
        roleLabel="Self"
      />
      <FamilyMemberCard
        role="spouse"
        member={spouse}
        onSave={handleSaveMember}
        roleLabel="Spouse"
      />
    </div>
  );
};
