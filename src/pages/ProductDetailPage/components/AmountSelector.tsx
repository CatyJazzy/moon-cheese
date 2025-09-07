import { Counter, Text } from '@/ui-lib';
import { Divider, Flex } from 'styled-system/jsx';

type Props = {
  isActive: boolean;
  stock: number;
  amount: number;
  onAmountChange: (amount: number) => void;
};

function AmountSelector({ isActive, stock, amount, onAmountChange }: Props) {
  const handleMinus = () => {
    if (amount > 0) {
      onAmountChange(amount - 1);
    }
  };

  const handlePlus = () => {
    if (amount < stock) {
      onAmountChange(amount + 1);
    }
  };

  const canMinus = isActive ? amount > 0 : false;
  const canPlus = isActive ? amount < stock : false;

  return (
    <Flex justify="space-between" alignItems="center">
      <Flex alignItems="center" gap={2}>
        <Text variant="C1_Medium">재고</Text>
        <Divider orientation="vertical" color="border.01_gray" h={4} />
        <Text variant="C1_Medium" color="secondary.02_orange">
          {stock}EA
        </Text>
      </Flex>
      <Counter.Root>
        <Counter.Minus onClick={handleMinus} disabled={!canMinus} />
        <Counter.Display value={amount} />
        <Counter.Plus onClick={handlePlus} disabled={!canPlus} />
      </Counter.Root>
    </Flex>
  );
}

export default AmountSelector;
