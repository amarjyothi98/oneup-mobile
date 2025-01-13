/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { themes } from '../../../1up/theme/theme';
import { HeaderComponent } from '../../components/header';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModalWithOptions } from '../../components/ModalWithOptions';
import { useNavigation } from '@react-navigation/native';
import { GlobalNavigationProp } from '../../../../App';
import { useData } from '../../../1up/provider/data';
import { AxiosResponse } from 'axios';
import { authenticatedDelete, AuthStatus } from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export const ProfileDetails = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const [isModalVisible, setModalVisible] = useState(false);
  const { user, setAuthStatus } = useData();

  const handleAccountSubSectionPress = (destination: any) => {
    switch (destination) {
      case 'AccountDetails':
        navigation.navigate('AccountDetails');
        break;
      case 'ChangePassword':
        navigation.navigate('ChangePassword');
        break;
      case 'FrequentlyAskedQuestions':
        navigation.navigate('FrequentlyAskedQuestions');
        break;
      case 'CustomerSupport':
        navigation.navigate('CustomerSupport');
        break;
      case 'DeleteAccount':
        setModalVisible(true);
        break;
      default:
        console.log('Account Subsection Pressed with wrong destination value');
        break;
    }
  };

  const handleDeleteAccountPress = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedDelete(
        '/webV1/trading/deleteUser',
      );
      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'Account deleted successfully',
        });
        setAuthStatus(AuthStatus.AuthRequired);
        console.log('signup response', res.data);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while deleting account',
      });
    }
  };

  // segreted function for subsections
  const renderSectionItem = ({
    svgUri,
    mainText,
    subText,
    isDeleteAccountOption,
    destination,
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
            isDeleteAccountOption
              ? styles.deleteAccountContainer
              : styles.mainSubContainer
          }>
          <Text
            style={
              isDeleteAccountOption
                ? [styles.deleteAccountText]
                : styles.mainText
            }>
            {mainText}
          </Text>
          {!isDeleteAccountOption && (
            <Text style={styles.subText}>{subText}</Text>
          )}
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderComponent title="My Profile" />
        </View>

        {/* Account Image and details button section */}
        <View style={styles.accountContainer}>
          {/* Account Image */}
          <View style={styles.accountImage}>
            {user?.userData.profileImage ? (
              <Image
                source={{ uri: user?.userData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Text
                style={
                  styles.accountImageText
                }>{`${user?.userData.firstName[0].toUpperCase()}${user?.userData.lastName[0].toUpperCase()}`}</Text>
            )}
          </View>

          {/* Account Name */}
          <Text style={styles.accountNameText}>
            {user?.userData.firstName} {user?.userData.lastName}
          </Text>
        </View>

        {/* Account Subsection with options */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Refer and Earn */}
          <View style={styles.referAndEarn}>
            {/* Image and text */}
            <View style={{ flexDirection: 'row', gap: 15 }}>
              {/* Image */}
              <View style={styles.accountSubsectionImageBox}>
                <SvgUri
                  uri={
                    'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/referAndEarn.svg'
                  }
                />
              </View>

              {/* text and subtext */}
              <View style={styles.referAndEarnText}>
                <Text style={styles.mainText}>Refer & Earn</Text>
                <Text style={styles.subText}>Invite friends on Oneup</Text>
              </View>
            </View>

            {/* Button */}
            <View style={styles.inviteButton}>
              <TouchableWithoutFeedback style={styles.referAndEarnButton}>
                <SvgUri
                  uri={
                    'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/comingSoon.svg'
                  }
                  style={styles.comingSoon}
                />
                <SvgUri
                  uri={
                    'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/inviteButtonIcon.svg'
                  }
                />
                <Text style={styles.inviteButtonText}>INVITE</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>

          {/* Account details */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/AccountTabActive.svg',
            mainText: 'Account Details',
            subText: 'View and Edit Your Account Information',
            isDeleteAccountOption: false,
            destination: 'AccountDetails',
          })}

          {/* Chnage Password */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/changePassword.svg',
            mainText: 'Change Password',
            subText: 'Change, reset and manage your old password',
            isDeleteAccountOption: false,
            destination: 'ChangePassword',
          })}

          {/* Frequently Asked question */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/faqs.svg',
            mainText: 'Frequently Asked Questions',
            subText: 'Find all platform relates FAQ’s',
            isDeleteAccountOption: false,
            destination: 'FrequentlyAskedQuestions',
          })}

          {/* customer support */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/customerSupport.svg',
            mainText: 'Customer Support',
            subText: 'Contact us via Query',
            isDeleteAccountOption: false,
            destination: 'CustomerSupport',
          })}

          {/* Delete Account */}
          {renderSectionItem({
            svgUri:
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/deleteAccount.svg',
            mainText: 'Delete Account',
            subText: '',
            isDeleteAccountOption: true,
            destination: 'DeleteAccount',
          })}
        </ScrollView>
      </View>

      {/* Centered Modal to delete account */}
      <ModalWithOptions
        visible={isModalVisible}
        onBackdropShouldClose={false}
        isTitlePresent={true}
        isDeleteButton={true}
        setVisible={setModalVisible}
        onPress={handleDeleteAccountPress}
        title="Delete Account?"
        description="ALERT: This action can’t be undone"
        svgUri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/deleteAccount.svg'
        }
        secondBtnText="Delete"
        firstBtnText="Go Back"
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
  accountContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 25,
    gap: 10,
  },
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  accountImage: {
    width: 64,
    height: 64,
    borderRadius: 40,
    borderColor: themes.colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themes.colors.profilePageImageBackground,
  },
  accountImageText: {
    color: themes.colors.white,
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
  },
  accountNameText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
    textAlign: 'center',
  },
  accountDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountDetailsText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    color: themes.colors.alabaster,
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
  inviteButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  comingSoon: {
    position: 'absolute',
    zIndex: 999,
  },
  referAndEarnButton: {
    borderRadius: 6,
    backgroundColor: themes.colors.lavender,
    width: 85,
    height: 29,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteButtonText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.egyptianBlue,
  },
  referAndEarnText: {
    textAlign: 'center',
    alignSelf: 'center',
    gap: 5,
    width: width * 0.45,
  },
  mainSubContainer: {
    width: width * 0.75,
    gap: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  deleteAccountContainer: {
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
  deleteAccountText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.fireOpal,
  },
});
