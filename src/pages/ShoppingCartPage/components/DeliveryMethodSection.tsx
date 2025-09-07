import { Flex, Stack, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserInfo, getGradeShippingList } from '@/apis/userInfo';
import { useAtomValue } from 'jotai';
import { cartItemsAtom } from '@/atoms/cart';
import { currencyAtom } from '@/atoms/currency';
import { formatPrice } from '@/utils/price';
import { getExchangeRate } from '@/apis/exchange';

function DeliveryMethodSection({
  selectedDeliveryMethod,
  onDeliveryMethodChange,
  onShippingFeeChange,
}: {
  selectedDeliveryMethod: string;
  onDeliveryMethodChange: (method: string) => void;
  onShippingFeeChange: (fee: number) => void;
}) {
  const { data: userInfo } = useSuspenseQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });

  const { data: gradeShippingData } = useSuspenseQuery({
    queryKey: ['gradeShipping'],
    queryFn: getGradeShippingList,
  });
  const cartItems = useAtomValue(cartItemsAtom);
  const currency = useAtomValue(currencyAtom);

  const { data: exchangeData } = useSuspenseQuery({
    queryKey: ['exchangeRate'],
    queryFn: getExchangeRate,
    staleTime: 30 * 60 * 1000,
  });

  const exchangeRate = exchangeData.exchangeRate[currency];

  const totalCartAmount = Object.values(cartItems).reduce((sum, item) => {
    const itemPrice = item.product.price * item.quantity;
    return sum + itemPrice;
  }, 0);

  const userGrade = userInfo?.grade || 'EXPLORER';
  const gradeShippingPolicy = gradeShippingData?.gradeShippingList.find(policy => policy.type === userGrade);

  const calculateShippingFee = () => {
    if (!gradeShippingPolicy) return 0;

    const freeShippingThresholdUSD = gradeShippingPolicy.freeShippingThreshold;

    if (totalCartAmount >= freeShippingThresholdUSD) {
      return 0;
    }
    return gradeShippingPolicy.shippingFee;
  };

  const expressFee = 0;
  const premiumFee = calculateShippingFee();

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
  const formattedPrice = formatPrice(price * exchangeRate, currency);

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
