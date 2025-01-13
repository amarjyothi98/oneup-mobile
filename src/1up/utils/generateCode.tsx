export const generateAiCodeAndTicker = (data: Array<string>) => {
  let fixed = ['Large Cap', 'Hedge Fund'];
  data = data.concat(fixed);
  let code = '00000000000000000000000';

  const optionsMap: any = {
    'Small & Mid Cap': 0,
    'Large Cap': 1,
    Value: 2,
    Dividend: 3,
    Momentum: 4,
    Growth: 5,
    Core: 6,
    Concentrated: 7,
    Balanced: 8,
    Diversified: 9,
    'CO2 Footprint': 10,
    'Human Rights': 11,
    'Gender Equality': 12,
    'Fair Pay': 13,
    'No Pesticides': 14,
    'No Nuclear': 15,
    'No Fossil Fuel': 16,
    'No Tobacco': 17,
    'No Alcohol': 18,
    'No Animal Testing': 19,
    'No Weapons': 20,
    'Hedge Fund': 21,
    'Mutual Fund': 22,
  };

  let codeArray = code.split('');

  data.forEach(item => {
    if (optionsMap.hasOwnProperty(item)) {
      codeArray[optionsMap[item]] = '1';
    }
  });

  code = codeArray.join('');
  const ticker = `AI${data
    .filter(item =>
      ['Value', 'Dividend', 'Momentum', 'Growth', 'Core'].includes(item),
    )
    .map(item => item.slice(0, 2).toUpperCase())
    .join('')}L`;

  return {code, ticker};
};
