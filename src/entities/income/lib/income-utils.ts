import type { YearlyIncome } from '../model/types';
import type { FamilyMember } from '@/entities/family/model/types';

/**
 * Generate year range from current year to age 90
 */
export const generateYearRange = (birthYear: number): number[] => {
  const currentYear = new Date().getFullYear();
  const targetAge = 90;
  const targetYear = birthYear + targetAge;
  const years: number[] = [];

  for (let year = currentYear; year <= targetYear; year++) {
    years.push(year);
  }

  return years;
};

/**
 * Get initial incomes based on family data
 * If initialIncome is set in family members, use it for all years
 */
export const getInitialIncomes = (
  selfMember: FamilyMember | undefined,
  partnerMember: FamilyMember | undefined,
  yearRange: number[],
): YearlyIncome[] => {
  const selfIncome = selfMember?.initialIncome ?? 0;
  const partnerIncome = partnerMember?.initialIncome ?? 0;

  return yearRange.map((year) => ({
    year,
    selfIncome,
    partnerIncome,
  }));
};

/**
 * Format income value for display (万円単位)
 */
export const formatIncome = (value: number): string => {
  if (value === 0 || isNaN(value)) {
    return '';
  }
  return value.toString();
};

/**
 * Parse income input string to number
 */
export const parseIncomeInput = (value: string): number => {
  const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get birth year from birth date string (YYYY-MM-DD)
 */
export const getBirthYear = (birthDate: string): number => {
  return new Date(birthDate).getFullYear();
};

/**
 * Calculate age at a specific year from birth date
 */
export const calculateAgeAtYear = (
  birthDate: string,
  targetYear: number,
): number => {
  const birth = new Date(birthDate);
  const birthYear = birth.getFullYear();

  // Age is calculated as: targetYear - birthYear
  // For annual planning, we use the year difference
  return targetYear - birthYear;
};

/**
 * Apply initial income to all years in existing income data
 */
export const applyInitialIncomeToAllYears = (
  existingIncomes: YearlyIncome[],
  selfInitialIncome: number,
  partnerInitialIncome: number,
): YearlyIncome[] => {
  // Create a map of existing incomes by year
  const incomeMap = new Map<number, YearlyIncome>();
  existingIncomes.forEach((income) => {
    incomeMap.set(income.year, income);
  });

  // Get all unique years from existing data
  const years = Array.from(incomeMap.keys()).sort((a, b) => a - b);

  // Apply initial income to all years
  return years.map((year) => ({
    year,
    selfIncome: selfInitialIncome,
    partnerIncome: partnerInitialIncome,
  }));
};

/**
 * Calculate salary deduction (給与所得控除) in 万円
 */
const calculateSalaryDeduction = (grossIncome: number): number => {
  if (grossIncome <= 180) {
    return Math.max(55, 65); // Minimum 65万円
  } else if (grossIncome <= 360) {
    return grossIncome * 0.4 - 18;
  } else if (grossIncome <= 660) {
    return grossIncome * 0.3 + 18;
  } else if (grossIncome <= 850) {
    return grossIncome * 0.2 + 54;
  } else {
    return 195; // Maximum 195万円
  }
};

/**
 * Calculate income tax (所得税) in 万円
 * Based on progressive tax brackets
 */
const calculateIncomeTax = (taxableIncome: number): number => {
  let tax = 0;
  let remaining = taxableIncome;

  if (remaining > 4000) {
    tax += (remaining - 4000) * 0.45;
    remaining = 4000;
  }
  if (remaining > 1800) {
    tax += (remaining - 1800) * 0.4;
    remaining = 1800;
  }
  if (remaining > 900) {
    tax += (remaining - 900) * 0.33;
    remaining = 900;
  }
  if (remaining > 695) {
    tax += (remaining - 695) * 0.23;
    remaining = 695;
  }
  if (remaining > 330) {
    tax += (remaining - 330) * 0.2;
    remaining = 330;
  }
  if (remaining > 195) {
    tax += (remaining - 195) * 0.1;
    remaining = 195;
  }
  if (remaining > 0) {
    tax += remaining * 0.05;
  }

  return tax;
};

/**
 * Calculate net income (手取り年収) from gross income (年収)
 * Takes into account:
 * - Salary deduction (給与所得控除)
 * - Income tax (所得税) - progressive tax
 * - Resident tax (住民税) - approximately 10%
 * - Social insurance (社会保険料) - approximately 15%
 *
 * @param grossIncome Gross annual income in 万円
 * @returns Net annual income in 万円
 */
export const calculateNetIncome = (grossIncome: number): number => {
  if (grossIncome <= 0) {
    return 0;
  }

  // Calculate salary deduction
  const salaryDeduction = calculateSalaryDeduction(grossIncome);

  // Calculate taxable income
  const taxableIncome = Math.max(0, grossIncome - salaryDeduction);

  // Calculate income tax
  const incomeTax = calculateIncomeTax(taxableIncome);

  // Calculate resident tax (approximately 10% of taxable income)
  const residentTax = taxableIncome * 0.1;

  // Calculate social insurance (approximately 15% of gross income)
  // This includes health insurance, pension, employment insurance
  const socialInsurance = grossIncome * 0.15;

  // Calculate net income
  const netIncome = grossIncome - incomeTax - residentTax - socialInsurance;

  // Round to nearest integer
  return Math.round(netIncome);
};
