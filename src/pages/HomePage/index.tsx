import { getExchangeRate } from '@/apis/exchange';
import BannerSection from './components/BannerSection';
import CurrentLevelSection from './components/CurrentLevelSection';
import ProductListSection from './components/ProductListSection';
import RecentPurchaseSection from './components/RecentPurchaseSection';
import { Suspense, useContext } from 'react';
import { CurrencyContext } from '@/context/currencyContext';
import { useQuery } from '@tanstack/react-query';

function HomePage() {
  const { data: exchangeData } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
  });

  // TODO: 환율 fetching 실패했을 때는 가격도 로딩 처리하고 싶음 (지금은 임시로 1)
  const exchangeRate = exchangeData ? exchangeData.exchangeRate.KRW / exchangeData.exchangeRate.USD : 1;

  const { currency } = useContext(CurrencyContext);

  return (
    <>
      <BannerSection />
      <Suspense fallback={'TODO: 로딩처리'}>
        <CurrentLevelSection />
      </Suspense>
      <RecentPurchaseSection currency={currency} exchangeRate={exchangeRate} />
      <ProductListSection />
    </>
  );
}

export default HomePage;
