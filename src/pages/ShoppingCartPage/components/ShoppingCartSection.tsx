import { Button, Counter, Spacing, Text } from '@/ui-lib';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ShoppingCartItem from './ShoppingCartItem';
import { type CartItem } from '@/atoms/cart';
import { useAtomValue } from 'jotai';
import { currencyAtom } from '@/atoms/currency';
import { formatPrice } from '@/utils/price';
import { useSuspenseQuery } from '@tanstack/react-query';
import { exchangeRateQueryOptions } from '@/apis/exchange';

function CartItem({
  cartItem,
  setCartItems,
}: {
  cartItem: CartItem;
  setCartItems: (update: (prev: Record<number, CartItem>) => Record<number, CartItem>) => void;
}) {
  const currency = useAtomValue(currencyAtom);

  const { data: exchangeData } = useSuspenseQuery(exchangeRateQueryOptions());

  const exchangeRate = exchangeData.exchangeRate[currency];
  const formattedPrice = formatPrice(cartItem.product.price * exchangeRate, currency);

  const handleMinus = () => {
    const newQuantity = Math.max(0, cartItem.quantity - 1);
    if (newQuantity === 0) {
      setCartItems(prev => {
        const newItems = { ...prev };
        delete newItems[cartItem.product.id];
        return newItems;
      });
    } else {
      setCartItems(prev => ({
        ...prev,
        [cartItem.product.id]: {
          product: cartItem.product,
          quantity: newQuantity,
        },
      }));
    }
  };

  const handlePlus = () => {
    const newQuantity = Math.min(cartItem.product.stock, cartItem.quantity + 1);
    setCartItems(prev => ({
      ...prev,
      [cartItem.product.id]: {
        product: cartItem.product,
        quantity: newQuantity,
      },
    }));
  };

  const handleDelete = () => {
    setCartItems(prev => {
      const newItems = { ...prev };
      delete newItems[cartItem.product.id];
      return newItems;
    });
  };

  return (
    <ShoppingCartItem.Root>
      <ShoppingCartItem.Image src={cartItem.product.images[0]} alt={cartItem.product.name} />
      <ShoppingCartItem.Content>
        <ShoppingCartItem.Info
          type={cartItem.product.category.toLowerCase() as any}
          title={cartItem.product.name}
          description={cartItem.product.description}
          onDelete={handleDelete}
        />
        <ShoppingCartItem.Footer>
          <ShoppingCartItem.Price>{formattedPrice}</ShoppingCartItem.Price>
          <Counter.Root>
            <Counter.Minus onClick={handleMinus} />
            <Counter.Display value={cartItem.quantity} />
            <Counter.Plus onClick={handlePlus} disabled={cartItem.quantity >= cartItem.product.stock} />
          </Counter.Root>
        </ShoppingCartItem.Footer>
      </ShoppingCartItem.Content>
    </ShoppingCartItem.Root>
  );
}

function ShoppingCartSection({
  cartItems,
  setCartItems,
}: {
  cartItems: Record<number, CartItem>;
  setCartItems: (update: (prev: Record<number, CartItem>) => Record<number, CartItem>) => void;
}) {
  const handleClearAll = () => {
    setCartItems(() => ({}));
  };

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm" onClick={handleClearAll}>
          전체삭제
        </Button>
      </Flex>
      <Spacing size={4} />
      <Stack
        gap={5}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        {Object.entries(cartItems).map(([productId, cartItem]) => (
          <CartItem key={productId} cartItem={cartItem} setCartItems={setCartItems} />
        ))}
      </Stack>
    </styled.section>
  );
}

export default ShoppingCartSection;
