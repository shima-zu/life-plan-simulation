// 年収データ（万円単位）
export type YearlyIncome = {
  year: number;
  selfIncome: number; // 自分の年収（万円）
  partnerIncome: number; // 配偶者の年収（万円）
};

export type IncomeData = {
  incomes: YearlyIncome[];
  updatedAt: string;
};
