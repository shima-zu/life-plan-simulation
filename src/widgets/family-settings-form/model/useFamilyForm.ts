'use client';

import { useFamilyData } from '@/entities/family/model/store';
import type { FamilyMember } from '@/entities/family/model/types';

export const useFamilyForm = (): {
  self: FamilyMember | undefined;
  partner: FamilyMember | undefined;
  isLoading: boolean;
  handleSaveMember: (memberData: Omit<FamilyMember, 'id'>) => void;
} => {
  const { isLoading, addMember, updateMember, getMember } = useFamilyData();

  const handleSaveMember = (memberData: Omit<FamilyMember, 'id'>) => {
    const existing = getMember(memberData.role);

    if (existing) {
      updateMember(existing.id, memberData);
    } else {
      addMember(memberData);
    }
  };

  return {
    self: getMember('self'),
    partner: getMember('partner'),
    isLoading,
    handleSaveMember,
  };
};
