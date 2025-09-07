import { Spacing, Text } from '@/ui-lib';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import { useSuspenseQuery, useQueries } from '@tanstack/react-query';
import { recommendedProductIdsQueryOptions, productInfoQueryOptions } from '@/apis/product';
import { exchangeRateQueryOptions } from '@/apis/exchange';
import { formatPrice } from '@/utils/price';
import { type CurrencyType } from '@/atoms/currency';
import Loading from '@/components/Loading';

function RecommendationSection({ productId, currency }: { productId: number; currency: CurrencyType }) {
  const { data: productIds } = useSuspenseQuery(recommendedProductIdsQueryOptions(productId));

  const { data: exchangeData } = useSuspenseQuery(exchangeRateQueryOptions());

  const exchangeRate = exchangeData.exchangeRate[currency];

  const productQueries = useQueries({
    queries: productIds.recommendProductIds.map((id: number) => productInfoQueryOptions(id)),
  });

  const isLoading = productQueries.some(query => query.isLoading);
  const products = productQueries.map(query => query.data).filter(data => !!data);

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
                {formatPrice(product.price * exchangeRate, currency)}
              </RecommendationProductItem.Price>
            </RecommendationProductItem.Root>
          ))}
        </HStack>
      )}
    </styled.section>
  );
}

export default RecommendationSection;
