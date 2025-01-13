import React from 'react';
import Toast from 'react-native-toast-message';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CombinedDefaultTheme, themes} from './src/1up/theme/theme';
import {Icon, PaperProvider} from 'react-native-paper';
import {SignUpScreen} from './src/app/pages/Authentications/Signup';
import {SignInScreen} from './src/app/pages/Authentications/Signin';
import {ForgotPasswordScreen} from './src/app/pages/Authentications/forgetPassword';
import {TabsNavigation} from './src/app/components/TabNavigation';
import {LegalDocumentsWebview} from './src/app/pages/Account/legalDocumentsWebview';
import {ThematicSearchScreen} from './src/app/pages/ThematicSearch';
import {SuccessSubOrPass} from './src/app/pages/Authentications/SuccessPage';
import {InvestmentThemeScreen} from './src/app/pages/InvestmentTheme';
import {Loader} from './src/app/components/Loader';
import {ProfileDetails} from './src/app/pages/Profile/profile';
import {Notification} from './src/app/pages/Notifications';
import {AccountDetails} from './src/app/pages/Profile/accountDetails';
import {ChangePassword} from './src/app/pages/Profile/changePassword';
import {
  LegalDocumentsWebViewProps,
  OrderHistoryDetailsProps,
  ForgetPasswordConfirmProps,
  BrokerageAccountDetailProps,
  StategySelectionLoaderProps,
  PortfolioDetailScreenProps,
} from './src/app/types/types';
import {StrategySelection} from './src/app/pages/StrategySelection';
import {DataContextProvider} from './src/1up/provider/data';
import {FrequentlyAskedQuestions} from './src/app/pages/Profile/frequentlyAskedQuestions';
import {AccountMainPage} from './src/app/pages/Account/accountMainPage';
import {LegalDocuments} from './src/app/pages/Account/legalDocuments';
import {InvestWithdrawLiquidate} from './src/app/pages/InvestWithdrawLiquidate';
import {CustomerSupport} from './src/app/pages/Profile/customerSupport';
import {ForgotPasswordConfirm} from './src/app/pages/Authentications/forgetPasswordConfirm';
import {ForgotPasswordOtpScreen} from './src/app/pages/Authentications/forgetPasswordOtpPage';
import {ForgetPasswordSuccess} from './src/app/pages/Authentications/forgetPasswordSuccess';
import {SubscriptionScreen} from './src/app/pages/Subscriptions';
import {OrderHistory} from './src/app/pages/Account/orderHistory';
import {OrderHistoryDetails} from './src/app/pages/Account/orderHistoryDetails';
import {BrokerageHub} from './src/app/pages/Account/brokerageHub';
import {BrokerageAccountDetails} from './src/app/pages/Account/brokerageAccountDetails';
import LinearGradient from 'react-native-linear-gradient';
import {PortfolioDetailScreen} from './src/app/pages/PortfolioDetails';
import LoadingAnimation from './src/app/components/SelectionLoaderAnimation';
import {AutomateStrategy} from './src/app/pages/AutomateStrategy';
import ConnectYourAccounts from './src/app/pages/Account/ConnectYourAccounts';

const toastConfig = {
  successToast: ({text1}: any) => (
    <View
      style={[
        styles.successToast,
        {backgroundColor: themes.colors.toastGreen},
      ]}>
      <Icon source={'check-circle'} size={24} color={themes.colors.white} />
      <Text style={styles.successText1}>{text1}</Text>
      <Icon source="close" size={24} color={themes.colors.white} />
    </View>
  ),

  errorToast: ({text1}: any) => (
    <View
      style={[styles.successToast, {backgroundColor: themes.colors.fireOpal}]}>
      <Icon source={'alert-circle'} size={24} color={themes.colors.white} />
      <Text style={styles.successText1}>{text1}</Text>
      <Icon source="close" size={24} color={themes.colors.white} />
    </View>
  ),
};

const {width} = Dimensions.get('window');

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Signup: undefined;
  Signin: undefined;
  ForgetPassword: undefined;
  SuccessPage: undefined;
  HomeTabs: undefined;
  LegalDocumentsWebview: LegalDocumentsWebViewProps;
  ThematicSearch: undefined;
  InvestmentThemeScreen: {
    userMessage: string;
  };
  ChangePassword: undefined;
  LoderScreen: undefined;
  ProfileDetails: undefined;
  Notification: undefined;
  AccountDetails: undefined;
  StrategySelection: undefined;
  FrequentlyAskedQuestions: undefined;
  CustomerSupport: undefined;
  AccountMainPage: undefined;
  LegalDocuments: undefined;
  InvestWithdrawLiquidate: any;
  ForgotPasswordConfirm: ForgetPasswordConfirmProps;
  ForgotPasswordOtpScreen: ForgetPasswordConfirmProps;
  ForgetPasswordVerified: undefined;
  ForgetPasswordSuccess: undefined;
  SubscriptionScreen: undefined;
  OrderHistory: undefined;
  OrderHistoryDetails: OrderHistoryDetailsProps;
  BrokerageHub: undefined;
  BrokerageAccountDetails: BrokerageAccountDetailProps;
  PortfolioDetailScreen: PortfolioDetailScreenProps;
  StrategySelectionLoader: StategySelectionLoaderProps;
  AutomateStrategy: any;
  ConnectYourAccounts: undefined;
};

export type GlobalNavigationProp = StackNavigationProp<RootStackParamList>;

const App = () => {
  return (
    <Stack.Navigator initialRouteName={'Signin'}>
      {/* For Signup page */}
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Signin page */}
      <Stack.Screen
        name="Signin"
        component={SignInScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For HomeTabs */}
      <Stack.Screen
        name="HomeTabs"
        component={TabsNavigation}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Forget Password page */}
      <Stack.Screen
        name="ForgetPassword"
        component={ForgotPasswordScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Forget Password confirm page */}
      <Stack.Screen
        name="ForgotPasswordConfirm"
        component={ForgotPasswordConfirm}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Forget Password otp confirm page */}
      <Stack.Screen
        name="ForgotPasswordOtpScreen"
        component={ForgotPasswordOtpScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Forget Password succes chnage */}
      <Stack.Screen
        name="ForgetPasswordSuccess"
        component={ForgetPasswordSuccess}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Legal Docs page */}
      <Stack.Screen
        name="LegalDocuments"
        component={LegalDocuments}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Legal Docs Webview page */}
      <Stack.Screen
        name="LegalDocumentsWebview"
        component={LegalDocumentsWebview}
        options={{
          animation: 'fade_from_bottom',
          presentation: 'modal',
          headerShown: false,
        }}
      />

      {/* For Forget Password Success page */}
      <Stack.Screen
        name="SuccessPage"
        component={SuccessSubOrPass}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Thematic Search */}
      <Stack.Screen
        name="ThematicSearch"
        component={ThematicSearchScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Thematic LLM Search */}
      <Stack.Screen
        name="InvestmentThemeScreen"
        component={InvestmentThemeScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Thematic LLM Search */}
      <Stack.Screen
        name="LoderScreen"
        component={Loader}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For my profile */}
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For notifications */}
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For account Details inside my profie page */}
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetails}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Subscription pageinside my profie page */}
      <Stack.Screen
        name="SubscriptionScreen"
        component={SubscriptionScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For account Details inside my profie page */}
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For account order history */}
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For account order history details*/}
      <Stack.Screen
        name="OrderHistoryDetails"
        component={OrderHistoryDetails}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Brokera*/}
      <Stack.Screen
        name="BrokerageHub"
        component={BrokerageHub}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Brokerage account details*/}
      <Stack.Screen
        name="BrokerageAccountDetails"
        component={BrokerageAccountDetails}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Strategy Selection page */}
      <Stack.Screen
        name="StrategySelection"
        component={StrategySelection}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Strategy Selection Loader */}
      <Stack.Screen
        name="StrategySelectionLoader"
        component={LoadingAnimation}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For PortfolioDetailScreen page */}
      <Stack.Screen
        name="PortfolioDetailScreen"
        component={PortfolioDetailScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Automate Strategy */}
      <Stack.Screen
        name="AutomateStrategy"
        component={AutomateStrategy}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Frequently Asked Questions page */}
      <Stack.Screen
        name="FrequentlyAskedQuestions"
        component={FrequentlyAskedQuestions}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Customer Support page */}
      <Stack.Screen
        name="CustomerSupport"
        component={CustomerSupport}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Customer Support page */}
      <Stack.Screen
        name="AccountMainPage"
        component={AccountMainPage}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* For Invest Withdraw and Liquidate Strategy page */}
      <Stack.Screen
        name="InvestWithdrawLiquidate"
        component={InvestWithdrawLiquidate}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />

      {/* Connect Your Accounts / Broker Connection */}
      <Stack.Screen
        name="ConnectYourAccounts"
        component={ConnectYourAccounts}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />
    </Stack.Navigator>
  );
};

const AppWrapper = () => {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      {/* Gradient View for Status Bar */}
      <LinearGradient
        colors={['#4253F0', '#2A1452', '#111928']}
        locations={[0.0164, 0.2446, 0.3717]}
        start={{x: 0.7, y: 0}}
        end={{x: 0.4, y: 0.8}}
      />
      {/* StatusBar Configuration */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaProvider>
        <PaperProvider theme={CombinedDefaultTheme}>
          <NavigationContainer
            ref={navigationRef}
            theme={CombinedDefaultTheme}
            onReady={() => {
              SplashScreen.hide();
            }}>
            <DataContextProvider>
              <App />
            </DataContextProvider>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
  successToast: {
    width: width * 0.87,
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
  },
  successText1: {
    width: width * 0.62,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
  },
});

export default AppWrapper;
