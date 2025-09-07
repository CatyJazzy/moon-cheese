export const calculatePrice = (price: number, currency: string, exchangeRate: number): number => {
  if (currency === 'USD') {
    return price;
  }

  return exchangeRate * price;
};

export const formatPrice = (price: number, currency: string): string => {
  if (currency === 'USD') {
    return '$' + price.toFixed(2);
  }

  const roundedPrice = Math.round(price);
  return roundedPrice.toLocaleString() + '원';
};

export const formatPriceWithExchange = (price: number, currency: string, exchangeRate: number): string => {
  const calculatedPrice = calculatePrice(price, currency, exchangeRate);
  return formatPrice(calculatedPrice, currency);
};
