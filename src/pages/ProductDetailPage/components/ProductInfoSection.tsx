import { cartItemsAtom, type CartItem } from '@/atoms/cart';
import { Button, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Box, Stack, styled } from 'styled-system/jsx';
import AmountSelector from './AmountSelector';
import type { Product } from '@/apis/types';

type ProductInfoSectionProps = {
  product: Product;
  formattedPrice: string;
};

function ProductInfoSection({ product, formattedPrice }: ProductInfoSectionProps) {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [amount, setAmount] = useState<number>(0);

  const alreadyInCart = cartItems[product.id];

  const updateItem = () => {
    setCartItems(prev => ({
      ...prev,
      [product.id]: {
        product,
        quantity: amount,
      },
    }));
  };

  const deleteItem = () => {
    setCartItems(prev => {
      const newItems = { ...prev };
      delete newItems[product.id];
      return newItems;
    });
  };

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={product.category.toLowerCase() as TagType} />
          <Text variant="B1_Bold">{product.name}</Text>
          <RatingGroup value={product.rating} readOnly label={`${product.rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{formattedPrice}</Text>
      </Box>
      <Spacing size={5} />
      {/* 재고 및 수량 조절 */}
      <AmountSelector isActive={!alreadyInCart} stock={product.stock} amount={amount} onAmountChange={setAmount} />
      <Spacing size={5} />
      {/* 장바구니 버튼 */}
      <Button fullWidth color="primary" size="lg" onClick={alreadyInCart ? deleteItem : updateItem}>
        {alreadyInCart ? '장바구니에서 제거' : '장바구니 담기'}
      </Button>
    </styled.section>
  );
}

export default ProductInfoSection;
