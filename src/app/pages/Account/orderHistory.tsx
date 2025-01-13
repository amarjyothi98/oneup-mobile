/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {SvgUri} from 'react-native-svg';
import {AxiosResponse} from 'axios';
import {authenticatedGet} from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import {formatDate} from '../../../1up/utils/dateUtils';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {GlobalNavigationProp} from '../../../../App';
import {useNavigation} from '@react-navigation/core';
import LinearGradient from 'react-native-linear-gradient';
import {Loader} from '../../components/Loader';

const {width, height} = Dimensions.get('window');

export const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<GlobalNavigationProp>();

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        `webV1/trading/executionsInStrategy?strategyId=${'all'}`,
      );
      if (res.data) {
        setOrderHistory(prev => [...prev, ...res.data]);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching order history',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = (item: any) => {
    navigation.navigate('OrderHistoryDetails', {
      item: item,
    });
  };

  const renderOrderItem = ({item}: any) => {
    const formattedBalance = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(item.execution.amount);
    return (
      <TouchableWithoutFeedback
        style={styles.notificationItem}
        onPress={() => {
          handleOrderPress(item);
        }}>
        <View style={styles.notificationContent}>
          {/* Ticker */}
          <View>
            <Text style={styles.notificationText}>{item.execution.ticker}</Text>
          </View>

          {/* Date and strategy */}
          <View style={{flexDirection: 'row', gap: 5}}>
            <Text style={styles.strategyTicker}>
              {formatDate(item.execution.createdAt)}
            </Text>
            <Text style={styles.strategyTicker}>•</Text>
            <Text
              style={styles.strategyTicker}>{`${item.execution.action}`}</Text>
          </View>
        </View>

        {/* Status and amount */}
        <View style={{alignItems: 'center', gap: 8}}>
          <Text
            style={[styles.notificationText]}>{`$ ${formattedBalance}`}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.execution.status === 'successful' ||
                  item.execution.status === 'pending'
                    ? themes.colors.successGreenPill
                    : themes.colors.MaximumRed,
              },
            ]}>
            <Text style={styles.statusOverViewText}>
              {item.execution.status.charAt(0).toUpperCase() +
                item.execution.status.slice(1)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <HeaderComponent title="Order History" />
        </View>

        <View style={styles.subHeaderContainer}>
          <Text
            style={
              styles.orderHistoryLength
            }>{`OrderHistory (${orderHistory.length})`}</Text>
          <Text style={styles.subHeaderText}>Track orders, order details</Text>
        </View>

        <View style={styles.divider}>
          <Text style={styles.mutualFundsText}>STRATEGIES</Text>
          <Text style={styles.statusText}>STATUS</Text>
        </View>

        {loading ? (
          <View style={styles.centeredContainer}>
            <Loader onlyLoader={true} />
          </View>
        ) : orderHistory.length > 0 ? (
          <FlatList
            data={orderHistory}
            renderItem={renderOrderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View>
              <SvgUri
                uri={
                  'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/noOrderHistory.svg'
                }
              />
            </View>
            <View
              style={{gap: 5, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.emptyText}>No Order History</Text>
              <Text style={styles.emptySubText}>
                Your strategies will appear here, updated in real time.
              </Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  subHeaderContainer: {
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  divider: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: themes.colors.SecondaryMain,
    height: height * 0.065,
  },
  mutualFundsText: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  statusText: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  orderHistoryLength: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  subHeaderText: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 8.5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statusOverViewText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  notificationContent: {
    gap: 10,
  },
  animation: {
    width: 58,
    height: 58,
    backgroundColor: themes.colors.primaryMain,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  strategyTicker: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'regular',
  },
  emptyContainer: {
    gap: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  emptySubText: {
    width: width * 0.65,
    color: themes.colors.neutralN500,
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginTop: 5,
    textAlign: 'center',
  },
});
