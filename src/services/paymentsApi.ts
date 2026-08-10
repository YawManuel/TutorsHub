import { api } from './apiClient';

/**
 * Phase 4 payments, wallet & subscriptions APIs — all authenticated. Covers the
 * TUT Coin wallet (Home card), Paystack-backed top-ups & subscription purchases,
 * and withdrawals. Paystack runs in sandbox mode until real keys are configured
 * on the backend, so the whole flow works end-to-end in dev.
 */

export interface WalletTransaction {
  id: string;
  direction: 'credit' | 'debit';
  amount: number;
  reason: 'topup' | 'subscription' | 'booking' | 'withdrawal' | 'refund';
  balanceAfter: number;
  reference: string | null;
  description: string | null;
  createdAt: string;
}

export interface Wallet {
  balance: number; // TUT Coins
  balanceGhs: number;
  transactions: WalletTransaction[];
}

export interface Subscription {
  id: string;
  plan: string; // 'hub' | 'combo' | 'pseudo'
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface PaymentInit {
  reference: string;
  authorizationUrl: string;
  amountGhs: number;
  coins: number;
  sandbox: boolean;
}

export interface PaymentResult {
  reference: string;
  status: string; // 'success' | 'pending' | 'failed'
  verified: boolean;
  balance: number;
  coinsGranted?: number;
  alreadyProcessed?: boolean;
  subscription?: Subscription | null;
}

export interface WithdrawResult {
  balance: number;
  balanceGhs: number;
  withdrawnGhs: number;
}

export const paymentsApi = {
  wallet: () => api.get<Wallet>('/wallet').then((r) => r.data),
  subscription: () => api.get<Subscription | null>('/subscriptions/me').then((r) => r.data),

  topupInit: (amountGhs: number) =>
    api.post<PaymentInit>('/payments/topup/init', { amountGhs }).then((r) => r.data),
  subscribeInit: (packageSlug: string) =>
    api.post<PaymentInit>('/payments/subscribe/init', { packageSlug }).then((r) => r.data),
  verify: (reference: string) =>
    api.get<PaymentResult>(`/payments/verify/${reference}`).then((r) => r.data),

  withdraw: (coins: number) =>
    api.post<WithdrawResult>('/wallet/withdraw', { coins }).then((r) => r.data),
};
