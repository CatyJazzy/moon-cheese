import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { cartItemsAtom } from '@/atoms/cart';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import ShoppingCartSection from './components/ShoppingCartSection';
import EmptyCartSection from './components/EmptyCartSection';

function ShoppingCartPage() {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string>('Express');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const cartItems = useAtomValue(cartItemsAtom);

  if (Object.keys(cartItems).length === 0) {
    return <EmptyCartSection />;
  }

  return (
    <>
      <ShoppingCartSection />
      <DeliveryMethodSection
        selectedDeliveryMethod={selectedDeliveryMethod}
        onDeliveryMethodChange={setSelectedDeliveryMethod}
        onShippingFeeChange={setShippingFee}
      />
      <CheckoutSection cartItems={cartItems} shippingFee={shippingFee} />
    </>
  );
}

export default ShoppingCartPage;
