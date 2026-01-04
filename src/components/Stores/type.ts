// Nested country info
interface Country {
  id: string;
  name: string;
}

// Timezone wrapper
interface Timezone {
  Country: Country;
}

// Package protection settingsc


// Individual protection order summary
export interface PackageProtectionOrderSummary {
  hasPackageProtection: boolean;
  id: number;
  protectionFee: string; // e.g. "11.24"
  orderAmount: string; // e.g. "163.79"
}

// Main store record
export interface StoreRecord {
  createdAt: string; // ISO timestamp
  name: string;
  domain: string;
  plan: string;
  development: boolean;
  id: string; // Shopify GID
  uninstalledAt: string | null; // ISO timestamp or null
  currencyCode: string; // e.g. "USD", "BDT"
  Timezone: Timezone;
  appReview:boolean;
  Campaigns:{
    id: string;
    status: string;
  }[]
}

// Array of stores
export type StoreRecordList = StoreRecord[];

export interface IStats {
  totalInstalled:number,
  currentInstalled:number,
  totalUninstalled:number,
  totalStandard:number,
  totalPlus:number,
  totalEnterprise:number,
}
