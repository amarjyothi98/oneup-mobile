export interface UserData {
  userData: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    clientCode: string;
    password: string;
    phoneNumber: {
      countryCode: string;
      prefix: string;
      value: string;
      verified: boolean;
      _id: string;
    };
    planDetails: {
      subId: string;
      planName: string;
    };
    gender: string;
    profileImage: string | null;
    agreementAcceptedAt: Date | null;
    tutorialWatched: boolean[];
    portfolioRequested: any[];
    freeTrialUsed: boolean;
    createdAt: Date;
    __v: number;
    current: number;
    invested: number;
    snaptrade: {
      hasIntegrated: boolean;
      secret: string;
      _id: string;
    };
    refreshToken: string;
  };
  isMarketOpen: boolean;
}
