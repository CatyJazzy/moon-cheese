import { getExchangeRate } from '@/apis/exchange';
import BannerSection from './components/BannerSection';
import CurrentLevelSection from './components/CurrentLevelSection';
import ProductListSection from './components/ProductListSection';
import RecentPurchaseSection from './components/RecentPurchaseSection';
import { useContext, useEffect, useState } from 'react';
import { CurrencyContext } from '@/context/currencyContext';

function HomePage() {
  // TODO: 환율 fetching 실패했을 때는 가격도 로딩 처리해야 함
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    getExchangeRate().then(res => {
      const { KRW, USD } = res.exchangeRate;
      const rate = KRW / USD;
      setExchangeRate(rate);
    });
  }, []);

  const { currency } = useContext(CurrencyContext);

  return (
    <>
      <BannerSection />
      <CurrentLevelSection />
      <RecentPurchaseSection currency={currency} exchangeRate={exchangeRate} />
      <ProductListSection />
    </>
  );
}

export default HomePage;
