'use client';

import { getAge } from '../lib/age-calculator';

type AgeDisplayProps = {
  birthDate: string;
  className?: string;
};

export const AgeDisplay = ({ birthDate, className = '' }: AgeDisplayProps) => {
  if (!birthDate) return null;

  const age = getAge(birthDate);

  return (
    <span className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      (Age {age})
    </span>
  );
};
