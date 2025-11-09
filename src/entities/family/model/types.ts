export type FamilyRole = 'self' | 'partner' | 'child';

// Education types
export type SchoolType = 'public' | 'private';
export type UniversityType =
  | 'public-arts'
  | 'public-science'
  | 'private-arts'
  | 'private-science';

export type EducationPlan = {
  kindergarten?: SchoolType;
  elementary?: SchoolType;
  juniorHigh?: SchoolType;
  highSchool?: SchoolType;
  university?: UniversityType;
  graduateSchool?: boolean;
  boarding?: boolean; // 下宿
};

// Extracurricular activity
export type Activity = {
  id: string;
  name: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM
  monthlyCost: number;
};

// Child-specific data
export type ChildData = {
  educationPlan: EducationPlan;
  activities: Activity[];
};

// Extended FamilyMember
export type FamilyMember = {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  role: FamilyRole;
  childData?: ChildData; // only for role='child'
};

export type FamilyData = {
  members: FamilyMember[];
  updatedAt: string;
};
