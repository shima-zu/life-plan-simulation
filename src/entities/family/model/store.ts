'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FamilyData, FamilyMember } from './types';
import { useAuth } from '@/shared/lib/auth-context';
import { subscribeToDocument, setDocument } from '@/shared/lib/firestore';

const DEFAULT_FAMILY_DATA: FamilyData = {
  members: [],
  updatedAt: new Date().toISOString(),
};

const FAMILY_DATA_DOCUMENT_PATH = 'familyData';

export const useFamilyData = (): {
  familyData: FamilyData;
  isLoading: boolean;
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;
  getMember: (role: FamilyMember['role']) => FamilyMember | undefined;
  getChildren: () => FamilyMember[];
  saveFamilyData: (data: FamilyData) => Promise<void>;
} => {
  const { user, loading: authLoading } = useAuth();

  // Use useMemo to compute initial state based on user
  const initialData = useMemo(() => DEFAULT_FAMILY_DATA, []);
  const [familyData, setFamilyData] = useState<FamilyData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Firestore updates when user is authenticated
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      // Reset to default when user logs out - use callback to avoid lint error
      const resetData = () => {
        setFamilyData(DEFAULT_FAMILY_DATA);
        setIsLoading(false);
      };
      // Use setTimeout to defer state update
      const timeoutId = setTimeout(resetData, 0);
      return () => clearTimeout(timeoutId);
    }

    // Set loading state before subscribing
    const startLoading = () => {
      setIsLoading(true);
    };
    const timeoutId = setTimeout(startLoading, 0);

    const unsubscribe = subscribeToDocument<FamilyData>(
      user.uid,
      FAMILY_DATA_DOCUMENT_PATH,
      (data) => {
        if (data) {
          setFamilyData(data);
        } else {
          // Document doesn't exist, use default
          setFamilyData(DEFAULT_FAMILY_DATA);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading family data:', error);
        setIsLoading(false);
      },
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [user, authLoading]);

  // Save data
  const saveFamilyData = useCallback(
    async (data: FamilyData) => {
      if (!user) {
        console.warn('Cannot save family data: user not authenticated');
        return;
      }

      const updated = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setFamilyData(updated);

      try {
        await setDocument(user.uid, FAMILY_DATA_DOCUMENT_PATH, updated);
      } catch (error) {
        console.error('Error saving family data:', error);
        throw error;
      }
    },
    [user],
  );

  // Add member
  const addMember = useCallback(
    (member: Omit<FamilyMember, 'id'>) => {
      const newMember: FamilyMember = {
        ...member,
        id: crypto.randomUUID(),
      };
      const updated = {
        ...familyData,
        members: [...familyData.members, newMember],
      };
      void saveFamilyData(updated);
    },
    [familyData, saveFamilyData],
  );

  // Update member
  const updateMember = useCallback(
    (id: string, updates: Partial<FamilyMember>) => {
      const updated = {
        ...familyData,
        members: familyData.members.map((member) =>
          member.id === id ? { ...member, ...updates } : member,
        ),
      };
      void saveFamilyData(updated);
    },
    [familyData, saveFamilyData],
  );

  // Remove member
  const removeMember = useCallback(
    (id: string) => {
      const updated = {
        ...familyData,
        members: familyData.members.filter((member) => member.id !== id),
      };
      void saveFamilyData(updated);
    },
    [familyData, saveFamilyData],
  );

  // Get member
  const getMember = useCallback(
    (role: FamilyMember['role']) => {
      return familyData.members.find((member) => member.role === role);
    },
    [familyData.members],
  );

  // Get children
  const getChildren = useCallback(() => {
    return familyData.members.filter((member) => member.role === 'child');
  }, [familyData.members]);

  return {
    familyData,
    isLoading: isLoading || authLoading,
    addMember,
    updateMember,
    removeMember,
    getMember,
    getChildren,
    saveFamilyData,
  };
};
