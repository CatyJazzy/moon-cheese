import { useState } from 'react';
import { Flex, Stack, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo, getGradeShippingList } from '@/apis/userInfo';
import { useAtomValue } from 'jotai';
import { cartItemsAtom } from '@/atoms/cart';
import { useContext } from 'react';
import { CurrencyContext } from '@/context/currencyContext';
import { getExchangeRate } from '@/apis/exchange';
import { formatPriceWithExchange } from '@/utils/price';

function DeliveryMethodSection({
  selectedDeliveryMethod,
  onDeliveryMethodChange,
  onShippingFeeChange,
}: {
  selectedDeliveryMethod: string;
  onDeliveryMethodChange: (method: string) => void;
  onShippingFeeChange: (fee: number) => void;
}) {
  // 사용자 등급 정보 (기존에 home에서 불러왔던 거 재사용함)
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });

  const { data: gradeShippingData } = useQuery({
    queryKey: ['gradeShipping'],
    queryFn: getGradeShippingList,
  });
  const cartItems = useAtomValue(cartItemsAtom);
  const { currency } = useContext(CurrencyContext);
  const { data: exchangeData } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
  });

  const exchangeRate = exchangeData ? exchangeData.exchangeRate.KRW / exchangeData.exchangeRate.USD : 1;

  const totalCartAmount = Object.values(cartItems).reduce((sum, item) => {
    const itemPrice = item.product.price * item.quantity;
    return sum + itemPrice;
  }, 0);

  const userGrade = userInfo?.grade || 'EXPLORER';
  const gradeShippingPolicy = gradeShippingData?.gradeShippingList.find(policy => policy.type === userGrade);

  const calculateShippingFee = (baseFee: number) => {
    if (!gradeShippingPolicy) return baseFee;

    const freeShippingThresholdUSD = gradeShippingPolicy.freeShippingThreshold;

    if (totalCartAmount >= freeShippingThresholdUSD) {
      return 0;
    }
    return gradeShippingPolicy.shippingFee + baseFee;
  };

  const expressFee = 0;
  const premiumFee = calculateShippingFee(5);

  const currentShippingFee = selectedDeliveryMethod === 'Express' ? expressFee : premiumFee;
  onShippingFeeChange(currentShippingFee);

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>

      <Spacing size={4} />

      <Stack gap={4}>
        <DeliveryItem
          title="Express"
          description="3-5일 후 도착 예정"
          icon={<DeliveryIcon size={28} />}
          price={expressFee}
          isSelected={selectedDeliveryMethod === 'Express'}
          onClick={() => onDeliveryMethodChange('Express')}
          currency={currency}
          exchangeRate={exchangeRate}
        />
        <DeliveryItem
          title="Premium"
          description="당일 배송"
          icon={<RocketIcon size={28} />}
          price={premiumFee}
          isSelected={selectedDeliveryMethod === 'Premium'}
          onClick={() => onDeliveryMethodChange('Premium')}
          currency={currency}
          exchangeRate={exchangeRate}
        />
      </Stack>
    </styled.section>
  );
}

function DeliveryItem({
  title,
  description,
  icon,
  price,
  isSelected,
  onClick,
  currency,
  exchangeRate,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  isSelected: boolean;
  onClick: () => void;
  currency: string;
  exchangeRate: number;
}) {
  const formattedPrice = formatPriceWithExchange(price, currency, exchangeRate);

  return (
    <Flex
      gap={3}
      css={{
        alignItems: 'center',
        p: 5,
        py: 4,
        bgColor: isSelected ? 'primary.01_primary' : 'background.02_light-gray',
        transition: 'background-color 0.3s ease',
        rounded: '2xl',
        color: isSelected ? 'neutral.05_white' : 'neutral.01_black',
        cursor: 'pointer',
      }}
      role="button"
      onClick={onClick}
    >
      {icon}

      <Flex flexDir="column" gap={1} flex={1}>
        <Text variant="B2_Regular" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
          {title}
        </Text>
        <Text variant="C2_Medium" color={isSelected ? 'neutral.05_white' : 'neutral.02_gray'}>
          {description}
        </Text>
      </Flex>
      <Text variant="B2_Medium" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
        {price === 0 ? '무료' : formattedPrice}
      </Text>
    </Flex>
  );
}

export default DeliveryMethodSection;
