'use client';

import { useState, useEffect, JSX } from 'react';
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

export function FamilyMemberCard({
  role,
  member,
  onSave,
  roleLabel,
}: FamilyMemberCardProps): JSX.Element {
  const [name, setName] = useState(member?.name || '');
  const [birthDate, setBirthDate] = useState(member?.birthDate || '');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>(
    {},
  );

  useEffect(() => {
    if (member) {
      setName(member.name);
      setBirthDate(member.birthDate);
    } else {
      setName('');
      setBirthDate('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.id, member?.name, member?.birthDate]);

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

    onSave({
      name: name.trim(),
      birthDate,
      role,
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

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Save
        </button>
      </div>
    </Card>
  );
}
