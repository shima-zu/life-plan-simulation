export type FamilyRole = 'self' | 'spouse' | 'child';

export type FamilyMember = {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  role: FamilyRole;
};

export type FamilyData = {
  members: FamilyMember[];
  updatedAt: string;
};
