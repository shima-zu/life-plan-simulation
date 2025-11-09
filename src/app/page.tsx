'use client';

import { useMemo, useEffect } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { useFamilyData } from '@/entities/family/model/store';
import { useIncomeData } from '@/entities/income/model/store';
import { IncomeTable } from '@/widgets/income-table/ui/IncomeTable';
import {
  generateYearRange,
  getInitialIncomes,
  getBirthYear,
} from '@/entities/income/lib/income-utils';
import { LoginScreen } from '@/shared/ui/LoginScreen';

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const { isLoading: familyLoading, getMember, getChildren } = useFamilyData();
  const {
    incomeData,
    isLoading: incomeLoading,
    saveIncomeData,
  } = useIncomeData();

  const selfMember = getMember('self');
  const partnerMember = getMember('partner');
  const children = getChildren();

  // Generate year range based on self's birth year (to age 90)
  const yearRange = useMemo(() => {
    if (!selfMember?.birthDate) {
      return [];
    }
    const birthYear = getBirthYear(selfMember.birthDate);
    return generateYearRange(birthYear);
  }, [selfMember]);

  // Initialize income data if not exists and family data is available
  useEffect(() => {
    if (
      !authLoading &&
      !familyLoading &&
      !incomeLoading &&
      user &&
      selfMember &&
      yearRange.length > 0 &&
      incomeData.incomes.length === 0
    ) {
      const initialIncomes = getInitialIncomes(
        selfMember,
        partnerMember,
        yearRange,
      );
      if (initialIncomes.length > 0) {
        void saveIncomeData({
          incomes: initialIncomes,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }, [
    authLoading,
    familyLoading,
    incomeLoading,
    user,
    selfMember,
    partnerMember,
    yearRange,
    incomeData.incomes.length,
    saveIncomeData,
  ]);

  if (authLoading || familyLoading || incomeLoading) {
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

  if (!selfMember) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              設定ページで自分と配偶者の情報を登録してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selfName = selfMember.name || '自分';
  const partnerName = partnerMember?.name || '配偶者';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <main className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Income
          </h1>
        </div>

        {yearRange.length > 0 ? (
          <IncomeTable
            yearRange={yearRange}
            selfName={selfName}
            partnerName={partnerName}
            selfBirthDate={selfMember.birthDate}
            partnerBirthDate={partnerMember?.birthDate}
            childrenMembers={children}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              生年月日を設定してください。
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
