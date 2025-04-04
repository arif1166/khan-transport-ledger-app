
export interface Receipt {
  id: string;
  date: string;
  receiptNumber: string;
  transporterName: string;
  advanceAmount: number;
  quantity: number;
  unitPrice: number;
  totalRent: number;
  expenses: Expense[];
  totalExpenses: number;
  remainingAmount: number;
  balanceAmount: number;
  status: 'pending' | 'paid';
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface DashboardSummary {
  totalReceived: number;
  totalPending: number;
}
