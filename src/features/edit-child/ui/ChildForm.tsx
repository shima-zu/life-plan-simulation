'use client';

import { useState, useEffect } from 'react';
import type {
  FamilyMember,
  EducationPlan,
  ChildData,
} from '@/entities/family/model/types';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Checkbox } from '@/shared/ui/Checkbox';
import { AgeDisplay } from '@/entities/family/ui/AgeDisplay';
import { ActivityList } from '@/features/manage-activities/ui/ActivityList';

type ChildFormProps = {
  child: FamilyMember | undefined;
  onSave: (child: Omit<FamilyMember, 'id'>) => void;
  onDelete?: () => void;
};

const SCHOOL_TYPE_OPTIONS = [
  { value: '', label: 'Not set' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const UNIVERSITY_TYPE_OPTIONS = [
  { value: '', label: 'Not set' },
  { value: 'public-arts', label: 'Public (Arts)' },
  { value: 'public-science', label: 'Public (Science)' },
  { value: 'private-arts', label: 'Private (Arts)' },
  { value: 'private-science', label: 'Private (Science)' },
];

export const ChildForm = ({ child, onSave, onDelete }: ChildFormProps) => {
  const [name, setName] = useState(child?.name || '');
  const [birthDate, setBirthDate] = useState(child?.birthDate || '');
  const [educationPlan, setEducationPlan] = useState<EducationPlan>(
    child?.childData?.educationPlan || {},
  );
  const [activities, setActivities] = useState(
    child?.childData?.activities || [],
  );
  const [errors, setErrors] = useState<{
    name?: string;
    birthDate?: string;
  }>({});

  // Sync form state with child prop changes
  useEffect(() => {
    if (child) {
      setName(child.name);
      setBirthDate(child.birthDate);
      setEducationPlan(child.childData?.educationPlan || {});
      setActivities(child.childData?.activities || []);
    } else {
      setName('');
      setBirthDate('');
      setEducationPlan({});
      setActivities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child?.id]);

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

    const childData: ChildData = {
      educationPlan,
      activities,
    };

    onSave({
      name: name.trim(),
      birthDate,
      role: 'child',
      childData,
    });
  };

  const updateEducationPlan = (
    field: keyof EducationPlan,
    value: string | boolean,
  ): void => {
    setEducationPlan((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  return (
    <Card title={child ? `Child: ${child.name}` : 'New Child'}>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Basic Information
          </h3>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="e.g., Alice"
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
        </div>

        {/* Education Plan */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Education Plan
          </h3>

          <Select
            label="Kindergarten"
            value={educationPlan.kindergarten || ''}
            onChange={(e) =>
              updateEducationPlan('kindergarten', e.target.value)
            }
            options={SCHOOL_TYPE_OPTIONS}
          />

          <Select
            label="Elementary School"
            value={educationPlan.elementary || ''}
            onChange={(e) => updateEducationPlan('elementary', e.target.value)}
            options={SCHOOL_TYPE_OPTIONS}
          />

          <Select
            label="Junior High School"
            value={educationPlan.juniorHigh || ''}
            onChange={(e) => updateEducationPlan('juniorHigh', e.target.value)}
            options={SCHOOL_TYPE_OPTIONS}
          />

          <Select
            label="High School"
            value={educationPlan.highSchool || ''}
            onChange={(e) => updateEducationPlan('highSchool', e.target.value)}
            options={SCHOOL_TYPE_OPTIONS}
          />

          <Select
            label="University"
            value={educationPlan.university || ''}
            onChange={(e) => updateEducationPlan('university', e.target.value)}
            options={UNIVERSITY_TYPE_OPTIONS}
          />

          <Checkbox
            label="Graduate School"
            checked={educationPlan.graduateSchool || false}
            onChange={(e) =>
              updateEducationPlan('graduateSchool', e.target.checked)
            }
          />

          <Checkbox
            label="Boarding (Dormitory)"
            checked={educationPlan.boarding || false}
            onChange={(e) => updateEducationPlan('boarding', e.target.checked)}
          />
        </div>

        {/* Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Extracurricular Activities
          </h3>
          <ActivityList activities={activities} onChange={setActivities} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Save
          </button>
        </div>
      </div>
    </Card>
  );
};
