/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/*

PortfolioDetailScreen component

*/
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  ScrollView,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import { themes } from '../../../1up/theme/theme';
import { HeaderComponent } from '../../components/header';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AxiosResponse } from 'axios';
import { authenticatedGet, authenticatedPost } from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { InvestmentUserDetails } from '../../types/types';
import { extractAmount, formatAmount } from '../../../1up/utils/amount';
// import { Icon } from 'react-native-paper';
import { ModalWithOptions } from '../../components/ModalWithOptions';
import { GlobalNavigationProp } from '../../../../App';
import { GraphSection } from '../../components/graphSection';
import FlipCard from 'react-native-flip-card';
import { BlurView } from '@react-native-community/blur';
import TypewriterText from '../../components/TypewriterEffect';
import { Loader } from '../../components/Loader';

const { width } = Dimensions.get('window');

type InvestmentStrategyCodeTickerProps = RouteProp<
  {
    PortfolioDetailScreen: {
      code: string;
      ticker: string;
      strategyId: string;
      data: any[];
    };
  },
  'PortfolioDetailScreen'
>;

const InvestmentCard = ({
  data,
  flipped,
  flipHandler,
  setThesisPayload,
  thesis,
  question,
  getThesis,
}: {
  data: any[];
  flipped: any;
  flipHandler: any;
  setThesisPayload?: any;
  thesis?: string;
  question?: string;
  getThesis?: any;
}) => {
  const renderUpside = (upside: number): string => {
    const formattedUpside = upside * 100;
    return `+${formattedUpside.toFixed(0)}%`;
  };
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      keyExtractor={(item, index) => `investment-${index}`}
      renderItem={({ item }) => (
        <FlipCard
          friction={6}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
          flip={flipped?.ticker === item?.ticker}
          clickable={false}
        >
          <View>
            {/* Badges */}
            <View style={styles.badgeContainer}>
              {item && item?.isFamous ? (
                <>
                  <View style={[styles.badge]}>
                    <SvgUri
                      uri={
                        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/StarInvestor.svg'
                      }
                    />
                  </View>

                  {item?.isHidden && (
                    <View style={[styles.badge, styles.starInvestorBadge]}>
                      <SvgUri
                        uri={
                          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/HiddenGem.svg'
                        }
                      />
                    </View>
                  )}
                </>
              ) : item && item?.isFamous && item?.isHidden ? (
                <View style={[styles.badge]}>
                  <SvgUri
                    uri={
                      'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/HiddenGem.svg'
                    }
                  />
                </View>
              ) : (
                <></>
              )}
            </View>
            <LinearGradient
              colors={['#3F83F8', '#9354D7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.2, y: 1 }}
              style={[styles.gradientBorder]}>
              <TouchableWithoutFeedback style={styles.card}>
                {item && item.info && item?.info?.logo_url && (
                  <Image
                    source={{ uri: item?.info?.logo_url }}
                    style={styles.logo}
                  />
                )}

                <View>
                  <Text style={styles.title}>{item.ticker}</Text>
                  <Text style={styles.subtitle}>
                    {item?.info?.company_companyName}
                  </Text>
                  <Text style={styles.sectionHeader}>Potential Gain</Text>
                  <Text style={styles.profit}>
                    {renderUpside(item?.upside)}
                  </Text>
                  <View style={styles.stockWeight}>
                    <Text style={styles.textLeft}>Stock Weight</Text>
                    <Text style={styles.textRight}>
                      {(item?.weight * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                {/* Button */}
                <TouchableWithoutFeedback
                  style={styles.button}
                  onPress={() => {
                    getThesis();
                    flipHandler(item);
                    setThesisPayload((prev: any) => ({
                      ...prev,
                      ticker: item?.ticker,
                      question: question,
                    }));
                  }}>
                  <LinearGradient
                    colors={['#4253F0', '#9354D7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.revealGradient}>
                    <Text style={styles.revealWhyText}>Reveal Why ➜</Text>
                  </LinearGradient>
                </TouchableWithoutFeedback>
              </TouchableWithoutFeedback>
            </LinearGradient>
          </View>
          <LinearGradient
            colors={['#3F83F8', '#9354D7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.2, y: 1 }}
            style={[styles.gradientBorder]}>
            <TouchableWithoutFeedback style={styles.card}>
              <View>
                <Text style={styles?.winningMove}>Catch The Winning Move</Text>
                <Text style={styles?.winningMoveDesc}>
                  {item?.info?.company_description.slice(0, 250)}...
                </Text>
              </View>

              {/* Button */}
              <TouchableWithoutFeedback
                style={styles.button}
                onPress={() => flipHandler(null)}>
                <LinearGradient
                  colors={['#4253F0', '#9354D7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.revealGradientFlip}>
                  <SvgUri
                    uri={
                      'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/flip.svg'
                    }
                    width={20}
                    height={20}
                    style={{ alignSelf: 'center' }}
                  />
                </LinearGradient>
              </TouchableWithoutFeedback>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </FlipCard>
      )}
    />
  );
};

export const PortfolioDetailScreen = () => {
  const [investDeatils, setInvestmentDetails] = useState<any[]>([]);
  const route = useRoute<InvestmentStrategyCodeTickerProps>();
  const {
    code,
    ticker,
    strategyId,
    data,
    userMessage,
    stocksData,
    name,
    inclusion,
    exclusion,
  }: any = route?.params;
  const [getUserStrategy, setUserStrategy] = useState<InvestmentUserDetails>();
  const [message, setMessage] = useState<any>();
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigation<GlobalNavigationProp>();
  const [loading, setLoading] = useState({
    liquidate: false,
  });

  const routes = navigate.getState()?.routes;
  const prevRoute = routes[routes.length - 2].name;
  const [accountData, setAccountData] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState<any>(null);
  const [thesis, setThesis] = useState<any>(null);
  const [thesisPayload, setThesisPayload] = useState<any>({
    ticker: '',
    question: '',
  });
  const [thesisLoading, setThesisLoading] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      setInvestmentDetails(data);
    }
  }, [data]);

  const handleUserStrategy = async () => {
    try {
      const res: AxiosResponse<InvestmentUserDetails> = await authenticatedPost(
        '/webV1/trading/getUserStrategy',
        {
          code: code,
          ticker: ticker,
        },
      );
      if (res.data) {
        setUserStrategy(res.data);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching the portfolio holdings',
      });
    }
  };

  useEffect(() => {
    if (strategyId !== 'STRATEGY') {
      handleUserStrategy();
      handleGetPosition();
    }
  }, []);

  const handleLiquidate = () => {
    setModalVisible(true);
  };

  const handleBuy = () => {
    navigate.navigate('InvestWithdrawLiquidate', {
      strategyId: strategyId,
      title: 'Add',
      current: getUserStrategy?.current,
    });
  };

  const handleSell = () => {
    navigate.navigate('InvestWithdrawLiquidate', {
      strategyId: strategyId,
      title: 'Withdraw',
      current: getUserStrategy?.current,
    });
  };

  const handleLiquidateSelection = async () => {
    setModalVisible(false);
    setLoading(prev => ({ ...prev, liquidate: true }));
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webv1/trading/liquidate',
        {
          accountDetails: {
            name: getUserStrategy?.accountDetails.name,
          },
          strategyId: strategyId,
        },
      );
      if (res.data) {
        // navigate.navigate('LoderScreen');
        Toast.show({
          type: 'successToast',
          text1: 'Successfully Liquidated',
          text2: res.data.message,
        });
        navigate.navigate('HomeTabs');
        setLoading(prev => ({ ...prev, liquidate: false }));
      }
    } catch (error) {
      console.log('adjla', error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while Liquidating holdings',
      });
      setLoading(prev => ({ ...prev, liquidate: false }));
    }
  };

  const handleGetPosition = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        `/webV1/trading/strategyPosition?strategyId=${strategyId}`,
      );
      console.log('ilajfldka', strategyId);
      if (res.data) {
        console.log('Response:', res.data);
      }
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        const messageStatus =
          error.response.data.message || 'An unexpected error occurred.';
        setMessage(messageStatus);
        // console.log('Error Message:', error.response);
      } else {
        setMessage('Unable to connect to the server.');
        console.log('Error:', error);
      }
    }
  };

  const getAllAccounts = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        '/webV1/trading/getAllAccounts',
      );
      if (res.data) {
        setAccountData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAccounts();
  }, []);

  const getThesis = async () => {
    console.log('run thesis');
    setThesisLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/ai/stock-thesis',
        {
          ticker,
          question: userMessage,
        },
      );
      if (res.data) {
        setThesis(res?.data?.thesis);
        setThesisLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching the thesis',
      });
      setThesisLoading(false);
    }
  };

  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (isFlipped !== null) {
      const timer = setTimeout(() => {
        setFlip(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  // console.log('thesis', JSON.stringify(thesis, null, 2));

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.4, y: 0.8 }}
      style={styles.container}>
      {isFlipped && (
        <Pressable
          style={styles.fullScreenBlur}
          onPress={() => {
            // setIsFlipped(null);
            // setFlip(false);
          }}>
          <View style={{ zIndex: 999, position: 'absolute' }}>
            <FlipCard
              friction={6}
              perspective={1000}
              flipHorizontal={true}
              flipVertical={false}
              flip={flip}
              clickable={false}>
              <LinearGradient
                colors={['#3F83F8', '#9354D7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.2, y: 1 }}
                style={[styles.gradientBorder, { width: 300 }]}>
                <TouchableWithoutFeedback style={styles.fullScreenCard}>
                  {isFlipped && isFlipped.info && isFlipped.info.logo_url && (
                    <Image
                      source={{ uri: isFlipped.info.logo_url }}
                      style={styles.logo}
                    />
                  )}

                  <View>
                    <Text style={styles.title}>{isFlipped.ticker}</Text>
                    <Text style={styles.subtitle}>
                      {isFlipped.info.company_companyName}
                    </Text>
                    <Text style={styles.sectionHeader}>Potential Gain</Text>
                    <Text style={styles.profit}>
                      {`+${Math.round(isFlipped.weight * 1000)}%`}
                    </Text>
                    <View style={styles.stockWeight}>
                      <Text style={styles.textLeft}>Stock Weight</Text>
                      <Text style={styles.textRight}>
                        {(isFlipped.weight * 100).toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  <TouchableWithoutFeedback
                    style={[styles.button, { marginTop: 90 }]}
                    onPress={() => setIsFlipped(isFlipped)}>
                    <LinearGradient
                      colors={['#4253F0', '#9354D7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.revealGradient}>
                      <Text style={styles.revealWhyText}>Reveal Why ➜</Text>
                    </LinearGradient>
                  </TouchableWithoutFeedback>
                </TouchableWithoutFeedback>
              </LinearGradient>
              <LinearGradient
                colors={['#3F83F8', '#9354D7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.2, y: 1 }}
                style={[styles.gradientBorder, { width: 300 }]}>
                <TouchableWithoutFeedback style={styles.fullScreenCard}>
                  <View>
                    <Text style={styles?.winningMove}>
                      Catch The Winning Move
                    </Text>
                    <View style={{ height: 280, width: '100%' }}>
                      <ScrollView>
                        {thesisLoading ? <Text style={[styles?.fullscreenWinningMoveDesc, { width: 300 }]}>Generating Thesis...</Text> : <TypewriterText text={thesis} />}
                      </ScrollView>
                    </View>
                  </View>

                  {/* Button */}
                  <TouchableWithoutFeedback
                    style={styles.button}
                    onPress={() => {
                      setIsFlipped(null);
                      setFlip(false);
                    }}>
                    <LinearGradient
                      colors={['#4253F0', '#9354D7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.revealGradientFlip}>
                      <SvgUri
                        uri={
                          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/flip.svg'
                        }
                        width={20}
                        height={20}
                        style={{ alignSelf: 'center' }}
                      />
                    </LinearGradient>
                  </TouchableWithoutFeedback>
                </TouchableWithoutFeedback>
              </LinearGradient>
            </FlipCard>
          </View>
          <BlurView
            style={styles.blurComponent}
            blurType="dark"
            blurAmount={10}
          />
        </Pressable>
      )}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderComponent
            title={
              strategyId === 'STRATEGY'
                ? 'Discover Your Portfolio'
                : 'Follow Your Portfolio'
            }
          />
        </View>

        {loading?.liquidate &&
          <LinearGradient
            colors={['#4253F0', '#2A1452', '#111928']}
            locations={[0.0164, 0.2446, 0.3717]}
            start={{ x: 0.7, y: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
            <Loader onlyLoader={false} />
          </LinearGradient>
        }
        <ScrollView style={styles.mainContent}>
          {strategyId === 'STRATEGY' ? (
            <View style={styles.investView}>
              <Text style={styles.investTest}>Invest Like the Pros</Text>
              <Text style={styles.liveUpdateText}>
                Today’s best Wall Street bets, customized for your strategy.
              </Text>
            </View>
          ) : (
            <Text style={styles.liveUpdateText}>
              Stay ahead with live updates from top investors.
            </Text>
          )}
          {prevRoute === 'HomeTabs' &&
            getUserStrategy?.status === 'deployed' && (
              <View style={styles.holdingsCard}>
                <View style={styles.holdingsInfo}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.holdingsLabel}>Invested</Text>
                    <Text style={styles.holdingsAmount}>
                      {extractAmount(String(getUserStrategy?.invested))}
                    </Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <Text style={styles.holdingsLabel}>Current Value</Text>
                    <Text style={styles.currentValue}>
                      {extractAmount(String(getUserStrategy?.current))}
                    </Text>
                    <Text style={styles.holdingsCurrency}>
                      {getUserStrategy
                        ? `${isNaN(
                          Number(getUserStrategy?.current) -
                          Number(getUserStrategy?.invested),
                        )
                          ? '$0.00'
                          : formatAmount(
                            Number(getUserStrategy?.current) -
                            Number(getUserStrategy?.invested),
                          )
                        }`
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>
            )}

          {prevRoute === 'HomeTabs' &&
            message &&
            getUserStrategy?.status !== 'deployed' && (
              <View style={styles.deplymentCard}>
                <View style={styles.infoContainer}>
                  <SvgUri
                    uri={
                      'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/info-outline.svg'
                    }
                    width={20}
                    height={20}
                  />
                </View>
                <Text style={styles.deplymentText}>{message}</Text>
              </View>
            )}

          <Text style={styles.noHoldingText}>
            {investDeatils?.length} Holdings
          </Text>
          {investDeatils && investDeatils?.length > 0 && (
            <View>
              <InvestmentCard
                data={investDeatils}
                flipped={isFlipped}
                flipHandler={setIsFlipped}
                setThesisPayload={setThesisPayload}
                thesis={thesis}
                question={userMessage}
                getThesis={getThesis}
              />
            </View>
          )}

          {/* Graph section */}
          {true && (
            <View
              style={[
                styles.graphSection,
                prevRoute === 'StrategySelection'
                  ? { marginBottom: 90 }
                  : { marginBottom: 150 },
              ]}>
              {/* Text header */}
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.perfomanceText}>
                  Historical Performance*
                </Text>
                {userMessage && (
                  <Text style={{ marginLeft: 5, color: 'gray' }}>Since max</Text>
                )}
              </View>

              {/* Graph section */}
              <View style={{ marginTop: 16 }}>
                <GraphSection
                  code={code}
                  ticker={ticker}
                  list={
                    stocksData?.length === 0
                      ? undefined
                      : stocksData?.map((stock: any) => ({
                        ticker: stock?.ticker,
                        upside: stock?.upside ?? 0,
                      })) || []
                  }
                  hideDynamicAxis={userMessage ? true : false}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {prevRoute === 'StrategySelection' ||
          prevRoute === 'InvestmentThemeScreen' ? (
          <View style={styles.submitContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('adlfjka', name);
                navigate.navigate('AutomateStrategy', {
                  accountId: accountData[0]?.id,
                  code: code,
                  ticker: ticker,
                  data: data,
                  accountDetails: accountData,
                  userMessage: userMessage,
                  stocksData: stocksData,
                  name,
                  inclusion,
                  exclusion,
                  accountData,
                });
              }}>
              <LinearGradient
                colors={['#4451ED', '#5521B5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.gradientBtn]}>
                <Text style={styles.submitButtonText}>Make Your Move ➜</Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={styles.submitContainer}>
            <TouchableWithoutFeedback onPress={handleBuy}>
              <LinearGradient
                colors={['#4451ED', '#5521B5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientBtn}>
                <Text style={styles.submitButtonText}>Buy</Text>
              </LinearGradient>
            </TouchableWithoutFeedback>

            <View style={styles.buttonRow}>
              <TouchableWithoutFeedback
                style={styles.halfButton}
                onPress={handleSell}>
                <Text style={styles.submitButtonText}>Sell</Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                style={styles.halfButton}
                onPress={handleLiquidate}>
                <Text style={styles.submitButtonText}>Liquidate</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </View>

      {/* Centered Modal to delete account */}
      <ModalWithOptions
        visible={isModalVisible}
        onBackdropShouldClose={false}
        isTitlePresent={true}
        isDeleteButton={false}
        setVisible={setModalVisible}
        onPress={handleLiquidateSelection}
        title="Confirm Strategy Liquidation"
        description="Are you sure you want to liquidate this strategy?"
        svgUri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/liquidate.svg'
        }
        secondBtnText={loading?.liquidate ? 'Liquidating...' : 'Liquidate'}
        firstBtnText="Go Back"
      />
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    marginTop: 15,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  investView: {
    marginBottom: 20,
  },
  investTest: {
    width: width * 0.92,
    fontSize: 18,
    fontWeight: Platform.OS === 'android' ? 'bold' : '700',
    color: themes.colors.white,
    alignSelf: 'center',
    lineHeight: 24,
    fontFamily: themes.fonts.fontFamily,
  },
  liveUpdateText: {
    width: width * 0.92,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: Platform.OS === 'android' ? 'semibold' : '500',
    color: themes.colors.gray300,
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  holdingsCard: {
    width: width * 0.92,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    borderColor: themes.colors.gray700,
    borderWidth: 1,
    backgroundColor: 'rgba(31, 42, 55, 0.4)',
    alignSelf: 'center',
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
    color: themes.colors.white,
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
    color: themes.colors.successgreen,
    fontSize: width * 0.03,
    paddingTop: 5,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  noHoldingText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    paddingHorizontal: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  deplymentCard: {
    width: width * 0.92,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
    marginTop: 20,
  },
  infoContainer: {
    height: 21,
    width: 30,
    borderRightWidth: 1,
    borderRightColor: themes.colors.primary700,
  },
  deplymentText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: Platform.OS === 'android' ? 'semibold' : '400',
    color: themes.colors.primary700,
    paddingLeft: 12,
    fontFamily: themes.fonts.fontFamily,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 20,
    overflow: 'visible',
  },
  gradientBackground: {
    flexDirection: 'row',
    borderRadius: 8,
    marginRight: 20,
    overflow: 'visible',
  },
  card: {
    width: 200,
    minHeight: 277,
    backgroundColor: '#1F2636',
    borderRadius: 6.5,
    margin: 1.5,
  },
  fullScreenCard: {
    maxWidth: 300,
    minHeight: 384,
    backgroundColor: '#1F2636',
    borderRadius: 6.5,
    margin: 1.5,
    paddingHorizontal: 5,
  },
  badgeContainer: {
    position: 'absolute',
    marginTop: -10,
    marginLeft: -10,
    zIndex: 9999,
  },
  badge: {
    position: 'absolute',
  },
  starInvestorBadge: {
    marginTop: 30,
  },
  hiddenGemBadge: {
    backgroundColor: '#87CEFA',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: themes.fonts.fontFamily,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 20,
    color: themes.colors.white,
    borderRadius: Platform.OS === 'ios' ? '50%' : 20,
  },
  title: {
    fontSize: 18,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    color: themes.colors.white,
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  subtitle: {
    fontSize: 14,
    color: themes.colors.gray400,
    marginTop: 4,
    lineHeight: 21,
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
    height: 35,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 12,
    color: themes.colors.gray400,
    marginTop: 5,
    fontWeight: Platform.OS === 'android' ? 'bold' : '500',
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  profit: {
    fontSize: 24,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    color: themes.colors.green400,
    marginVertical: 6,
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  stockWeight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    paddingVertical: 4,
    marginHorizontal: 'auto',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: themes.colors.gray700,
    borderBottomColor: themes.colors.gray700,
  },
  textLeft: {
    fontSize: 12,
    color: themes.colors.gray400,
    fontFamily: themes.fonts.fontFamily,
    lineHeight: 15,
  },
  textRight: {
    fontSize: 12,
    color: themes.colors.gray400,
    fontFamily: themes.fonts.fontFamily,
    lineHeight: 15,
  },
  button: {
    // backgroundColor: themes.colors.green400,
    // paddingVertical: 10,
    // marginTop: 15,
    // borderTopWidth: 2,
    // borderTopColor: 'rgba(0, 0, 0, 0.31)',
    // borderLeftColor: 'rgba(0, 0, 0, 0.31)',
    // borderLeftWidth: 2,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
    color: themes.colors.gray900,
    fontFamily: themes.fonts.fontFamily,
    textAlign: 'center',
  },
  graphSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  perfomanceText: {
    fontSize: 20,
    fontWeight: Platform.OS === 'android' ? 'bold' : '700',
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
  },
  submitContainer: {
    width: width,
    position: 'absolute',
    paddingBottom: Platform.OS === 'android' ? 20 : 30,
    bottom: 0,
    backgroundColor: themes.colors.gray800,
  },
  submitContainerMakeMove: {
    width: width,
    position: 'absolute',
    paddingBottom: Platform.OS === 'android' ? 20 : 30,
    bottom: 0,
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
    alignSelf: 'center',
  },
  submitButtonText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  buttonRow: {
    width: width * 0.92,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignSelf: 'center',
  },
  halfButton: {
    width: (width * 0.92 - 10) / 2,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themes.colors.gray500,
  },
  gradientBorder: {
    borderRadius: 8,
    marginRight: 20,
    // overflow: 'visible',
  },
  revealWhyText: {
    color: themes.colors.white,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
    fontStyle: 'italic',
  },
  revealGradient: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  revealGradientFlip: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
    width: 50,
    marginHorizontal: 'auto',
  },
  Blurcontainer: {
    position: 'absolute', // Equivalent to 'fixed'
    top: 0, // Equivalent to 'inset-0' (top, right, bottom, left all 0)
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 50, // Equivalent to 'z-50'
    display: 'flex', // Equivalent to 'flex'
    alignItems: 'center', // Equivalent to 'items-center'
    justifyContent: 'center', // Equivalent to 'justify-center'
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Equivalent to 'bg-black bg-opacity-50'
    // backdropFilter: 'blur(16px)', // Equivalent to 'backdrop-blur-lg'
  },
  winningMove: {
    fontStyle: 'italic',
    fontSize: 16,
    color: themes.colors.gray400,
    textAlign: 'center',
    marginVertical: 10,
  },
  winningMoveDesc: {
    fontSize: 14,
    color: themes.colors.white,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 2,
    // paddingHorizontal: 2,
  },
  fullscreenWinningMoveDesc: {
    fontSize: 14,
    color: themes.colors.white,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 2,
    // height: 260,
    // overflow: 'scroll',
    lineHeight: 20,
    // paddingHorizontal: 2,
  },
  fullScreenBlur: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurComponent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  flippedCard: {
    zIndex: 100,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
