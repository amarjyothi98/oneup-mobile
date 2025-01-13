/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {SvgUri} from 'react-native-svg';
import {formatDateWithTime} from '../../../1up/utils/dateUtils';
import {useRoute} from '@react-navigation/core';
import {LinearGradient} from 'react-native-linear-gradient';
// import {Icon} from 'react-native-paper';

const {height} = Dimensions.get('window');

export const OrderHistoryDetails = () => {
  const route = useRoute<any>();
  const itemData = route?.params?.item;

  const formattedBalanceMain = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(itemData.execution.amount);

  const renderOrderItem = ({item}: any) => {
    const formattedBalance = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(item.amount);
    return (
      <View style={styles.tableRow}>
        <Text style={[styles.tableCellTextTicker, {width: '25%'}]}>
          {item.ticker}
        </Text>
        <View style={[styles.unitAmountContainer]}>
          <Text style={styles.unitsText}>{item.units.toFixed(3)}</Text>
          <Text
            style={styles.tableCellAmountText}>{`$${formattedBalance}`}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              width: '25%',
              backgroundColor:
                item.status === 'successful' || item.status === 'pending'
                  ? themes.colors.successGreenPill
                  : themes.colors.MaximumRed,
            },
          ]}>
          <Text style={styles.statusOverViewText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
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
        {/* Fixed Header */}
        <View style={styles.headerContainer}>
          <HeaderComponent title="Order Details" />
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.subContainer}>
            <View style={styles.amountAndSvg}>
              <SvgUri
                uri={
                  itemData.execution.status === 'successful' ||
                  itemData.execution.status === 'pending'
                    ? 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/orderHistorySuccess.svg'
                    : 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/orderFail.svg'
                }
              />
              <Text
                style={styles.amountText}>{`$${formattedBalanceMain}`}</Text>
            </View>

            <View style={styles.actionTimeStatus}>
              <Text
                style={
                  styles.actionText
                }>{`${itemData.execution.action} ORDER`}</Text>
              <Text style={styles.timeText}>
                {formatDateWithTime(itemData.execution.createdAt)}
              </Text>
              <Text style={styles.statusText}>
                Order Status -{' '}
                <Text
                  style={{
                    color:
                      itemData.execution.status === 'successful' ||
                      itemData.execution.status === 'pending'
                        ? themes.colors.successGreenPill
                        : themes.colors.MaximumRed,
                  }}>
                  {itemData.execution.status.charAt(0).toUpperCase() +
                    itemData.execution.status.slice(1)}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.historyTableContainer}>
            <Text style={styles.detailsText}>Details</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Ticker</Text>
                <Text style={styles.headerCell}>Unit/Amount</Text>
                <Text style={styles.headerCell}>Status</Text>
              </View>
              {itemData.orders && itemData.orders.length > 0 ? (
                <FlatList
                  data={itemData.orders}
                  renderItem={renderOrderItem}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    No order details available
                  </Text>
                </View>
              )}
            </View>

            {/* <View style={styles.helpContainer}>
              <Icon
                source="alert-circle-outline"
                size={24}
                color={themes.colors.neutralN500}
              />
              <Text style={styles.detailsText}>Need help?</Text>
            </View> */}
          </View>
        </ScrollView>
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
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: themes.colors.SecondaryMain,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  subContainer: {
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountAndSvg: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  amountText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 36,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
  },
  actionTimeStatus: {
    marginTop: 10,
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTableContainer: {
    paddingHorizontal: 15,
  },
  detailsText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
  },
  tableContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.SecondaryMain,
    marginTop: 10,
    paddingBottom: 5,
  },
  tableHeader: {
    height: height * 0.055,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: themes.colors.SecondaryMain,
    paddingHorizontal: 10,
  },
  headerCell: {
    textTransform: 'uppercase',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.neutralN500,
    fontSize: 12,
    fontFamily: themes.fonts.fontFamily,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.silverSand,
    justifyContent: 'space-between',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  noDataText: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  // helpContainer: {
  //   paddingVertical: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 10,
  // },
  actionText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
  },
  timeText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    color: themes.colors.neutralN500,
  },
  statusText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
  },
  historyTabelContainer: {
    paddingHorizontal: 15,
  },
  tableCell: {
    fontSize: 14,
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    textAlign: 'center',
  },
  unitAmountContainer: {
    gap: 2,
  },
  successStatus: {
    color: themes.colors.successGreenPill,
  },
  failedStatus: {
    color: themes.colors.MaximumRed,
  },
  tableCellTextTicker: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    alignSelf: 'center',
  },
  unitsText: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    alignSelf: 'flex-start',
  },
  tableCellAmountText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    alignSelf: 'flex-start',
  },
  statusBadge: {
    height: height * 0.03,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  statusOverViewText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  helpText: {
    alignSelf: 'center',
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
});
