import { Spacing, type TagType } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import DataWrapper from '@/components/DataWrapper';
import { useParams } from 'react-router';
import { useSuspenseQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductInfo } from '@/apis/product';
import { getExchangeRate } from '@/apis/exchange';
import { useContext } from 'react';
import { CurrencyContext } from '@/context/currencyContext';
import { formatPriceWithExchange } from '@/utils/price';

function ProductDetailPageContent() {
  const { id } = useParams();
  const { currency } = useContext(CurrencyContext);
  const queryClient = useQueryClient();

  const { data: productInfo } = useSuspenseQuery({
    queryKey: ['productInfo', id],
    queryFn: () => getProductInfo(Number(id)),
  });

  const { data: exchangeData } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
  });

  // TODO: 환율은 더 상위에서 한 번만 받아와서 관리하도록 수정하기
  // TODO: 환율 fetching 실패했을 때는 가격도 로딩 처리하고 싶음 (지금은 임시로 1)
  const exchangeRate = exchangeData ? exchangeData.exchangeRate.KRW / exchangeData.exchangeRate.USD : 1;
  const formattedPrice = formatPriceWithExchange(productInfo.price, currency, exchangeRate);

  return (
    <>
      <ThumbnailSection images={productInfo.images} />
      <ProductInfoSection
        id={productInfo.id}
        name={productInfo.name}
        category={productInfo.category.toLowerCase() as TagType}
        rating={productInfo.rating}
        price={formattedPrice}
        quantity={productInfo.stock}
      />

      <Spacing size={2.5} />

      <ProductDetailSection description={productInfo.description} />

      <Spacing size={2.5} />

      <DataWrapper
        loadingGuide="추천상품을 불러오는 중..."
        onRetry={() => {
          queryClient.invalidateQueries({ queryKey: ['recommendedProductIds', id] });
        }}
      >
        <RecommendationSection productId={Number(id)} />
      </DataWrapper>
    </>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['productInfo', id] });
    queryClient.invalidateQueries({ queryKey: ['exchangeRate'] });
  };

  return (
    <DataWrapper loadingGuide="상품 정보를 불러오는 중..." onRetry={handleRetry}>
      <ProductDetailPageContent />
    </DataWrapper>
  );
}

export default ProductDetailPage;
