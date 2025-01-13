/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import {HeaderComponent} from '../../components/header';
import {themes} from '../../../1up/theme/theme';
import {PlanCard} from '../../components/PlanCards';
import ToggleSwitch from 'toggle-switch-react-native';
import {SvgUri} from 'react-native-svg';
import {AxiosResponse} from 'axios';
import {authenticatedGet} from '../../../1up/utils/api';
import {Subscripiton} from '../../types/types';
import Toast from 'react-native-toast-message';
import {subscriptionDateModified} from '../../../1up/utils/dateUtils';
import {useData} from '../../../1up/provider/data';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export const SubscriptionScreen = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState<Subscripiton[]>([]);
  const [isPurchased, setIspurchased] = useState(false);
  const {user} = useData();

  useEffect(() => {
    if (user?.userData?.planDetails) {
      setIspurchased(true);
    }
  }, [user]);

  const plans = [
    {
      title: 'Standard Tier',
      price: isYearly ? '$20' : '$25',
      freeTrial: true,
      description: 'Enjoy unlimited strategies',
      highlight: 'effortlessly tailored to you.',
      features: [
        'Personalize your strategy.',
        'Get portfolio updates via email.',
        'Automatic buying / selling / rebalancing.',
        'Advanced ESG & sustainable investing.',
        'Top managers expert picks & move alerts.',
        'Multiple broker integrations.',
        'Auto management across all strategies.',
        'Continuous tax-loss harvesting.',
        'Exclusive educational content.',
      ],
    },
  ];

  useEffect(() => {
    fetchSubscriptionList();
  }, []);

  const fetchSubscriptionList = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        '/webV1/stripe/subscription-list',
      );
      if (res.data) {
        setSubscriptionList(res.data);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching subscription list',
      });
    }
  };

  const renderInvoiceItem = ({item, index}: {item: any; index: number}) => {
    const isLastItem = index === subscriptionList.length - 1;

    return (
      <View
        style={[
          styles.row,
          isLastItem && {borderBottomEndRadius: 5, borderBottomLeftRadius: 5},
        ]}>
        <Text style={styles.planCell}>{item.planName}</Text>
        <Text style={styles.dateCell}>
          {subscriptionDateModified(item.billingDate)}
        </Text>
        <Text
          style={[
            styles.cell,
            item.status === 'active'
              ? styles.activeStatus
              : styles.cancelledStatus,
          ]}>
          {item.status.charAt(0).toUpperCase() +
            item.status.slice(1).toLowerCase()}
        </Text>
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
        <View style={styles.headerContainer}>
          <HeaderComponent title={'Subscription'} />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View>
                <Text style={styles.pricingTitle}>PRICING</Text>
                <Text style={styles.detailTitle}>
                  Grow Your Wealth with Transparent, Fee-Free Pricing.
                </Text>

                <View style={styles.toggleContainer}>
                  <Text style={[styles.subscriptionText, {paddingRight: 10}]}>
                    Monthly
                  </Text>
                  <ToggleSwitch
                    isOn={isYearly}
                    onColor={themes.colors.purple500}
                    offColor={themes.colors.purple500}
                    size="large"
                    onToggle={() => setIsYearly(!isYearly)}
                    thumbOnStyle={{
                      backgroundColor: themes.colors.gray800,
                      width: 28,
                      height: 28,
                    }}
                    thumbOffStyle={{
                      backgroundColor: themes.colors.gray800,
                      width: 28,
                      height: 28,
                    }}
                    trackOnStyle={{
                      width: 70,
                      height: 36,
                    }}
                    trackOffStyle={{
                      width: 70,
                      height: 36,
                    }}
                  />
                  <Text style={[styles.subscriptionText, {paddingLeft: 10}]}>
                    Yearly
                  </Text>
                </View>

                <View style={styles.saveBanner}>
                  <View style={styles.saveView}>
                    <Text style={styles.saveText}>Save Up to 20%</Text>
                  </View>
                  <View style={styles.saveBannerIcon}>
                    <SvgUri
                      uri={
                        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/Subscription_arrow.svg'
                      }
                      style={{transform: [{rotate: '-5deg'}]}}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.listContent}>
                {plans.map((plan, index) => (
                  <PlanCard
                    key={index}
                    title={plan.title}
                    price={plan.price}
                    description={plan.description}
                    features={plan.features}
                    isYearly={isYearly}
                    onPress={() => console.log(`Selected ${plan.title}`)}
                    isPurchased={isPurchased}
                  />
                ))}

                {user?.userData?.planDetails && (
                  <>
                    <Text style={styles.title}>Billing Details</Text>
                    <Text style={styles.subtitle}>
                      {subscriptionList.length} Invoices
                    </Text>

                    <View style={styles.headerRow}>
                      <Text style={styles.headerCell}>INVOICE ID</Text>
                      <Text style={styles.dateHeaderCell}>DATE</Text>
                      <Text style={styles.statusHeaderCell}>STATUS</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          }
          data={subscriptionList}
          renderItem={renderInvoiceItem}
          keyExtractor={item => item.billingDate.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          ListFooterComponent={
            user?.userData?.planDetails && (
              <View style={styles.btnCard}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel Package</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    lineHeight: 36,
    color: themes.colors.white,
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: themes.colors.neutralN500,
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
  },
  detailTitle: {
    fontSize: 14,
    color: themes.colors.neutralN500,
    marginVertical: 5,
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    lineHeight: 21,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  subscriptionText: {
    color: themes.colors.white,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  saveView: {
    backgroundColor: themes.colors.whitish,
    borderRadius: 30,
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },
  saveBanner: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: 25,
    marginBottom: 10,
  },
  saveBannerIcon: {
    marginTop: -17,
    marginLeft: 5,
  },
  saveText: {
    color: themes.colors.blueCTA,
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    color: themes.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: themes.colors.SecondaryMain,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 0,
    height: 50,
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: themes.colors.silverSand,
  },
  headerCell: {
    flex: 1,
    color: themes.colors.neutralN500,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'left',
    paddingLeft: 15,
    fontSize: width * 0.03,
    lineHeight: 18,
  },
  dateHeaderCell: {
    flex: 1,
    color: themes.colors.neutralN500,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'left',
    paddingLeft: 50,
    fontSize: width * 0.03,
    lineHeight: 18,
  },
  statusHeaderCell: {
    flex: 1,
    color: themes.colors.neutralN500,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'left',
    paddingLeft: 35,
    fontSize: width * 0.03,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
    padding: 10,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    marginHorizontal: 20,
    borderTopWidth: 0,
    borderTopEndRadius: 0,
    borderTopLeftRadius: 0,
  },
  cell: {
    flex: 1,
    color: themes.colors.neutralN500,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    fontSize: width * 0.0345,
    lineHeight: 21,
  },
  dateCell: {
    flex: 1,
    color: themes.colors.neutralN500,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 10,
  },
  planCell: {
    flex: 1,
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: width * 0.0345,
    lineHeight: 21,
  },
  activeStatus: {
    color: themes.colors.successgreen,
  },
  cancelledStatus: {
    color: themes.colors.fireOpal,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
  },
  pageText: {
    color: themes.colors.white,
  },
  pageNumber: {
    color: themes.colors.white,
    marginHorizontal: 4,
  },
  recordCount: {
    color: themes.colors.neutralN500,
    textAlign: 'center',
    marginVertical: 10,
  },
  payNowButton: {
    backgroundColor: '#4B9DFE',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 5,
    height: 41,
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 10,
    height: 41,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    marginBottom: 30,
  },
  btnCard: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: themes.colors.silverSand,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: 14,
    lineHeight: 21,
  },
});

export default SubscriptionScreen;
