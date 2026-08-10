import { Linking } from 'react-native';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  paymentsApi,
  type PaymentResult,
  type Subscription,
  type Wallet,
  type WithdrawResult,
} from '../services/paymentsApi';

/**
 * Wallet, top-up, subscription and withdrawal hooks. Return types are annotated
 * explicitly — see the note in useCatalog.ts about react-query inference
 * collapsing under the Expo base `moduleResolution: node`.
 */

export const walletKeys = {
  wallet: ['wallet'] as const,
  subscription: ['subscription'] as const,
};

export function useWallet(): UseQueryResult<Wallet> {
  return useQuery({ queryKey: walletKeys.wallet, queryFn: paymentsApi.wallet });
}

export function useSubscription(): UseQueryResult<Subscription | null> {
  return useQuery({ queryKey: walletKeys.subscription, queryFn: paymentsApi.subscription });
}

/**
 * Top up the wallet: initialize a Paystack transaction, open the hosted
 * checkout for real payments, then verify to credit the coins. In sandbox mode
 * (no Paystack key on the backend) there is no real checkout page, so we skip
 * straight to verification.
 */
export function useTopup(): UseMutationResult<PaymentResult, Error, number> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amountGhs: number) => {
      const init = await paymentsApi.topupInit(amountGhs);
      if (!init.sandbox && (await Linking.canOpenURL(init.authorizationUrl))) {
        await Linking.openURL(init.authorizationUrl);
      }
      return paymentsApi.verify(init.reference);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.wallet });
    },
  });
}

/** Purchase/renew a subscription plan, then verify to activate it. */
export function useSubscribe(): UseMutationResult<PaymentResult, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (packageSlug: string) => {
      const init = await paymentsApi.subscribeInit(packageSlug);
      if (!init.sandbox && (await Linking.canOpenURL(init.authorizationUrl))) {
        await Linking.openURL(init.authorizationUrl);
      }
      return paymentsApi.verify(init.reference);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.wallet });
      qc.invalidateQueries({ queryKey: walletKeys.subscription });
    },
  });
}

export function useWithdraw(): UseMutationResult<WithdrawResult, Error, number> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.withdraw,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletKeys.wallet });
    },
  });
}
