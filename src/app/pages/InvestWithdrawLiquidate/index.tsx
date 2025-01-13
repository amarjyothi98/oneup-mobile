import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { themes } from '../../../1up/theme/theme';
import { HeaderComponent } from '../../components/header';
import LinearGradient from 'react-native-linear-gradient';
import { AxiosResponse } from 'axios';
import { authenticatedGet, authenticatedPost } from '../../../1up/utils/api';
import { useNavigation, useRoute } from '@react-navigation/core';
import BasicLoader from '../../components/BasicLoader';
import Toast from 'react-native-toast-message';
import CurrencyFormatter from '../../components/CurrencyFormatter';
import { GlobalNavigationProp } from '../../../../App';
import useInvestmentValidator from '../../components/useInvestmentValidator';
import { Loader } from '../../components/Loader';
import RNPickerSelect from 'react-native-picker-select';

const { width } = Dimensions.get('window');

export const InvestWithdrawLiquidate = () => {
  const [currency, setCurrency] = React.useState('USD');
  const [loading, setLoading] = useState({
    amountLoading: false,
    addMore: false,
    withdraw: false,
    deploy: false,
    profileDetails: false,
  });
  const [amount, setAmount] = React.useState('');
  const [inputAmt, setInputAmt] = React.useState('');
  const [profileDetails, setProfileDetails] = useState<any>();
  const route = useRoute<any>();
  const { strategyId, title, current, accountId, code, ticker, accountDetails, userMessage, stocksData, name }: any = route?.params;
  console.log(accountId);
  const navigation = useNavigation<GlobalNavigationProp>();
  const { validate } = useInvestmentValidator();
  const [errorString, setErrorString] = useState<string>('');

  const authDetails = async () => {
    setLoading(prev => ({ ...prev, profileDetails: true }));
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        `/webV1/auth/isloggedIn/check`,
      );
      if (res.data) {
        setProfileDetails(res.data);
        setLoading(prev => ({ ...prev, profileDetails: false }));
      }
    } catch (error: any) {
      console.log(error);
      setLoading(prev => ({ ...prev, profileDetails: false }));
      Toast.show({
        type: 'errorToast',
        text1: 'Error',
        text2: error?.response?.data?.message,
      });
    }
  };

  const url = accountId
    ? `/webV1/trading/totalBalance?strategyId=${strategyId}&accountId=${accountId}`
    : `/webV1/trading/totalBalance?strategyId=${strategyId}`;


  const totalBalance = async () => {
    setLoading(prev => ({ ...prev, amountLoading: true }));
    try {
      const res: AxiosResponse<any> = await authenticatedGet(url,
      );
      if (res.data) {
        console.log('new res:', res.data);
        setAmount(res?.data?.cash);
        setLoading(prev => ({ ...prev, amountLoading: false }));
      }
    } catch (error: any) {
      console.log('total balance', error);
      setLoading(prev => ({ ...prev, amountLoading: false }));
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching balance',
        text2: error?.response?.data?.message,
      });
    }
  };

  const addHandler = async () => {
    if (inputAmt === '') {
      setErrorString('Please enter amount');
      return;
    }
    const validation = validate(inputAmt, parseFloat(amount), title, 'brokerName');
    if (!validation.success) {
      setErrorString(validation.error || 'Validation failed');
      return;
    }
    setLoading(prev => ({ ...prev, addMore: true }));
    try {
      const res = await authenticatedPost(
        '/webV1/trading/buy',
        { amount: inputAmt, strategyId }
      );
      if (res.data) {
        setLoading(prev => ({ ...prev, addMore: false }));
        Toast.show({
          type: 'successToast',
          text1: 'Successfully added',
          text2: res.data.message,
        });
        navigation.navigate('HomeTabs');
      }
    } catch (error: any) {
      console.log('add hanlder error', error);
      setLoading(prev => ({ ...prev, addMore: false }));
    }
  };

  const WithdrawHandler = async () => {
    if (inputAmt === '') {
      setErrorString('Please enter amount');
      return;
    }
    const validation = validate(inputAmt, current, title, 'brokerName');
    if (!validation.success) {
      setErrorString(validation.error || 'Validation failed');
      return;
    }
    setLoading(prev => ({ ...prev, withdraw: true }));
    try {
      const res = await authenticatedPost(
        '/webV1/trading/sell',
        { amount: inputAmt, strategyId }
      );
      if (res.data) {
        setLoading(prev => ({ ...prev, withdraw: false }));
        Toast.show({
          type: 'successToast',
          text1: 'Success',
          text2: res.data.message,
        });
        navigation.navigate('HomeTabs');
      }
    } catch (error: any) {
      console.log('add hanlder error', error);
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const deployStrategy = async () => {
    if (inputAmt === '') {
      setErrorString('Please enter amount');
      return;
    }
    const validation = validate(inputAmt, parseFloat(amount), title, 'brokerName');
    if (!validation.success) {
      setErrorString(validation.error || 'Validation failed');
      return;
    }
    setLoading(prev => ({ ...prev, deploy: true }));
    try {
      const res = await authenticatedPost(
        '/webV1/trading/deployStrategy',
        {
          amount: inputAmt,
          accountId,
          isAiOrder: userMessage ? true : false,
          code: code,
          ticker: ticker,
          accountDetails: accountDetails[0],
          userId: profileDetails?.userData?._id,
          question: userMessage,
          stocksList: stocksData?.length === 0 ? undefined : stocksData?.map((stock: any) => ({ ticker: stock.ticker, upside: stock.upside ?? 0 })) || [],
          aiStrategyName: name,
        }
      );
      if (res.data) {
        setLoading(prev => ({ ...prev, deploy: false }));
        Toast.show({
          type: 'successToast',
          text1: 'Successfully Invested',
          text2: res.data.message,
        });
        navigation.navigate('HomeTabs');
        console.log(res.data);
      }
    } catch (error: any) {
      // console.log('deploy handler error', error);
      // ErrorLogger.logError(error);
      setLoading(prev => ({ ...prev, deploy: false }));
      Toast.show({
        type: 'errorToast',
        text1: 'Error while deploying strategy',
      });
    }
  };

  useEffect(() => {
    totalBalance();
    authDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };


  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={['#4253F0', '#2A1452', '#111928']}
          locations={[0.0164, 0.2446, 0.3717]}
          start={{ x: 0.7, y: 0 }}
          end={{ x: 0.4, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContainer}>
          <HeaderComponent title={title} />
        </View>

        {loading.withdraw || loading.addMore || loading.deploy ?
          <Loader onlyLoader={false} />
          :
          (
            <View style={styles.mainContainer}>

              <View style={styles.content}>
                <Text style={styles.title}>
                  How much do you want to{' '}
                  <Text style={styles.investText}>{title}?</Text>
                </Text>

                <Text style={styles.label}>Enter Amount</Text>

                <View style={styles.inputContainer}>
                  {Platform.OS === 'android' ? (
                    <Picker
                      selectedValue={currency}
                      style={styles.currencyPicker}
                      onValueChange={itemValue => setCurrency(itemValue)}>
                      <Picker.Item label="USD" value="USD" style={{ color: themes.colors.white }} />
                    </Picker>
                  ) : (
                    <RNPickerSelect
                      value={'USD'}
                      onValueChange={value => setCurrency(value)}
                      items={[
                        { label: 'USD', value: 'USD', color: themes.colors.white },
                      ]}
                      style={{
                        inputIOS: {
                          color: themes.colors.white,
                          backgroundColor: themes.colors.gray800,
                          padding: 10,
                          borderRadius: 8,
                          marginTop: 5,
                        },
                        inputAndroid: {
                          color: themes.colors.white,
                          backgroundColor: themes.colors.gray800,
                          padding: 10,
                          borderRadius: 8,
                          marginTop: 5,
                        },
                      }}
                    />
                  )}

                  <View style={styles.divider} />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Enter Amount"
                    placeholderTextColor="#a1a1a1"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setInputAmt}
                  />
                </View>
                <Text style={styles.errorText}>{errorString}</Text>
              </View>

              <View style={styles.bottomContainer}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Amount available to {title}</Text>
                  {title === 'Add' || title === 'Invest' ?
                    <View>
                      {!loading.amountLoading ?
                        <CurrencyFormatter amount={amount} style={styles.amountAvailable} />
                        :
                        <BasicLoader />
                      }
                    </View>
                    :
                    <CurrencyFormatter amount={current} style={styles.amountAvailable} />
                  }
                </View>

                <Text style={styles.disclaimer}>
                  By accepting, I approve OneUp to automatically manage orders on my
                  behalf.
                </Text>

                <TouchableOpacity onPress={title === 'Add' ? addHandler : (title === 'Invest' ? deployStrategy : WithdrawHandler)} disabled={loading.withdraw || loading.addMore || loading.deploy}>
                  <LinearGradient
                    colors={['#4451ED', '#5521B5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientBtn}>
                    {loading.withdraw || loading.addMore || loading.deploy ?
                      <BasicLoader />
                      :
                      <Text style={styles.submitButtonText}>{title} →</Text>
                    }
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.primaryMain,
    // paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    borderBottomWidth: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 20,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
    color: themes.colors.white,
    marginTop: 20,
  },
  investText: {
    color: themes.colors.UnitedNationsBlue,
  },
  label: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.alabaster,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: themes.colors.SecondaryMain,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
    borderColor: themes.colors.silverSand,
    borderWidth: 1,
    height: 50,
  },
  currencyPicker: {
    flex: 1,
    color: '#ffffff',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: themes.colors.silverSand,
    marginHorizontal: 10,
  },
  amountInput: {
    flex: 2,
    color: themes.colors.white,
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    padding: 10,
    marginTop: 20,
  },
  infoText: {
    color: themes.colors.neutralN500,
  },
  amountAvailable: {
    color: themes.colors.white,
    fontWeight: 'bold',
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
  },
  disclaimer: {
    color: themes.colors.neutralN500,
    fontSize: 10,
    marginTop: 10,
  },
  investButton: {
    backgroundColor: themes.colors.foundationSecondary,
    borderRadius: 8,
    height: 41,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  investButtonText: {
    color: '#ffffff',
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    paddingBottom: 30,
  },
  gradientBtn: {
    width: width * 0.92,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
  submitButtonText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  errorText: {
    color: themes.colors.fireOpal,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
});
