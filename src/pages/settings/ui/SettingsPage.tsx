'use client';

import { useMemo } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/shared/lib/auth-context';
import { useFamilyData } from '@/entities/family/model/store';
import { useIncomeData } from '@/entities/income/model/store';
import { FamilySettingsForm } from '@/widgets/family-settings-form/ui/FamilySettingsForm';
import { ChildrenList } from '@/widgets/children-list/ui/ChildrenList';
import {
  generateYearRange,
  getBirthYear,
} from '@/entities/income/lib/income-utils';

export const SettingsPage = () => {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { getMember, isLoading } = useFamilyData();
  const { applyInitialIncome } = useIncomeData();
  const self = getMember('self');
  const partner = getMember('partner');
  const isFamilyCompleted = !!self && !!partner;

  // Calculate year range for income application
  const yearRange = useMemo(() => {
    if (!self?.birthDate) {
      return [];
    }
    const birthYear = getBirthYear(self.birthDate);
    return generateYearRange(birthYear);
  }, [self]);

  const handleApplyInitialIncome = async () => {
    if (!self || !partner) {
      return;
    }

    const selfIncome = self.initialIncome ?? 0;
    const partnerIncome = partner.initialIncome ?? 0;

    if (selfIncome === 0 && partnerIncome === 0) {
      alert('初期年収が設定されていません。');
      return;
    }

    const confirmed = window.confirm(
      '既に入力されている年収データも上書きされます。よろしいですか？',
    );

    if (!confirmed) {
      return;
    }

    try {
      await applyInitialIncome(selfIncome, partnerIncome, yearRange);
      alert('すべての年の年収に反映しました。');
    } catch (error) {
      console.error('Failed to apply initial income:', error);
      alert('年収の反映に失敗しました。');
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Settings
            </h1>
          </div>

          <Card title="Authentication Required">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please sign in with Google to save and manage your settings.
              </p>
              <Button variant="primary" onClick={() => void handleSignIn()}>
                Sign In with Google
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Settings
          </h1>
        </div>

        <div className="space-y-4">
          {/* Family Settings Section */}
          <Card title="Family Settings" collapsible defaultExpanded={false}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {isFamilyCompleted && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Completed</span>
                  </div>
                )}
              </div>
              <FamilySettingsForm />

              {/* Apply Initial Income Section */}
              {isFamilyCompleted && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Apply Initial Income to All Years
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {self.initialIncome !== undefined && (
                          <div>
                            {self.name || '自分'}: {self.initialIncome}万円
                          </div>
                        )}
                        {partner.initialIncome !== undefined && (
                          <div>
                            {partner.name || '配偶者'}: {partner.initialIncome}
                            万円
                          </div>
                        )}
                        {(self.initialIncome === undefined ||
                          self.initialIncome === 0) &&
                          (partner.initialIncome === undefined ||
                            partner.initialIncome === 0) && (
                            <div className="text-gray-500 dark:text-gray-500">
                              初期年収が設定されていません
                            </div>
                          )}
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => void handleApplyInitialIncome()}
                      disabled={
                        (self.initialIncome === undefined ||
                          self.initialIncome === 0) &&
                        (partner.initialIncome === undefined ||
                          partner.initialIncome === 0)
                      }
                    >
                      Apply to All Years
                    </Button>
                  </div>
                </div>
              )}

              {/* Children List */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <ChildrenList />
              </div>
            </div>
          </Card>

          {/* Income Settings Section */}
          <Card title="Income Settings" collapsible defaultExpanded={false}>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set annual income
              </p>
              <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            </div>
          </Card>

          {/* Expense Settings Section */}
          <Card title="Expense Settings" collapsible defaultExpanded={false}>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set expense categories
              </p>
              <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            </div>
          </Card>

          {/* Parameters Settings Section */}
          <Card title="Parameters Settings" collapsible defaultExpanded={false}>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set parameters such as inflation rate and investment return rate
              </p>
              <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
