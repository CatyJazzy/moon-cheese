import { cartItemsAtom } from '@/atoms/cart';
import { Button, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Box, Stack, styled } from 'styled-system/jsx';
import AmountSelector from './AmountSelector';

type ProductInfoSectionProps = {
  id: number;
  name: string;
  category: TagType;
  rating: number;
  price: string;
  quantity: number;
};

function ProductInfoSection({ id, name, category, rating, price, quantity }: ProductInfoSectionProps) {
  const [cartItems, _] = useAtom(cartItemsAtom);
  const [amount, setAmount] = useState<number>(0);

  const alreadyInCart = cartItems[id];

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={category} />
          <Text variant="B1_Bold">{name}</Text>
          <RatingGroup value={rating} readOnly label={`${rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{price}</Text>
      </Box>
      <Spacing size={5} />
      {/* 재고 및 수량 조절 */}
      <AmountSelector isActive={!alreadyInCart} stock={quantity} amount={amount} onAmountChange={setAmount} />
      <Spacing size={5} />
      {/* 장바구니 버튼 */}
      <Button fullWidth color="primary" size="lg">
        {alreadyInCart ? '장바구니에서 제거' : '장바구니 담기'}
      </Button>
    </styled.section>
  );
}

export default ProductInfoSection;
