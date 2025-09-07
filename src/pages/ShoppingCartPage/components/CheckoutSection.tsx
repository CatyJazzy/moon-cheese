import { SECOND } from '@/constants/time';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { delay } from '@/utils/async';
import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { currencyAtom } from '@/atoms/currency';
import { formatPrice } from '@/utils/price';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys as userQueryKeys } from '@/apis/userInfo';
import { exchangeRateQueryOptions } from '@/apis/exchange';
import { purchaseProducts, type PurchaseRequest } from '@/apis/product';
import type { CartItem } from '@/atoms/cart';

function CheckoutSection({
  cartItems,
  shippingFee,
  selectedDeliveryMethod,
  setCartItems,
}: {
  cartItems: Record<number, CartItem>;
  shippingFee: number;
  selectedDeliveryMethod: string;
  setCartItems: (update: (prev: Record<number, CartItem>) => Record<number, CartItem>) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currency = useAtomValue(currencyAtom);

  const { data: exchangeData } = useSuspenseQuery(exchangeRateQueryOptions());

  const exchangeRate = exchangeData.exchangeRate[currency];

  // 총 주문개수 계산
  const totalQuantity = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);

  // 총 주문금액 계산 (달러 기준)
  const totalOrderAmount = Object.values(cartItems).reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const totalAmount = totalOrderAmount + shippingFee;

  const purchaseMutation = useMutation({
    mutationFn: purchaseProducts,
    onSuccess: async () => {
      setCartItems(() => ({}));

      // 사용자 정보 최신화 (포인트/등급)
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.userInfo() });

      toast.success('결제가 완료되었습니다.');
      await delay(SECOND * 3);
      navigate('/');
    },
    onError: error => {
      console.error('결제 실패:', error);
      toast.error('결제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const onClickPurchase = () => {
    const deliveryType = selectedDeliveryMethod === 'Express' ? 'EXPRESS' : 'PREMIUM';

    const purchaseData: PurchaseRequest = {
      deliveryType: deliveryType as 'EXPRESS' | 'PREMIUM',
      totalPrice: totalAmount,
      items: Object.values(cartItems).map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    purchaseMutation.mutate(purchaseData);
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
              <Text variant="B2_Bold">{formatPrice(totalOrderAmount * exchangeRate, currency)}</Text>
            </Flex>
            <Spacing size={3} />
            <Flex justify="space-between">
              <Text variant="B2_Regular">배송비</Text>
              <Text variant="B2_Bold" color={shippingFee === 0 ? 'state.green' : undefined}>
                {shippingFee === 0 ? '무료배송' : formatPrice(shippingFee * exchangeRate, currency)}
              </Text>
            </Flex>
          </Box>

          <Divider color="border.01_gray" />

          <HStack justify="space-between">
            <Text variant="H2_Bold">총 금액</Text>
            <Text variant="H2_Bold">{formatPrice(totalAmount * exchangeRate, currency)}</Text>
          </HStack>
        </Stack>

        <Button fullWidth size="lg" loading={purchaseMutation.isPending} onClick={onClickPurchase}>
          {purchaseMutation.isPending ? '결제 중...' : '결제 진행'}
        </Button>

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

export default CheckoutSection;
