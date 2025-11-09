'use client';

import { useMemo } from 'react';
import { useIncomeData } from '@/entities/income/model/store';
import {
  formatIncome,
  parseIncomeInput,
  calculateAgeAtYear,
  calculateNetIncome,
} from '@/entities/income/lib/income-utils';
import type { YearlyIncome } from '@/entities/income/model/types';
import type { FamilyMember } from '@/entities/family/model/types';

type AgeInfo = {
  name: string;
  birthDate: string;
};

type IncomeTableProps = {
  yearRange: number[];
  selfName: string;
  partnerName: string;
  selfBirthDate?: string;
  partnerBirthDate?: string;
  childrenMembers?: FamilyMember[];
};

export const IncomeTable = ({
  yearRange,
  selfName,
  partnerName,
  selfBirthDate,
  partnerBirthDate,
  childrenMembers = [],
}: IncomeTableProps) => {
  const { incomeData, updateIncome } = useIncomeData();

  // Create age info array
  const ageInfos = useMemo(() => {
    const infos: AgeInfo[] = [];
    if (selfBirthDate) {
      infos.push({ name: selfName, birthDate: selfBirthDate });
    }
    if (partnerBirthDate) {
      infos.push({ name: partnerName, birthDate: partnerBirthDate });
    }
    childrenMembers.forEach((child) => {
      if (child.birthDate) {
        infos.push({ name: child.name, birthDate: child.birthDate });
      }
    });
    return infos;
  }, [selfBirthDate, partnerBirthDate, childrenMembers, selfName, partnerName]);

  // Create a map for quick lookup
  const incomeMap = useMemo(() => {
    const map = new Map<number, YearlyIncome>();
    incomeData.incomes.forEach((income) => {
      map.set(income.year, income);
    });
    return map;
  }, [incomeData.incomes]);

  const getIncomeValue = (
    year: number,
    field: 'selfIncome' | 'partnerIncome',
  ): number => {
    const income = incomeMap.get(year);
    return income?.[field] ?? 0;
  };

  const handleInputChange = (
    year: number,
    field: 'selfIncome' | 'partnerIncome',
    value: string,
  ) => {
    const parsedValue = parseIncomeInput(value);
    updateIncome(year, field, parsedValue);
  };

  return (
    <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg">
      <div className="min-w-full inline-block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 min-w-[120px]">
                Year
              </th>
              {yearRange.map((year) => (
                <th
                  key={year}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]"
                >
                  {year}
                </th>
              ))}
            </tr>
            {ageInfos.length > 0 &&
              ageInfos.map((ageInfo) => (
                <tr key={`age-${ageInfo.name}-${ageInfo.birthDate}`}>
                  <th className="px-4 py-1.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 min-w-[120px]">
                    {ageInfo.name}
                  </th>
                  {yearRange.map((year) => (
                    <th
                      key={year}
                      className="px-3 py-1.5 text-center text-xs text-gray-600 dark:text-gray-400 min-w-[100px]"
                    >
                      {calculateAgeAtYear(ageInfo.birthDate, year)}歳
                    </th>
                  ))}
                </tr>
              ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {/* Self row */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 z-10">
                {selfName}年収
              </td>
              {yearRange.map((year) => (
                <td key={year} className="px-2 py-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatIncome(getIncomeValue(year, 'selfIncome'))}
                    onChange={(e) =>
                      handleInputChange(year, 'selfIncome', e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500"
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
            {/* Self net income row */}
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <td className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-300 dark:border-gray-700 z-10">
                {selfName}手取り
              </td>
              {yearRange.map((year) => {
                const grossIncome = getIncomeValue(year, 'selfIncome');
                const netIncome = calculateNetIncome(grossIncome);
                return (
                  <td
                    key={year}
                    className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    {netIncome > 0 ? formatIncome(netIncome) : ''}
                  </td>
                );
              })}
            </tr>
            {/* Partner row */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 z-10">
                {partnerName}年収
              </td>
              {yearRange.map((year) => (
                <td key={year} className="px-2 py-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatIncome(getIncomeValue(year, 'partnerIncome'))}
                    onChange={(e) =>
                      handleInputChange(year, 'partnerIncome', e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500"
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
            {/* Partner net income row */}
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <td className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-300 dark:border-gray-700 z-10">
                {partnerName}手取り
              </td>
              {yearRange.map((year) => {
                const grossIncome = getIncomeValue(year, 'partnerIncome');
                const netIncome = calculateNetIncome(grossIncome);
                return (
                  <td
                    key={year}
                    className="px-2 py-2 text-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    {netIncome > 0 ? formatIncome(netIncome) : ''}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
