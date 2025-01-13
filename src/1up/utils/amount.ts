export const extractAmount = (moneyStr: string) => {
  let amount = parseFloat(moneyStr).toFixed(2);
  return '$' + amount;
};

export const formatAmount = (amount: number): string =>
  `${amount < 0 ? '-' : amount > 0 ? '+' : ''}$${Math.abs(amount).toFixed(2)}`;
