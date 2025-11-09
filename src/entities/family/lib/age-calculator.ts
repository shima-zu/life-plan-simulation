import { calculateAge } from '@/shared/lib/date-utils';

/**
 * Calculate current age from birth date
 */
export function getAge(birthDate: string): number {
  return calculateAge(birthDate);
}

/**
 * Calculate age at a specific year
 */
export function getAgeAtYear(birthDate: string, year: number): number {
  const birth = new Date(birthDate);
  return year - birth.getFullYear();
}
