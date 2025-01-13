/* eslint-disable quotes */
export const faqData = [
  {
    question: 'How do I get started?',
    answer:
      'Click Sign Up and create an account in under 60 seconds. Connect your existing brokerage account. You can invest now in an existing strategy or create your own.',
  },
  {
    question: 'What fees does OneUp charge?',
    answer:
      'See our pricing page for details. We do not charge management fees nor trading fees!',
  },
  {
    question: 'When will OneUp start making trades for me?',
    answer: `• If you set up OneUp outside of market hours, the trades will not go through until next market open at 9:30 am EST.
  
  • If you set up OneUp within market hours (9:30 am EST to 4 pm EST) and have not seen any trades go through please note that the trades can be delayed up to 15 minutes.
  
  • If the trades have not been placed with your brokerage within 15 minutes, please reach out to us at support@oneupinvest.com.`,
  },
  {
    question: 'Where does my money go after I invest with OneUp?',
    answer: `Your money never leaves your brokerage, that's the beauty of OneUp. We do not hold your money or your stocks. When you “invest” money to be used by OneUp, this only tells us how much of your money we are allowed to use towards trading stocks in your account. This money never leaves your brokerage, and no bank transfers take place.`,
  },
  {
    question: 'Can I track multiple strategies?',
    answer:
      'Yes! OneUp paid users are allowed to track multiple strategies as long as they have the buying power in their brokerage to do so. Basic members can also initiate one strategy - however no future trades will be placed besides the initial holdings.',
  },
  {
    question:
      'How does OneUp handle a strategy with the money already allocated to it, when the portfolio manager buy a new position?',
    answer:
      'We automatically balance your portfolio based on portfolio managers’ decisions. OneUp matches your portfolio proportionally to your strategy. If the portfolio manager buys into a new position, this will decrease their percentage stake of their current positions. To rebalance, OneUp will buy and sell proportionally to those positions.',
  },
  {
    question: 'How are your brokerage integrations built?',
    answer:
      'When you link your brokerage with us, we proxy your authentication to your brokerage, then use the authentication tokens to fetch the data necessary to set up your account with OneUp. We then maintain connection by using these tokens (hashed tokens) to fetch new tokens before they expire. We use bank-level security to store any and all data associated with your account. We work very similarly to Plaid. You may revoke our access to your account by following the prompts in your brokerage.',
  },
  {
    question: 'Does OneUp copy short trades or support crypto holdings?',
    answer:
      'No, OneUp does not copy any short positions and will not place any short position trades with your brokerage. OneUp also does not invest in crypto or options.',
  },
  {
    question: 'How does the trading occur in my broker?',
    answer: `We use your brokerage's API to place trades. When you connect your brokerage with us, we are given authentication tokens (no username or password) to make requests to your brokerage on your behalf. We use these tokens to buy and sell stocks according to your strategies.`,
  },
  {
    question: 'Does OneUp trade on margin if my brokerage account allows it?',
    answer: `No, we do not place margin trades even if your brokerage account allows it. OneUp will never trade on margin.`,
  },
  {
    question: 'Does OneUp automatically reinvest my profit?',
    answer: `Yes, we will automatically rebalance your portfolio based on the strategy's holdings and your buying power within your allocation and profits.`,
  },
  {
    question:
      'Does OneUp touch my other stocks in my brokerage account, expecially if they are the same ticker?',
    answer: `No, OneUp does not touch any of your current holdings. It will only sell shares bought by OneUp.`,
  },
];
