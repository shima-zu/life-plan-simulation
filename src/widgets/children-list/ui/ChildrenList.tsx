'use client';

import { useState, useMemo, useEffect, useRef, JSX } from 'react';
import { useFamilyData } from '@/entities/family/model/store';
import { ChildForm } from '@/features/edit-child/ui/ChildForm';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';

export const ChildrenList = (): JSX.Element => {
  const { familyData, addMember, updateMember, removeMember } = useFamilyData();
  const children = useMemo(
    () => familyData.members.filter((member) => member.role === 'child'),
    [familyData.members],
  );
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const previousChildrenCountRef = useRef(children.length);

  // Auto-expand newly added child
  useEffect(() => {
    if (children.length > previousChildrenCountRef.current) {
      // A new child was added, expand the last one
      const lastChild = children[children.length - 1];
      if (lastChild) {
        // This is intentional: we want to expand the newly added child
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpandedChildId(lastChild.id);
      }
    }
    previousChildrenCountRef.current = children.length;
  }, [children]);

  const handleAddChild = (): void => {
    const newChild: Omit<
      import('@/entities/family/model/types').FamilyMember,
      'id'
    > = {
      name: '',
      birthDate: '',
      role: 'child',
      childData: {
        educationPlan: {},
        activities: [],
      },
    };
    addMember(newChild);
  };

  const handleSaveChild = (
    childData: Omit<import('@/entities/family/model/types').FamilyMember, 'id'>,
  ): void => {
    const child = children.find((c) => c.id === expandedChildId);
    if (child) {
      updateMember(child.id, childData);
    } else {
      addMember(childData);
    }
  };

  const handleDeleteClick = (id: string): void => {
    setChildToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (): void => {
    if (childToDelete) {
      removeMember(childToDelete);
      if (expandedChildId === childToDelete) {
        setExpandedChildId(null);
      }
      setChildToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Children
        </h3>
        <Button variant="outline" onClick={handleAddChild}>
          + Add Child
        </Button>
      </div>

      {children.length === 0 ? (
        <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No children added yet. Click &quot;+ Add Child&quot; to add one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedChildId(
                    expandedChildId === child.id ? null : child.id,
                  )
                }
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {expandedChildId === child.id ? '▼' : '▶'}
                  </span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {child.name || 'Unnamed Child'}
                    </p>
                    {child.birthDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Born: {child.birthDate}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {expandedChildId === child.id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <ChildForm
                    child={child}
                    onSave={handleSaveChild}
                    onDelete={() => handleDeleteClick(child.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Child"
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this child? This action cannot be
          undone.
        </p>
      </Dialog>
    </div>
  );
};
