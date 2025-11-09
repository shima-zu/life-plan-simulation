'use client';

import { Card } from '@/shared/ui/Card';
import { useFamilyData } from '@/entities/family/model/store';
import { FamilySettingsForm } from '@/widgets/family-settings-form/ui/FamilySettingsForm';
import { ChildrenList } from '@/widgets/children-list/ui/ChildrenList';

export const SettingsPage = (): JSX.Element => {
  const { getMember } = useFamilyData();
  const self = getMember('self');
  const spouse = getMember('spouse');
  const isFamilyCompleted = !!self && !!spouse;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configure settings for life plan simulation
          </p>
        </div>

        <div className="space-y-8">
          {/* Family Settings Section */}
          <Card title="Family Settings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Set basic information for yourself and your spouse
                </p>
                {isFamilyCompleted && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <svg
                      className="w-5 h-5"
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

              {/* Children List */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <ChildrenList />
              </div>
            </div>
          </Card>

          {/* Income Settings Section */}
          <Card title="Income Settings">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Set annual income
              </p>
              <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Coming soon</p>
              </div>
            </div>
          </Card>

          {/* Expense Settings Section */}
          <Card title="Expense Settings">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Set expense categories
              </p>
              <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Coming soon</p>
              </div>
            </div>
          </Card>

          {/* Parameters Settings Section */}
          <Card title="Parameters Settings">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Set parameters such as inflation rate and investment return rate
              </p>
              <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">Coming soon</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
