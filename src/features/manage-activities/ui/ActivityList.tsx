'use client';

import { useState } from 'react';
import type { Activity } from '@/entities/family/model/types';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';

type ActivityListProps = {
  activities: Activity[];
  onChange: (activities: Activity[]) => void;
};

export const ActivityList = ({ activities, onChange }: ActivityListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<Omit<Activity, 'id'>>({
    name: '',
    startDate: '',
    endDate: '',
    monthlyCost: 0,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    startDate?: string;
    endDate?: string;
    monthlyCost?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter activity name';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Please enter start date';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Please enter end date';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.monthlyCost < 0) {
      newErrors.monthlyCost = 'Cost must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = (): void => {
    setEditingActivity(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      monthlyCost: 0,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (activity: Activity): void => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      startDate: activity.startDate,
      endDate: activity.endDate,
      monthlyCost: activity.monthlyCost,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = (): void => {
    if (!validate()) return;

    if (editingActivity) {
      // Update existing
      const updated = activities.map((a) =>
        a.id === editingActivity.id
          ? { ...formData, id: editingActivity.id }
          : a,
      );
      onChange(updated);
    } else {
      // Add new
      const newActivity: Activity = {
        ...formData,
        id: crypto.randomUUID(),
      };
      onChange([...activities, newActivity]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string): void => {
    onChange(activities.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Activities
        </h4>
        <Button variant="outline" onClick={handleAdd} className="text-sm">
          + Add Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No activities added yet
        </p>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {activity.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.startDate} - {activity.endDate} · ¥
                  {activity.monthlyCost.toLocaleString()}/month
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingActivity ? 'Edit Activity' : 'Add Activity'}
        onConfirm={handleSave}
        confirmLabel="Save"
      >
        <div className="space-y-4">
          <Input
            label="Activity Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="e.g., Piano lessons"
          />

          <Input
            label="Start Date"
            type="month"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            error={errors.startDate}
          />

          <Input
            label="End Date"
            type="month"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            error={errors.endDate}
          />

          <Input
            label="Monthly Cost (¥)"
            type="number"
            min="0"
            value={formData.monthlyCost}
            onChange={(e) =>
              setFormData({
                ...formData,
                monthlyCost: parseInt(e.target.value, 10) || 0,
              })
            }
            error={errors.monthlyCost}
          />
        </div>
      </Dialog>
    </div>
  );
};
