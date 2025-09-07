import { Spacing, type TagType } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import DataWrapper from '@/components/DataWrapper';
import { useParams } from 'react-router';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { getProductInfo } from '@/apis/product';
import { getExchangeRate } from '@/apis/exchange';
import { useAtomValue } from 'jotai';
import { currencyAtom } from '@/atoms/currency';
import { formatPrice } from '@/utils/price';

function ProductDetailPageContent() {
  const { id } = useParams();
  const currency = useAtomValue(currencyAtom);
  const queryClient = useQueryClient();

  const { data: productInfo } = useSuspenseQuery({
    queryKey: ['productInfo', id],
    queryFn: () => getProductInfo(Number(id)),
  });

  const { data: exchangeData } = useSuspenseQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
    staleTime: 30 * 60 * 1000,
  });

  const exchangeRate = exchangeData.exchangeRate[currency];
  const formattedPrice = formatPrice(productInfo.price * exchangeRate, currency);

  return (
    <>
      <ThumbnailSection images={productInfo.images} />
      <ProductInfoSection product={productInfo} formattedPrice={formattedPrice} />

      <Spacing size={2.5} />

      <ProductDetailSection description={productInfo.description} />

      <Spacing size={2.5} />

      <DataWrapper
        loadingGuide="추천상품을 불러오는 중..."
        onRetry={() => {
          queryClient.invalidateQueries({ queryKey: ['recommendedProductIds', id] });
        }}
      >
        <RecommendationSection productId={Number(id)} currency={currency} />
      </DataWrapper>
    </>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['productInfo', id] });
  };

  return (
    <DataWrapper loadingGuide="상품 정보를 불러오는 중..." onRetry={handleRetry}>
      <ProductDetailPageContent />
    </DataWrapper>
  );
}

export default ProductDetailPage;
