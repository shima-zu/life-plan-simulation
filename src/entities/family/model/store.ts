"use client";

import { useState, useCallback } from "react";
import type { FamilyData, FamilyMember } from "./types";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/shared/lib/local-storage";
import { STORAGE_KEYS } from "@/shared/config/constants";

const DEFAULT_FAMILY_DATA: FamilyData = {
  members: [],
  updatedAt: new Date().toISOString(),
};

export function useFamilyData() {
  const [familyData, setFamilyData] = useState<FamilyData>(() => {
    const saved = getLocalStorage<FamilyData>(STORAGE_KEYS.FAMILY_DATA);
    return saved || DEFAULT_FAMILY_DATA;
  });
  const [isLoading] = useState(false);

  // Save data
  const saveFamilyData = useCallback((data: FamilyData) => {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setFamilyData(updated);
    setLocalStorage(STORAGE_KEYS.FAMILY_DATA, updated);
  }, []);

  // Add member
  const addMember = useCallback(
    (member: Omit<FamilyMember, "id">) => {
      const newMember: FamilyMember = {
        ...member,
        id: crypto.randomUUID(),
      };
      const updated = {
        ...familyData,
        members: [...familyData.members, newMember],
      };
      saveFamilyData(updated);
    },
    [familyData, saveFamilyData]
  );

  // Update member
  const updateMember = useCallback(
    (id: string, updates: Partial<FamilyMember>) => {
      const updated = {
        ...familyData,
        members: familyData.members.map((member) =>
          member.id === id ? { ...member, ...updates } : member
        ),
      };
      saveFamilyData(updated);
    },
    [familyData, saveFamilyData]
  );

  // Remove member
  const removeMember = useCallback(
    (id: string) => {
      const updated = {
        ...familyData,
        members: familyData.members.filter((member) => member.id !== id),
      };
      saveFamilyData(updated);
    },
    [familyData, saveFamilyData]
  );

  // Get member
  const getMember = useCallback(
    (role: FamilyMember["role"]) => {
      return familyData.members.find((member) => member.role === role);
    },
    [familyData.members]
  );

  return {
    familyData,
    isLoading,
    addMember,
    updateMember,
    removeMember,
    getMember,
    saveFamilyData,
  };
}
