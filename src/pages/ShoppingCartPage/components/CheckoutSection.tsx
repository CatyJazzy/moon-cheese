import { SECOND } from '@/constants/time';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { delay } from '@/utils/async';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { useQuery } from '@tanstack/react-query';
import { CurrencyContext } from '@/context/currencyContext';
import { getExchangeRate } from '@/apis/exchange';
import { formatPriceWithExchange } from '@/utils/price';
import type { CartItem } from '@/atoms/cart';

function CheckoutSection({ cartItems, shippingFee }: { cartItems: Record<number, CartItem>; shippingFee: number }) {
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { currency } = useContext(CurrencyContext);

  // TODO: 환율정보 관리해서 환산하는 로직 분리해야 함
  const { data: exchangeData } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
  });

  const exchangeRate = exchangeData ? exchangeData.exchangeRate.KRW / exchangeData.exchangeRate.USD : 1;

  // 총 주문개수 계산
  const totalQuantity = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);

  // 총 주문금액 계산 (달러 기준)
  const totalOrderAmount = Object.values(cartItems).reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const totalAmount = totalOrderAmount + shippingFee;

  const onClickPurchase = async () => {
    setIsPurchasing(true);
    await delay(SECOND * 1);
    setIsPurchasing(false);
    toast.success('결제가 완료되었습니다.');
    await delay(SECOND * 2);
    navigate('/');
  };

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">결제금액</Text>

      <Spacing size={4} />

      <Stack
        gap={6}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        <Stack gap={5}>
          <Box gap={3}>
            <Flex justify="space-between">
              <Text variant="B2_Regular">주문금액({totalQuantity}개)</Text>
              <Text variant="B2_Bold">{formatPriceWithExchange(totalOrderAmount, currency, exchangeRate)}</Text>
            </Flex>
            <Spacing size={3} />
            <Flex justify="space-between">
              <Text variant="B2_Regular">배송비</Text>
              <Text variant="B2_Bold" color={shippingFee === 0 ? 'state.green' : undefined}>
                {shippingFee === 0 ? '무료배송' : formatPriceWithExchange(shippingFee, currency, exchangeRate)}
              </Text>
            </Flex>
          </Box>

          <Divider color="border.01_gray" />

          <HStack justify="space-between">
            <Text variant="H2_Bold">총 금액</Text>
            <Text variant="H2_Bold">{formatPriceWithExchange(totalAmount, currency, exchangeRate)}</Text>
          </HStack>
        </Stack>

        <Button fullWidth size="lg" loading={isPurchasing} onClick={onClickPurchase}>
          {isPurchasing ? '결제 중...' : '결제 진행'}
        </Button>

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

export default CheckoutSection;
