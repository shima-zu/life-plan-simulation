'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { IncomeData } from './types';
import { useAuth } from '@/shared/lib/auth-context';
import { subscribeToDocument, setDocument } from '@/shared/lib/firestore';
import { applyInitialIncomeToAllYears } from '../lib/income-utils';

const DEFAULT_INCOME_DATA: IncomeData = {
  incomes: [],
  updatedAt: new Date().toISOString(),
};

const INCOME_DATA_DOCUMENT_PATH = 'incomeData';

export const useIncomeData = (): {
  incomeData: IncomeData;
  isLoading: boolean;
  updateIncome: (
    year: number,
    field: 'selfIncome' | 'partnerIncome',
    value: number,
  ) => void;
  saveIncomeData: (data: IncomeData) => Promise<void>;
  applyInitialIncome: (
    selfInitialIncome: number,
    partnerInitialIncome: number,
    yearRange: number[],
  ) => Promise<void>;
} => {
  const { user, loading: authLoading } = useAuth();

  const initialData = useMemo(() => DEFAULT_INCOME_DATA, []);
  const [incomeData, setIncomeData] = useState<IncomeData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to Firestore updates when user is authenticated
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      const resetData = () => {
        setIncomeData(DEFAULT_INCOME_DATA);
        setIsLoading(false);
      };
      const timeoutId = setTimeout(resetData, 0);
      return () => clearTimeout(timeoutId);
    }

    const startLoading = () => {
      setIsLoading(true);
    };
    const timeoutId = setTimeout(startLoading, 0);

    const unsubscribe = subscribeToDocument<IncomeData>(
      user.uid,
      INCOME_DATA_DOCUMENT_PATH,
      (data) => {
        if (data) {
          setIncomeData(data);
        } else {
          setIncomeData(DEFAULT_INCOME_DATA);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading income data:', error);
        setIsLoading(false);
      },
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [user, authLoading]);

  // Save data to Firestore
  const saveIncomeData = useCallback(
    async (data: IncomeData) => {
      if (!user) {
        console.warn('Cannot save income data: user not authenticated');
        return;
      }

      const updated = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setIncomeData(updated);

      try {
        await setDocument(user.uid, INCOME_DATA_DOCUMENT_PATH, updated);
      } catch (error) {
        console.error('Error saving income data:', error);
        throw error;
      }
    },
    [user],
  );

  // Update income with debounce (500ms)
  const updateIncome = useCallback(
    (year: number, field: 'selfIncome' | 'partnerIncome', value: number) => {
      const updatedIncomes = incomeData.incomes.map((income) =>
        income.year === year ? { ...income, [field]: value } : income,
      );

      // If income for this year doesn't exist, add it
      const existingIncome = updatedIncomes.find((inc) => inc.year === year);
      if (!existingIncome) {
        updatedIncomes.push({
          year,
          selfIncome: field === 'selfIncome' ? value : 0,
          partnerIncome: field === 'partnerIncome' ? value : 0,
        });
      }

      const updated = {
        ...incomeData,
        incomes: updatedIncomes,
      };

      // Update local state immediately for responsive UI
      setIncomeData(updated);

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save to Firestore
      saveTimeoutRef.current = setTimeout(() => {
        void saveIncomeData(updated);
      }, 500);
    },
    [incomeData, saveIncomeData],
  );

  // Apply initial income to all years
  const applyInitialIncome = useCallback(
    async (
      selfInitialIncome: number,
      partnerInitialIncome: number,
      yearRange: number[],
    ) => {
      if (!user) {
        console.warn('Cannot apply initial income: user not authenticated');
        return;
      }

      // If income data is empty, create new data with all years
      if (incomeData.incomes.length === 0) {
        const newIncomes = yearRange.map((year) => ({
          year,
          selfIncome: selfInitialIncome,
          partnerIncome: partnerInitialIncome,
        }));
        await saveIncomeData({
          incomes: newIncomes,
          updatedAt: new Date().toISOString(),
        });
        return;
      }

      // Apply to existing data
      const updatedIncomes = applyInitialIncomeToAllYears(
        incomeData.incomes,
        selfInitialIncome,
        partnerInitialIncome,
      );

      await saveIncomeData({
        incomes: updatedIncomes,
        updatedAt: new Date().toISOString(),
      });
    },
    [user, incomeData, saveIncomeData],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    incomeData,
    isLoading: isLoading || authLoading,
    updateIncome,
    saveIncomeData,
    applyInitialIncome,
  };
};
