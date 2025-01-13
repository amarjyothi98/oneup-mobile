/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { themes } from '../../../1up/theme/theme';
import { HeaderComponent } from '../../components/header';
import { Icon } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { AxiosResponse } from 'axios';
import { authenticatedPost } from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/core';
import { GlobalNavigationProp } from '../../../../App';
import BasicLoader from '../../components/BasicLoader';
import ErrorLogger from '../../components/ErrorLogger';

const { width } = Dimensions.get('window');

// Main AutomateStrategy component
export const AutomateStrategy = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const route = useRoute<any>();
  const {
    code,
    ticker,
    strategyId,
    data,
    accountId,
    accountDetails,
    userMessage,
    stocksData,
    name,
    inclusion,
    exclusion,
    accountData,
  } = route?.params;
  const [loading, setLoading] = useState(false);
  const [strategyDetails, setStrategyDetails] = useState<any>();
  const getStrategyDetails = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/pages/strategyManegement/strategyInsight/dashboard/strategyDetail',
        { code: code, ticker: ticker }
      );
      if (res.data) {
        console.log('Response:', res.data);
        setStrategyDetails(res.data);
      }
    } catch (error) {
      ErrorLogger.logError(error);
    }
  };
  const getHoldingsByEmail = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/pages/strategyManegement/strategyInsight/dashboard/send-portfolio-email',
        {
          strategyName: strategyDetails.Name,
          ticker: ticker,
          code: code ? code : '00000000000000000000000',
          inclusionsAndExclusions: { inclusions: inclusion, exclusions: exclusion },
        },
      );
      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'Portfolio sent on email successfully',
        });
      }
      setLoading(false);
    } catch (error) {
      ErrorLogger.logError(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while sending portfolio on email',
      });
      setLoading(false);
    }
  };

  const InvestAutomate = async () => {
    if(accountData[0].length !== 0) {
      navigation.navigate('InvestWithdrawLiquidate', {
        title: 'Invest',
        strategyId,
        code,
        ticker,
        data,
        accountId,
        accountDetails,
        userMessage,
        stocksData,
        name,
      });
    } else {
      navigation.navigate('BrokerageHub');
    }
  };

  useEffect(() => {
    getStrategyDetails();
  }, []);
  console.log('ajdjla', accountData[0]);

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.4, y: 0.8 }}
      style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderComponent title={'Stay Updated and in Control'} />
        </View>

        <View style={styles.mainContent}>
          <TouchableWithoutFeedback onPress={InvestAutomate}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.gradientBackground]}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                {accountData[0].length !== 0 ?
                  <Text style={styles.ctaButtonText}>Automate Your Strategy</Text>
                  :
                  <Text style={styles.ctaButtonText}>Connect Your Broker</Text>
                }
                <Icon
                  source="arrow-right"
                  size={20}
                  color={themes.colors.white}
                />
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={getHoldingsByEmail}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.gradientBackground]}>
              {loading ?
                <View>
                  <Text style={{ color: themes.colors.white }}>Sending Mail...</Text>
                </View>
                :
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text style={styles.ctaButtonText}>Get Holdings by Email</Text>
                  <Icon
                    source="arrow-right"
                    size={20}
                    color={themes.colors.white}
                  />
                </View>
              }
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  ctaButtonText: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginRight: 8,
    fontFamily: themes.fonts.fontFamily,
  },
  gradientBackground: {
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
});
