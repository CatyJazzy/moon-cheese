import { createContext, useState } from 'react';
import { type CurrencyType } from '@/ui-lib/components/currency-toggle';

// TODO: USD, 원 표현 상수로 분리 (여러 곳에서 쓰이니까) - currency_toggle.tsx
const CurrencyContext = createContext<{
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
}>({ currency: 'USD', setCurrency: () => {} });

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
};

export { CurrencyContext, CurrencyProvider };
