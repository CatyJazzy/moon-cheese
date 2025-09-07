import { Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { productListQueryOptions, queryKeys as productQueryKeys } from '@/apis/product';
import { exchangeRateQueryOptions } from '@/apis/exchange';
import { groupBy } from 'es-toolkit';
import type { Product, ProductCategory } from '@/apis/types';
import { formatPrice } from '@/utils/price';
import { useAtom } from 'jotai';
import { cartItemsAtom } from '@/atoms/cart';
import { type CurrencyType } from '@/atoms/currency';
import DataWrapper from '@/components/DataWrapper';

type ProductCategoryOptions = ProductCategory | 'ALL';

interface AddCounterProps {
  onMinus: () => void;
  onPlus: () => void;
  stock: number;
  amount: number;
}

function AddCounter({ onMinus, onPlus, stock, amount }: AddCounterProps) {
  const isMaxAmount = amount >= stock;

  return (
    <Counter.Root>
      <Counter.Minus onClick={onMinus} disabled={amount === 0} />
      <Counter.Display value={amount} />
      <Counter.Plus onClick={onPlus} disabled={isMaxAmount} />
    </Counter.Root>
  );
}

interface Props {
  product: Product;
  onClick: () => void;
  formatPrice: (price: number) => string;
}

function Product({ product, onClick, formatPrice }: Props) {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const currentAmount = cartItems[product.id]?.quantity || 0;

  const handleMinus = () => {
    const newQuantity = Math.max(0, currentAmount - 1);
    if (newQuantity === 0) {
      setCartItems(prev => {
        const newItems = { ...prev };
        delete newItems[product.id];
        return newItems;
      });
    } else {
      setCartItems(prev => ({
        ...prev,
        [product.id]: {
          product,
          quantity: newQuantity,
        },
      }));
    }
  };

  const handlePlus = () => {
    const newQuantity = Math.min(product.stock, currentAmount + 1);
    setCartItems(prev => ({
      ...prev,
      [product.id]: {
        product,
        quantity: newQuantity,
      },
    }));
  };

  //TODO: FreeTag 더 좋은 방식으로 분기처리
  return (
    <ProductItem.Root onClick={onClick}>
      <ProductItem.Image src={product.images[0]} alt={product.name} />
      <ProductItem.Info title={product.name} description={product.description} />
      <ProductItem.Meta>
        <ProductItem.MetaLeft>
          <ProductItem.Rating rating={product.rating} />
          <ProductItem.Price>{formatPrice(product.price)}</ProductItem.Price>
        </ProductItem.MetaLeft>
        {product.category === 'CRACKER' && 'isGlutenFree' in product && product.isGlutenFree && (
          <ProductItem.FreeTag type={'gluten'} />
        )}
        {product.category === 'TEA' && 'isCaffeineFree' in product && product.isCaffeineFree && (
          <ProductItem.FreeTag type={'caffeine'} />
        )}
      </ProductItem.Meta>
      <AddCounter amount={currentAmount} stock={product.stock} onMinus={handleMinus} onPlus={handlePlus} />
    </ProductItem.Root>
  );
}

function ProductListSection({ currency }: { currency: CurrencyType }) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: productQueryKeys.productList() });
  };

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <DataWrapper loadingGuide="상품을 불러오는 중이에요" onRetry={handleRetry}>
        <ProductListContents currency={currency} />
      </DataWrapper>
    </styled.section>
  );
}

function ProductListContents({ currency }: { currency: CurrencyType }) {
  const [currentTab, setCurrentTab] = useState<ProductCategoryOptions>('ALL');
  const navigate = useNavigate();

  const { data: exchangeData } = useSuspenseQuery(exchangeRateQueryOptions());

  const exchangeRate = exchangeData.exchangeRate[currency];

  const priceToShow = (price: number) => {
    return formatPrice(price * exchangeRate, currency);
  };

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const { data } = useSuspenseQuery(productListQueryOptions());

  const productList = data.products;
  const productListByCategory = {
    ...groupBy(productList, product => product.category),
    ALL: productList,
  };

  return (
    <>
      <SubGNB.Root value={currentTab} onValueChange={details => setCurrentTab(details.value as ProductCategoryOptions)}>
        <SubGNB.List>
          <SubGNB.Trigger value="ALL">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="CHEESE">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="CRACKER">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="TEA">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        {productListByCategory[currentTab].map((product: Product) => (
          <Product
            key={product.id}
            product={product}
            onClick={() => handleClickProduct(product.id)}
            formatPrice={priceToShow}
          />
        ))}
      </Grid>
    </>
  );
}

export default ProductListSection;
