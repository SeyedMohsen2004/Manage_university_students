export interface IAuthCredentials {
  username: string;
  password: string;
}

export interface IDateRange {
  startDate?: string;
  endDate?: string;
}

export interface ITransaction {
  cost: number | null;
  purchase_date: string;
  task_name: number | null;
}

export interface ITransactions {
  id: number;
  user: string;
  cost: number;
  "task_name_display": "string",
  "purchase_date": string;
  "task_name": number;
}

export interface IExpenseRequest {
  group: number | null;
  paid_by: number,
  amount: number,
  description: string
}

