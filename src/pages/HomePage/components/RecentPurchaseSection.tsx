import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { getRecentProducts } from '@/apis/product';
import { useEffect, useState } from 'react';
import { type Product } from '@/apis/types';
import { formatPriceWithExchange } from '@/utils/price';

interface Props {
  product: Product;
  formatPrice: (price: number, exchangeRate: number) => string;
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
        <Text variant="H1_Bold">{formatPrice(product.price, 1)}</Text>
      </Flex>
    </Flex>
  );
};

function RecentPurchaseSection({ currency, exchangeRate }: { currency: string; exchangeRate: number }) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  const priceToShow = (price: number, rate: number) => {
    return formatPriceWithExchange(price, currency, rate);
  };

  useEffect(() => {
    getRecentProducts()
      .then(res => {
        setRecentProducts(res.recentProducts);
      })
      .catch(() => {
        // TODO: 에러처리
      });
  }, []);

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />
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
        {recentProducts?.map(product => (
          <RecentProduct key={product.id} product={product} formatPrice={price => priceToShow(price, exchangeRate)} />
        ))}
      </Flex>
    </styled.section>
  );
}

export default RecentPurchaseSection;
