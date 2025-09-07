import BannerSection from './components/BannerSection';
import CurrentLevelSection from './components/CurrentLevelSection';
import ProductListSection from './components/ProductListSection';
import RecentPurchaseSection from './components/RecentPurchaseSection';
import { useAtomValue } from 'jotai';
import { currencyAtom } from '@/atoms/currency';

function HomePage() {
  const currency = useAtomValue(currencyAtom);

  return (
    <>
      <BannerSection />
      <CurrentLevelSection />
      <RecentPurchaseSection currency={currency} />
      <ProductListSection currency={currency} />
    </>
  );
}

export default HomePage;
