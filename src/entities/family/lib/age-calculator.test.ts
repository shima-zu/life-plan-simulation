import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAge, getAgeAtYear } from './age-calculator';

describe('age-calculator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getAge', () => {
    it('calculates age correctly for a person born in the past', () => {
      // Set current date to 2024-01-15
      vi.setSystemTime(new Date('2024-01-15'));

      // Person born on 2000-01-15 should be 24 years old
      expect(getAge('2000-01-15')).toBe(24);

      // Person born on 2000-01-16 should be 23 years old (not yet birthday)
      expect(getAge('2000-01-16')).toBe(23);
    });

    it('handles leap year birthdays correctly', () => {
      vi.setSystemTime(new Date('2024-02-29'));

      // Person born on 2000-02-29 should be 24 years old
      expect(getAge('2000-02-29')).toBe(24);

      // Person born on 2000-03-01 should be 23 years old
      expect(getAge('2000-03-01')).toBe(23);
    });

    it('calculates age correctly for someone born this year', () => {
      vi.setSystemTime(new Date('2024-06-15'));

      // Person born on 2024-01-15 should be 0 years old
      expect(getAge('2024-01-15')).toBe(0);

      // Person born on 2024-06-16 should be -1 (not yet born, but function doesn't validate)
      // This is expected behavior - validation should be done elsewhere
      expect(getAge('2024-06-16')).toBe(-1);
    });
  });

  describe('getAgeAtYear', () => {
    it('calculates age at a specific year correctly', () => {
      // Person born in 2000 should be 24 years old in 2024
      expect(getAgeAtYear('2000-01-15', 2024)).toBe(24);

      // Person born in 2000 should be 30 years old in 2030
      expect(getAgeAtYear('2000-01-15', 2030)).toBe(30);

      // Person born in 2000 should be 0 years old in 2000
      expect(getAgeAtYear('2000-01-15', 2000)).toBe(0);
    });

    it('handles future years correctly', () => {
      // Person born in 2000 should be 50 years old in 2050
      expect(getAgeAtYear('2000-01-15', 2050)).toBe(50);
    });

    it('handles year before birth year', () => {
      // Person born in 2000 should be -10 years old in 1990 (not yet born)
      expect(getAgeAtYear('2000-01-15', 1990)).toBe(-10);
    });
  });
});
