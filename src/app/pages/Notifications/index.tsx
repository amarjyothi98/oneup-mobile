/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
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
import {LinearGradient} from 'react-native-linear-gradient';
import {Loader} from '../../components/Loader';

const {width} = Dimensions.get('window');

export const Notification = () => {
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoreNotifications();
  }, []);

  const loadMoreNotifications = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        'webV1/pages/notification/getAllNotifications',
      );
      if (res.data) {
        setNotifications([...notifications, ...res.data]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching notifications',
      });
    }
  };

  const renderNotificationItem = ({item}: any) => (
    <View style={styles.notificationItem}>
      <SvgUri
        uri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/insideNotificationIcon.svg'
        }
        width={46}
        height={46}
        style={styles.notificationIcon}
      />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{item.text}</Text>
        <Text style={styles.notificationTime}>{item.createdOn}</Text>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#4253F0', '#2A1452', '#111928']}
        locations={[0.0164, 0.2446, 0.3717]}
        start={{x: 0.7, y: 0}}
        end={{x: 0.4, y: 0.8}}
        style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <HeaderComponent title="Notifications" />
          </View>

          <View style={styles.topContainer}>
            <Text style={styles.notificationTopText}>Notifications</Text>
            <Text style={styles.subnotificationTopText}>
              Find all account related updates
            </Text>
          </View>

          {loading ? (
            <View style={styles.centeredContainer}>
              <Loader onlyLoader={true} />
            </View>
          ) : notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Notifications</Text>
              <Text style={styles.emptySubText}>
                No notification history currently. All new messages will be
                updated here.
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.40)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  topContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationTopText: {
    color: themes.colors.white,
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  subnotificationTopText: {
    color: themes.colors.gray400,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 36,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    gap: 8,
  },
  notificationContent: {
    marginLeft: 10,
    flex: 1,
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
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    marginBottom: 4,
  },
  notificationTime: {
    color: themes.colors.UnitedNationsBlue,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  emptyContainer: {
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
    width: Platform.OS === 'ios' ? width * 0.9 : width * 0.85,
    color: themes.colors.neutralN500,
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginTop: 5,
    textAlign: 'center',
  },
  notificationIcon: {
    alignSelf: 'center',
  },
});
