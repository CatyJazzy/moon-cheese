import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { getRecentProducts } from '@/apis/product';
import { type RecentProduct } from '@/apis/types';
import { formatPriceWithExchange } from '@/utils/price';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import DataWrapper from '@/components/DataWrapper';

interface Props {
  product: RecentProduct;
  formatPrice: (price: number) => string;
}

const RecentProduct = ({ product, formatPrice }: Props) => {
  return (
    <Flex
      css={{
        gap: 4,
      }}
    >
      <styled.img
        // TODO: 기본 썸네일 이미지 세팅
        src={product.thumbnail || ''}
        alt={product.name}
        css={{
          w: '60px',
          h: '60px',
          objectFit: 'cover',
          rounded: 'xl',
        }}
      />
      <Flex flexDir="column" gap={1}>
        <Text variant="B2_Medium">{product.name}</Text>
        <Text variant="H1_Bold">{formatPrice(product.price)}</Text>
      </Flex>
    </Flex>
  );
};

function RecentPurchaseSection({ currency, exchangeRate }: { currency: string; exchangeRate: number }) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['recentProducts'] });
  };

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>
      <Spacing size={4} />
      <DataWrapper loadingGuide="최근 구매 내역을 불러오는 중이에요" onRetry={handleRetry}>
        <RecentPurchaseContents currency={currency} exchangeRate={exchangeRate} />
      </DataWrapper>
    </styled.section>
  );
}

function RecentPurchaseContents({ currency, exchangeRate }: { currency: string; exchangeRate: number }) {
  const priceToShow = (price: number, rate: number) => {
    return formatPriceWithExchange(price, currency, rate);
  };

  const { data } = useSuspenseQuery({
    queryKey: ['recentProducts'],
    queryFn: getRecentProducts,
  });

  const recentProducts = data.recentProducts;

  return (
    <Flex
      css={{
        bg: 'background.01_white',
        px: 5,
        py: 4,
        gap: 4,
        rounded: '2xl',
      }}
      direction={'column'}
    >
      {recentProducts.length === 0 ? (
        <Text variant="B2_Regular" color="neutral.03_gray">
          최근 구매한 상품이 없습니다.
        </Text>
      ) : (
        recentProducts.map(product => (
          <RecentProduct key={product.id} product={product} formatPrice={price => priceToShow(price, exchangeRate)} />
        ))
      )}
    </Flex>
  );
}

export default RecentPurchaseSection;
