/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { GlobalNavigationProp } from '../../../../App';
import { themes } from '../../../1up/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { extractAmount, formatAmount } from '../../../1up/utils/amount';
import { useData } from '../../../1up/provider/data';
import { Strategy } from '../../types/types';
import { AxiosResponse } from 'axios';
import { authenticatedGet } from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import { Loader } from '../../components/Loader';
import LinearGradient from 'react-native-linear-gradient';
import { LoaderWithGradient } from '../../components/LoaderWithGradient';

const { width } = Dimensions.get('window');

const FundItem = ({ item, onPress }: any) => {
  return (
    <TouchableWithoutFeedback
      style={styles.fundContainer}
      onPress={() => {
        onPress(item.code, item.details.ticker, item.strategyId);
      }}>
      <View style={styles.startContainer}>
        <Text style={styles.fundName}>{item.mutualFundName}</Text>
        <Text style={styles.ticker}>{item.details.ticker}</Text>
      </View>

      <View style={styles.centerContainer}>
        <Image source={{ uri: item.accountDetails.logo }} style={styles.logo} />
      </View>

      <View style={styles.endContainer}>
        <Text style={styles.statusMessage}>
          {item.status === 'deployed' ? (
            <View>
              <Text
                style={[
                  styles.investedMoney,
                  item.invested <= item.current ? styles.inGain : styles.inLoss,
                ]}>
                {item.current ? extractAmount(item.current) : ''}
              </Text>
              <Text style={styles.investedMoney}>
                {item.invested ? extractAmount(item.invested) : ''}
              </Text>
            </View>
          ) : (
            <Text style={styles.statusMessage}>{item.message}</Text>
          )}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const PortfolioScreen = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const inset = useSafeAreaInsets();
  const [numberOfHoldings, setNumberOfHoldings] = useState(0);
  const { user, holdings } = useData();
  const [holdingsList, setHoldingsList] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (holdings || holdingsList) {
      setNumberOfHoldings(holdings.length);
      setNumberOfHoldings(holdingsList.length);
    }
  }, [holdings, holdingsList]);

  useEffect(() => {
    if (holdings) {
      setHoldingsList(holdings);
    }
  }, [holdings]);

  useFocusEffect(
    useCallback(() => {
      setIsPageLoading(false);
      handleHoldingNumbers();
    }, []),
  );

  const handleProfilePress = () => {
    navigation.navigate('ProfileDetails');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleHoldingNumbers();
    setRefreshing(false);
  }, []);

  const handleHoldingNumbers = async () => {
    setIsLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        '/webV1/pages/dashboard/getAllStrategies',
      );
      if (res.data) {
        setHoldingsList(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching the portfolio holdings',
      });
    }
  };

  const handleCreateStrategy = () => {
    navigation.replace('HomeTabs');
  };

  const handlePortfolioDetails = async (
    code: string,
    ticker: string,
    strategyId: string,
  ) => {
    if (code && ticker && strategyId) {
      setIsPageLoading(true);
      handleInvestmentDetails(code, ticker, strategyId);
    }
  };

  const handleInvestmentDetails = async (
    code: any,
    ticker: any,
    strategyId: any,
  ) => {
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        `/webV1/pages/strategyManegement/strategyInsight/dashboard/stock?ticker=${ticker}&selectionCode=${code}`,
      );
      if (res.data) {
        navigation.navigate('PortfolioDetailScreen', {
          strategyId: strategyId,
          code: code,
          ticker: ticker,
          data: res.data,
        });
      }
    } catch (error) {
      setIsPageLoading(false);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching the portfolio holdings',
      });
    }
  };
  console.log(JSON.stringify(user, null, 2));

  return !isPageLoading ? (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.4, y: 0.8 }}
      style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: Platform.OS === 'ios' ? inset.top : inset.top + 20 },
          ]}>
          <Pressable onPress={() => {
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            }));
          }} style={styles.portfolio}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneUpHomePageLogo.svg'
              }
              width={34}
              height={34}
            />
            <Text style={styles.headerText}>Portfolio</Text>
          </Pressable>
          <View style={styles.iconContainer}>
            <TouchableWithoutFeedback onPress={handleNotificationPress}>
              <Icon source="bell" size={24} color={themes.colors.neutralN500} />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              style={styles.profileIcon}
              onPress={handleProfilePress}>
              {user?.userData.profileImage ? (
                <Image
                  source={{ uri: user?.userData.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Text
                  style={
                    styles.profileInitials
                  }>{`${user?.userData?.firstName[0].toUpperCase()}${user?.userData?.lastName[0].toUpperCase()}`}</Text>
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}>
          <Text style={styles.build}>
            Track your strategies and watch your wealth grow.
          </Text>

          <Text style={styles.holdingsTitle}>
            Holdings ({numberOfHoldings})
          </Text>
          <View style={styles.holdingsCard}>
            <View style={styles.holdingsInfo}>
              <View style={styles.leftContainer}>
                <Text style={styles.holdingsLabel}>Invested</Text>
                <Text style={styles.holdingsAmount}>
                  {user && user.userData && user.userData.invested
                    ? extractAmount(String(user?.userData.invested))
                    : '$0.00'}
                </Text>
              </View>
              <View style={styles.rightContainer}>
                <Text style={styles.holdingsLabel}>Current Value</Text>
                <Text style={styles.currentValue}>
                  {user && user.userData && user.userData.current
                    ? extractAmount(String(user?.userData.current))
                    : '$0.00'}
                </Text>
                <Text style={styles.holdingsCurrency}>
                  {user && user.userData
                    ? `${isNaN(
                      Number(user.userData.current) -
                      Number(user.userData.invested),
                    )
                      ? '$0.00'
                      : formatAmount(
                        Number(user.userData.current) -
                        Number(user.userData.invested),
                      )
                    }`
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Your Portfolio */}
          <Text style={styles.portfolioTitle}>Your Portfolio</Text>
          <Text style={styles.portfolioSubtitle}>
            {numberOfHoldings} Actively Managed Investment(s)
          </Text>

          {numberOfHoldings !== 0 && (
            <LinearGradient
              colors={['#3F83F8', '#9354D7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.2, y: 1 }}
              style={styles.gradientBorder}>
              <View style={styles.tableContent}>
                <View style={styles.portfolioHeader}>
                  <Text style={styles.portfolioHeaderText}>STRATEGIES</Text>
                  <Text style={styles.portfolioHeaderText}>BROKER</Text>
                  <View>
                    <Text style={styles.portfolioHeaderText}>CURRENT</Text>
                    <Text style={styles.portfolioHeaderText}>(INVESTED)</Text>
                  </View>
                </View>

                {holdingsList.map(item => (
                  <FundItem
                    key={item.strategyId}
                    item={item}
                    onPress={handlePortfolioDetails}
                  />
                ))}
              </View>
            </LinearGradient>
          )}

          {isLoading && !refreshing && <Loader onlyLoader={true} />}

          {!isLoading && holdingsList.length === 0 && (
            <View>
              <Text style={styles.strategyMessage}>
                You have no active strategies yet.
              </Text>
              <TouchableWithoutFeedback>
                <LinearGradient
                  colors={['#4451ED', '#5521B5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.gradientBackground]}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {isLoading ? (
                      <ActivityIndicator
                        color={themes.colors.white}
                        size="small"
                      />
                    ) : (
                      <TouchableWithoutFeedback
                        style={styles.buttonContent}
                        onPress={handleCreateStrategy}>
                        <Text style={styles.createStrategyText}>
                          Create Strategy
                        </Text>
                        <Icon source="arrow-right" color={'white'} size={24} />
                      </TouchableWithoutFeedback>
                    )}
                  </View>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  ) : (
    <LoaderWithGradient />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 20,
    fontFamily: themes.fonts.fontFamily,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
  },
  portfolio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundsText: {
    color: themes.colors.gray300,
  },
  headerText: {
    color: themes.colors.white,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginLeft: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    backgroundColor: themes.colors.profilePageImageBackground,
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  profileInitials: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  build: {
    color: themes.colors.gray400,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    marginTop: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  holdingsTitle: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginTop: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  holdingsCard: {
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    borderColor: themes.colors.gray700,
    borderWidth: 1,
    backgroundColor: 'rgba(31, 42, 55, 0.4)',
  },
  holdingsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: themes.fonts.fontFamily,
  },
  holdingsLabel: {
    color: themes.colors.neutralN500,
    fontSize: 12,
    fontFamily: themes.fonts.fontFamily,
  },
  holdingsAmount: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    paddingTop: 5,
    flexShrink: 0,
  },
  currentValue: {
    color: themes.colors.successgreen,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    paddingTop: 5,
    flexShrink: 0,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  holdingsCurrency: {
    color: themes.colors.white,
    fontSize: width * 0.03,
    paddingTop: 5,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  portfolioTitle: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 24,
    fontFamily: themes.fonts.fontFamily,
  },
  portfolioSubtitle: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  noStrategyText: {
    color: themes.colors.white,
    fontSize: width * 0.036,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    textAlign: 'center',
    marginTop: 50,
    lineHeight: 21,
    fontFamily: themes.fonts.fontFamily,
  },
  strategyMessage: {
    alignSelf: 'center',
    width: width * 0.75,
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    textAlign: 'center',
    marginTop: 100,
    fontFamily: themes.fonts.fontFamily,
  },
  gradientBackground: {
    width: width * 0.75,
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createStrategyText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginRight: 8,
    fontFamily: themes.fonts.fontFamily,
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  gradientBorder: {
    borderRadius: 12,
  },
  tableContent: {
    backgroundColor: '#101828',
    margin: 2,
    borderRadius: 12,
  },
  portfolioHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1B2233',
    fontFamily: themes.fonts.fontFamily,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomColor: themes.colors.gray700,
    borderBottomWidth: 1,
  },
  portfolioHeaderText: {
    flex: 1,
    color: themes.colors.neutralN500,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  fundContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.gray700,
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  fundInfo: {
    flex: 1,
    paddingBottom: 15,
  },
  fundName: {
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    flexWrap: 'wrap',
  },
  ticker: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    marginTop: 4,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    flexWrap: 'wrap',
  },
  statusMessage: {
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.portfolioStatusMessage,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 21,
    textAlign: 'center',
  },
  chartIcon: {
    flexDirection: 'row',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 5,
  },
  inGain: {
    fontSize: 14,
    color: themes.colors.green400,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  inLoss: {
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.red400,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  investedMoney: {
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.neutralN500,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  startContainer: {
    flex: 1,
    paddingBottom: 15,
    maxWidth: '35%',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  endContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingBottom: 15,
    maxWidth: '35%',
  },
});
