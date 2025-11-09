'use client';

import { useState, useEffect } from 'react';
import type { FamilyMember, FamilyRole } from '@/entities/family/model/types';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { AgeDisplay } from '@/entities/family/ui/AgeDisplay';

type FamilyMemberCardProps = {
  role: FamilyRole;
  member: FamilyMember | undefined;
  onSave: (member: Omit<FamilyMember, 'id'>) => void;
  roleLabel: string;
};

export const FamilyMemberCard = ({
  role,
  member,
  onSave,
  roleLabel,
}: FamilyMemberCardProps) => {
  const [name, setName] = useState(member?.name || '');
  const [birthDate, setBirthDate] = useState(member?.birthDate || '');
  const [initialIncome, setInitialIncome] = useState(
    member?.initialIncome?.toString() || '',
  );
  const [errors, setErrors] = useState<{
    name?: string;
    birthDate?: string;
    initialIncome?: string;
  }>({});

  useEffect(() => {
    if (member) {
      setName(member.name);
      setBirthDate(member.birthDate);
      setInitialIncome(member.initialIncome?.toString() || '');
    } else {
      setName('');
      setBirthDate('');
      setInitialIncome('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.id, member?.name, member?.birthDate, member?.initialIncome]);

  const validate = (): boolean => {
    const newErrors: { name?: string; birthDate?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter a name';
    }

    if (!birthDate) {
      newErrors.birthDate = 'Please enter a birth date';
    } else {
      const date = new Date(birthDate);
      const today = new Date();
      if (date > today) {
        newErrors.birthDate = 'Future dates are not allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (): void => {
    if (!validate()) return;

    const incomeValue = initialIncome.trim()
      ? parseInt(initialIncome.replace(/[^0-9]/g, ''), 10)
      : undefined;

    onSave({
      name: name.trim(),
      birthDate,
      role,
      initialIncome:
        incomeValue && !isNaN(incomeValue) ? incomeValue : undefined,
    });
  };

  return (
    <Card title={roleLabel}>
      <div className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="e.g., John Doe"
        />

        <div>
          <Input
            label="Birth Date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            error={errors.birthDate}
            max={new Date().toISOString().split('T')[0]}
          />
          {birthDate && <AgeDisplay birthDate={birthDate} className="mt-1" />}
        </div>

        <Input
          label="Initial Annual Income (万円)"
          type="text"
          inputMode="numeric"
          value={initialIncome}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setInitialIncome(value);
          }}
          error={errors.initialIncome}
          placeholder="e.g., 500"
        />

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Save
        </button>
      </div>
    </Card>
  );
};
