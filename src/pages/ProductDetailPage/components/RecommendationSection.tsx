import { Spacing, Text } from '@/ui-lib';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import { useSuspenseQuery, useQueries, useQuery } from '@tanstack/react-query';
import { getRecommendations, getProductInfo } from '@/apis/product';
import { getExchangeRate } from '@/apis/exchange';
import { useContext } from 'react';
import { CurrencyContext } from '@/context/currencyContext';
import { formatPriceWithExchange } from '@/utils/price';
import Loading from '@/components/Loading';

function RecommendationSection({ productId }: { productId: number }) {
  const { currency } = useContext(CurrencyContext);

  const { data: productIds } = useSuspenseQuery({
    queryKey: ['recommendedProductIds', productId],
    queryFn: () => getRecommendations(productId),
  });

  const { data: exchangeData } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
  });

  const productQueries = useQueries({
    queries: productIds.recommendProductIds.map((id: number) => ({
      queryKey: ['product', id],
      queryFn: () => getProductInfo(id),
    })),
  });

  const isLoading = productQueries.some(query => query.isLoading);
  const products = productQueries.map(query => query.data).filter(data => !!data);

  // 환율 정보 (실패 시 기본값 1)
  const exchangeRate = exchangeData ? exchangeData.exchangeRate.KRW / exchangeData.exchangeRate.USD : 1;

  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />
      {isLoading ? (
        <Loading guide="추천상품을 불러오는 중..." />
      ) : (
        <HStack gap={1.5} overflowX="auto">
          {products.map(product => (
            <RecommendationProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
              <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
              <RecommendationProductItem.Info name={product.name} rating={product.rating} />
              <RecommendationProductItem.Price>
                {formatPriceWithExchange(product.price, currency, exchangeRate)}
              </RecommendationProductItem.Price>
            </RecommendationProductItem.Root>
          ))}
        </HStack>
      )}
    </styled.section>
  );
}

export default RecommendationSection;
