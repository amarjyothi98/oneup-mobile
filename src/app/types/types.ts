export interface LegalDocumentsWebViewProps {
  url: string;
  name: string;
}

export interface HoldingsRes {
  invested: number;
  current: number;
}

export interface ForgetPasswordConfirmProps {
  email: string;
  newPassword?: string;
}

export interface OrderHistoryDetailsProps {
  item: Array<any>;
}

export interface BrokerageAccountDetailProps {
  itemData: any;
}

export interface StategySelectionLoaderProps {
  code: string;
  ticker: string;
  data?: any;
  userMessage?: string;
  stocksData?: any;
  name?: string;
  inclusion?: any,
  exclusion?: any,
}

export interface PortfolioDetailScreenProps {
  code: string;
  ticker: string;
  strategyId: string;
  data?: any[];
  userMessage?: string;
  stocksData?: any;
  name?: string;
  inclusion?: any,
  exclusion?: any,
}

export interface PlansCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isYearly: boolean;
  onPress: any;
  isPurchased: boolean;
}

export interface Subscripiton {
  srNo: number;
  planName: string;
  billingDate: string;
  status: string;
}

export interface Strategy {
  strategyId: string;
  mutualFundName: string;
  morningStarRating: number | null;
  invested: number;
  current: number;
  code: string;
  details: StrategyDetails;
  accountDetails: AccountDetails;
  isAIpowered: number;
  status: string;
  message: string;
}

interface StrategyDetails {
  manager: string;
  ticker: string;
  yearlyPerformance: number;
  risk: string;
  style: string;
}

export interface InvestmentUserDetails {
  _id: string;
  userId: string;
  accountId: string;
  ticker: string;
  code: string;
  accountDetails: AccountDetails;
  status: string;
  amount: number;
  message: string;
  creationDate: string;
  __v: number;
  current: number;
  invested: number;
}

interface AccountDetails {
  id: string;
  authId: string;
  name: string;
  logo: string;
  balance: Balance;
  number: string;
  status: string;
  createdDate: string;
}

interface Balance {
  amount: number;
  currency: string;
}
