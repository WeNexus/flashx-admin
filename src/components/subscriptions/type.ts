export const SubscriptionStatuss = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  FROZEN: 'FROZEN',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
} as const;

export type SubscriptionStatus = typeof SubscriptionStatuss[keyof typeof SubscriptionStatuss];

export interface Plan {
  id: number;
  handle: string;
  name: string;
  priceCents: number;
  interval: string;
  isActive: boolean;
}

export interface StoreSubscription {
  id: string;
  status: SubscriptionStatus;
  shopifySubscriptionGid: string | null;
  currentPeriodStartAt: string | null;
  currentPeriodEndAt: string | null;
  updatedAt: string;
  plan: Plan;
}

export interface StoreRow {
  id: string;
  name: string;
  domain: string;
  appStatus: string;
  development: boolean | null;
  installedAt: string;
  updatedAt: string;
  StoreSubscription: StoreSubscription | null;
}

export interface SubscriptionFilters {
  q: string;
  status: string;
  page: number;
  perPage: number;
  totalFiltered: number;
  totalPages: number;
}

export interface SubscriptionTotals {
  totalSubscriptions: number;
  totalStores: number;
  totalCanceledOrExpired: number;
}

export interface SubscriptionData {
  totals: SubscriptionTotals;
  filters: SubscriptionFilters;
  items: StoreRow[];
}