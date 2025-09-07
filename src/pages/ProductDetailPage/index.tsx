import { Spacing, type TagType } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import DataWrapper from '@/components/DataWrapper';
import { useParams } from 'react-router';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { productInfoQueryOptions, queryKeys as productQueryKeys } from '@/apis/product';
import { exchangeRateQueryOptions } from '@/apis/exchange';
import { useAtomValue } from 'jotai';
import { currencyAtom } from '@/atoms/currency';
import { formatPrice } from '@/utils/price';

function ProductDetailPageContent() {
  const { id } = useParams();
  const currency = useAtomValue(currencyAtom);
  const queryClient = useQueryClient();

  const { data: productInfo } = useSuspenseQuery(productInfoQueryOptions(Number(id)));

  const { data: exchangeData } = useSuspenseQuery(exchangeRateQueryOptions());

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
          queryClient.invalidateQueries({ queryKey: productQueryKeys.recommendedProductIds(Number(id)) });
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
    queryClient.invalidateQueries({ queryKey: productQueryKeys.productInfo(Number(id)) });
  };

  return (
    <DataWrapper loadingGuide="상품 정보를 불러오는 중..." onRetry={handleRetry}>
      <ProductDetailPageContent />
    </DataWrapper>
  );
}

export default ProductDetailPage;
