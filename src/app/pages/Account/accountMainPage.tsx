/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/core';
import { GlobalNavigationProp } from '../../../../App';
import { themes } from '../../../1up/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModalWithOptions } from '../../components/ModalWithOptions';
import { useData } from '../../../1up/provider/data';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export const AccountMainPage = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const [isModalVisible, setModalVisible] = useState(false);
  const inset = useSafeAreaInsets();
  const { logout } = useData();
  const { user } = useData();

  const handleProfilePress = () => {
    navigation.navigate('ProfileDetails');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleLogoutPress = async () => {
    await logout();
    console.log('Logout Pressed');
  };

  const handleAccountSubSectionPress = (destination: any) => {
    switch (destination) {
      case 'Subscription':
        navigation.navigate('SubscriptionScreen');
        break;
      case 'BrokerageHub':
        navigation.navigate('BrokerageHub');
        break;
      case 'OrderHistory':
        navigation.navigate('OrderHistory');
        break;
      case 'LegalDocuments':
        navigation.navigate('LegalDocuments');
        break;
      case 'LogoutAccount':
        setModalVisible(true);
        break;
      default:
        console.log('Account Subsection Pressed with wrong destination value');
        break;
    }
  };

  const renderSectionItem = ({
    svgUri,
    mainText,
    subText,
    destination,
    isLogoutOption,
  }: any) => (
    <TouchableWithoutFeedback
      style={styles.referAndEarn}
      onPress={() => {
        handleAccountSubSectionPress(destination);
      }}>
      {/* Image and text */}
      <View style={{ flexDirection: 'row', gap: 15 }}>
        {/* Image */}
        <View style={styles.accountSubsectionImageBox}>
          <SvgUri uri={svgUri} />
        </View>

        {/* text and subtext */}
        <View
          style={
            isLogoutOption ? styles.logoutContainer : styles.mainSubContainer
          }>
          <Text
            style={
              isLogoutOption ? [styles.logoutAccountText] : styles.mainText
            }>
            {mainText}
          </Text>
          {!isLogoutOption && <Text style={styles.subText}>{subText}</Text>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.4, y: 0.8 }}
      style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: Platform.OS === 'ios' ? inset.top : inset.top + 20 },
          ]}>
          {/* Logo and Text */}
          <Pressable onPress={() => {
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            }));
          }} style={styles.dashboard}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneUpHomePageLogo.svg'
              }
              width={34}
              height={34}
            />
            <Text style={styles.headerText}>Account</Text>
          </Pressable>

          {/* Notification and Profile */}
          <View style={styles.iconContainer}>
            {/* for notification */}
            <TouchableWithoutFeedback onPress={handleNotificationPress}>
              <Icon source="bell" size={24} color={themes.colors.neutralN500} />
            </TouchableWithoutFeedback>

            {/* for profile */}
            <TouchableWithoutFeedback
              style={styles.profileIcon}
              onPress={handleProfilePress}>
              {user?.userData?.profileImage ? (
                <Image
                  source={{ uri: user?.userData.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Text
                  style={
                    styles.profileInitials
                  }>{`${user?.userData.firstName[0].toUpperCase()}${user?.userData.lastName[0].toUpperCase()}`}</Text>
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Account Subsection with options */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Subscription */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/subscriptionLogo.svg',
            mainText: 'Subscription',
            subText: 'Billing, subscriptions and payment details',
            isDeleteAccountOption: false,
            isLogoutOption: false,
            destination: 'Subscription',
          })}

          {/* Brokerage Hub */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/brokerageLogo.svg',
            mainText: 'Brokerage Hub',
            subText: 'View & manage connected broker accounts ',
            isDeleteAccountOption: false,
            isLogoutOption: false,
            destination: 'BrokerageHub',
          })}

          {/* Order History */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/orderHistory.svg',
            mainText: 'Order History',
            subText:
              'All your legal documents, terms & Conditions & privacy policy',
            isDeleteAccountOption: false,
            isLogoutOption: false,
            destination: 'OrderHistory',
          })}

          {/* Legal Documents */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/LegalDocumentsLogo.svg',
            mainText: 'Legal Documents',
            subText: 'Legal Documents',
            isDeleteAccountOption: false,
            isLogoutOption: false,
            destination: 'LegalDocuments',
          })}

          {/* Logout */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/logoutLogo.svg',
            mainText: 'Logout',
            subText: '',
            isDeleteAccountOption: false,
            isLogoutOption: true,
            destination: 'LogoutAccount',
          })}
        </ScrollView>
      </View>

      {/* Centered Modal to delete account */}
      <ModalWithOptions
        visible={isModalVisible}
        onBackdropShouldClose={false}
        isTitlePresent={true}
        isDeleteButton={false}
        setVisible={setModalVisible}
        onPress={handleLogoutPress}
        title="Logout?"
        description="Are you sure you want to logout from this account?"
        svgUri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/logoutLogo.svg'
        }
        firstBtnText="No, cancel"
        secondBtnText="Logout"
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
  },
  dashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  headerText: {
    color: themes.colors.white,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
    marginLeft: 15,
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
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  referAndEarn: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 20,
  },
  accountSubsectionImageBox: {
    width: 48,
    height: 48,
    borderRadius: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themes.colors.SecondaryMain,
  },
  mainSubContainer: {
    width: width * 0.75,
    gap: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  logoutContainer: {
    width: width * 0.75,
    paddingTop: 11,
  },
  mainText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
  },
  subText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    color: themes.colors.neutralN500,
  },
  logoutAccountText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.UnitedNationsBlue,
  },
});
