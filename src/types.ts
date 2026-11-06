export interface ExpenseItem {
  id: string;
  name: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice: number;
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Groceries'
  | 'Travel & Fuel'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Health & Medical'
  | 'Entertainment'
  | 'Others';

export type PaymentMethod =
  | 'UPI'
  | 'Credit/Debit Card'
  | 'Cash'
  | 'Net Banking'
  | 'Wallet'
  | 'Other';

export interface ConfidenceScores {
  merchant: number;
  amount: number;
  date: number;
  items: number;
}

export interface ExpenseRecord {
  id: string;
  merchant: string;
  date: string;
  time?: string;
  amount: number;
  currency: string;
  tax?: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  items: ExpenseItem[];
  sourceImage?: string;
  sourceType: 'receipt_photo' | 'thermal_bill' | 'upi_screenshot' | 'manual';
  confidenceScores: ConfidenceScores;
  uncertainties: string[];
  isEdited: boolean;
  notes?: string;
  createdAt: string;
}

export interface ExtractionResult {
  merchant: string;
  date: string;
  time?: string;
  amount: number;
  currency: string;
  tax?: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  items: ExpenseItem[];
  sourceType: 'receipt_photo' | 'thermal_bill' | 'upi_screenshot';
  confidenceScores: ConfidenceScores;
  uncertainties: string[];
  rawImage?: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imagePath: string;
  type: 'receipt_photo' | 'thermal_bill' | 'upi_screenshot';
  summary: string;
  defaultExtraction: ExtractionResult;
}
