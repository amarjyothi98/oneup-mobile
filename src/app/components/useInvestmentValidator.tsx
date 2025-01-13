const useInvestmentValidator = () => {
  const validate = (
    value?: string,
    maxAmount?: number,
    mode?: string,
    brokerName?: 'Webull' | string
  ): { success: boolean; error?: string } => {
    const minInvestment = brokerName === 'Webull' ? 250 : 100;

    if (!value) {
      return { success: false, error: 'Please enter investment amount' };
    }
    if (!maxAmount) {
      return { success: false, error: 'Failed to get max available amount' };
    }
    if (parseFloat(value) && maxAmount < parseFloat(value)) {
      return {
        success: false,
        error: 'Investment amount cannot be more than the max available amount',
      };
    }
    if (parseFloat(value) < minInvestment && mode !== 'Withdraw') {
      return {
        success: false,
        error: `Investment amount cannot be less than $${minInvestment}`,
      };
    }
    if (
      maxAmount - parseFloat(value) < minInvestment &&
      mode === 'Withdraw'
    ) {
      return {
        success: false,
        error: `Cannot keep strategy worth less than $${minInvestment}, liquidate the entire position instead.`,
      };
    }
    if (parseFloat(value) < minInvestment && mode === 'Withdraw') {
      return {
        success: false,
        error: `Cannot sell less than $${minInvestment} worth of shares, liquidate the entire position instead.`,
      };
    }
    // if (localStorage.getItem('isDeploymentPending') === 'true') {
    //   return {
    //     success: false,
    //     error: 'Existing strategy deployment is in progress, please try again later.',
    //   };
    // }

    return { success: true };
  };

  return { validate };
};

export default useInvestmentValidator;
