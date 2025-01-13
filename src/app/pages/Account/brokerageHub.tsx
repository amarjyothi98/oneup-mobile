/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {SvgUri} from 'react-native-svg';
import {AxiosResponse, HttpStatusCode} from 'axios';
import {authenticatedGet, authenticatedPost} from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {GlobalNavigationProp} from '../../../../App';
import {useNavigation} from '@react-navigation/core';
import {Loader} from '../../components/Loader';
import {Icon, Menu} from 'react-native-paper';
import {ModalWithOptions} from '../../components/ModalWithOptions';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

export const BrokerageHub = () => {
  const [brokerList, setBrokerList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<GlobalNavigationProp>();
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  useEffect(() => {
    loadAccountList();
    createUser();
  }, []);

  const loadAccountList = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        'webV1/trading/getAllAccounts',
      );
      if (res.data) {
        setBrokerList(res.data);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching broker list',
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      await authenticatedPost(
        'webV1/trading/createUser',
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDotsIconPress = (item: any) => {
    setVisibleMenu(visibleMenu === item.id ? null : item.id);
  };

  const handleViewDetails = (item: any) => {
    navigation.navigate('BrokerageAccountDetails', {itemData: item});
    setVisibleMenu(null);
  };

  const handleDisconnect = (item: any) => {
    setSelectedAccount(item);
    setModalVisible(true);
    setVisibleMenu(null);
  };

  const handleDisconnectAccount = async (data: any) => {
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        `webV1/trading/brokerage/removeBrokerage/${data.authId}`,
        {name: data.name},
      );
      if (res.status === HttpStatusCode.Ok) {
        Toast.show({
          type: 'successToast',
          text1: 'Account disconnected successfully',
        });
        setModalVisible(false);
        navigation.reset({index: 0, routes: [{name: 'AccountMainPage'}]});
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while disconnecting account',
      });
    }
  };

  const renderBrokerItem = ({item}: any) => {
    const formattedBalance = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(item.balance.amount);

    return (
      <View style={styles.brokerItem}>
        <View style={styles.brokerDetails}>
          <Image source={{uri: item.logo}} style={styles.brokerLogo} />
          <Text style={styles.brokerText}>{item.name}</Text>
        </View>

        <View style={styles.brokerBalanceContainer}>
          <Text style={styles.brokerText}>{`$${formattedBalance}`}</Text>
          <TouchableWithoutFeedback onPress={() => handleDotsIconPress(item)}>
            <Menu
              visible={visibleMenu === item.id}
              onDismiss={() => setVisibleMenu(null)}
              contentStyle={styles.menuContent}
              anchor={
                <Icon
                  source="dots-vertical"
                  color={themes.colors.white}
                  size={24}
                />
              }>
              <TouchableWithoutFeedback
                onPress={() => handleViewDetails(item)}
                style={styles.menuItem}>
                <Text style={styles.ViewDetails}>View Details</Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => handleDisconnect(item)}
                style={styles.menuItem}>
                <SvgUri
                  uri={
                    'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/deleteAccount.svg'
                  }
                  width={18}
                  height={18}
                  style={{alignSelf: 'center'}}
                />
                <Text style={styles.Text}>Disconnect</Text>
              </TouchableWithoutFeedback>
            </Menu>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {/* Apply LinearGradient to the background only */}
      <LinearGradient
        colors={['#4253F0', '#2A1452', '#111928']}
        locations={[0.0164, 0.2446, 0.3717]}
        start={{x: 0.7, y: 0}}
        end={{x: 0.4, y: 0.8}}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <HeaderComponent title="Brokerage Hub" />
        </View>

        <View style={styles.subHeaderContainer}>
          <Text style={styles.orderHistoryLength}>
            Connected Brokerage Accounts
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader onlyLoader={true} />
          </View>
        ) : brokerList.length > 0 ? (
          <View>
            <View style={styles.divider}>
              <Text style={styles.mutualFundsText}>BROKER NAME</Text>
              <Text style={styles.statusText}>ACCOUNT BALANCE</Text>
            </View>
            <FlatList
              data={brokerList}
              keyExtractor={(item, index) => `broker-${index}`}
              renderItem={renderBrokerItem}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.buttonContainerMain}>
              <TouchableWithoutFeedback
                style={styles.emptyButton}
                onPress={() => navigation.navigate('ConnectYourAccounts')}>
                <Icon
                  source="plus"
                  size={20}
                  color={themes.colors.UnitedNationsBlue}
                />
                <Text style={styles.emptyButtonText}>
                  Add Brokerage Account
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/noBrokerAccount.svg'
              }
            />
            <View style={styles.emptyTextContainer}>
              <Text style={styles.emptyText}>No Broker Linked!</Text>
              <Text style={styles.emptySubText}>
                Once linked, your strategies will appear here and update
                automatically.
              </Text>
            </View>
            <TouchableWithoutFeedback
              style={styles.emptyButton}
              onPress={() => navigation.navigate('ConnectYourAccounts')}>
              <Icon
                source="plus"
                size={20}
                color={themes.colors.UnitedNationsBlue}
              />
              <Text style={styles.emptyButtonText}>Add Brokerage Account</Text>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
      <ModalWithOptions
        visible={isModalVisible}
        onBackdropShouldClose={false}
        isTitlePresent={false}
        isDeleteButton={true}
        setVisible={setModalVisible}
        onPress={() => handleDisconnectAccount(selectedAccount)}
        isDisconnect={true}
        imageUri={selectedAccount?.logo}
        title=""
        description="Do you really want to disconnect the broker account?"
        svgUri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/logoutLogo.svg'
        }
        secondBtnText="Disconnect"
        firstBtnText="Go Back"
      />
    </View>
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
    borderBottomWidth: 1,
  },
  subHeaderContainer: {
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
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  brokerText: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  statusText: {
    color: themes.colors.neutralN500,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  orderHistoryLength: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  brokerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.neutralN500,
  },
  brokerDetails: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  brokerLogo: {
    width: 44,
    height: 44,
  },
  brokerBalanceContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyTextContainer: {
    alignItems: 'center',
    gap: 15,
  },
  emptyText: {
    color: themes.colors.white,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
  },
  emptySubText: {
    width: width * 0.82,
    color: themes.colors.neutralN500,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  buttonContainerMain: {
    alignItems: 'center',
    marginTop: 37,
  },
  emptyButton: {
    width: width * 0.65,
    height: height * 0.05,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.UnitedNationsBlue,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  emptyButtonText: {
    color: themes.colors.UnitedNationsBlue,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
  },
  menuContent: {
    backgroundColor: themes.colors.SecondaryMain,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
  },
  menuItem: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  Text: {
    color: '#F05252',
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    alignSelf: 'center',
  },
  ViewDetails: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'normal',
    marginBottom: 10,
  },
});
