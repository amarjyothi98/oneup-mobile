import React from 'react';
import { Text } from 'react-native';

const CurrencyFormatter = ({ amount, style }: any) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return <Text style={style}>{formattedAmount}</Text>;
};

export default CurrencyFormatter;
