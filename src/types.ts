export interface Country {
  name: string;
  flag: string;
  prefix: string;
  samplePrefix: string;
  iso: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number; // e.g. 60 DOP per 1 USD
  operators: string[];
  isDefaultUnlocked: boolean;
}

export interface RechargeHistoryItem {
  id: string;
  flag: string;
  phone: string;
  country: string;
  operator: string;
  amountUsd: number;
  localAmount: string;
  status: 'Completada' | 'En proceso' | 'Fallida';
  date: string;
  referenceId: string;
}

export interface RechargeFormData {
  countryName: string;
  prefix: string;
  operator: string;
  phone: string;
  amountUsd: number;
  customAmount?: number;
}
