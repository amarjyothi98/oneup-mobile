/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { themes } from '../../../1up/theme/theme';
import { HeaderComponent } from '../../components/header';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SvgUri } from 'react-native-svg';
import { Icon } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModalWithOptions } from '../../components/ModalWithOptions';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { authenticatedPost } from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import { GlobalNavigationProp } from '../../../../App';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

export const BrokerageAccountDetails = () => {
  const route = useRoute<any>();
  const item = route.params?.itemData;
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<GlobalNavigationProp>();

  const handleDisconnectAccount = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        `webV1/trading/brokerage/removeBrokerage/${item.authId}`,
        {
          name: item.name,
        },
      );
      if (res.status === HttpStatusCode.Ok) {
        Toast.show({
          type: 'successToast',
          text1: 'Account disconnected successfully',
        });
        setModalVisible(false);
        navigation.reset({ index: 0, routes: [{ name: 'AccountMainPage' }] });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while disconnecting account',
      });
    }
  };

  const handleItemNumberPress = (number: string) => {
    Clipboard.setString(number);
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.4, y: 0.8 }}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <HeaderComponent title="Brokerage Account Details" />
        </View>

        {/* Sub header */}
        <View style={styles.subHeaderContainer}>
          <Image source={{ uri: item.logo }} style={styles.brokerLogo} />
          <View>
            <Text style={styles.brokerText}>{item.name}</Text>
            <Text style={styles.brokerLink}>{item.website}</Text>
          </View>
        </View>

        {/* Status and ID */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Status</Text>
            <View style={styles.statusContainer}>
              <SvgUri
                uri={
                  item.status === 'ACTIVE'
                    ? 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/orderHistorySuccess.svg'
                    : 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/orderFail.svg'
                }
                width={26}
                height={26}
              />
              <Text style={styles.statusText}>
                {item.status === 'ACTIVE' ? 'VERIFIED' : 'INACTIVE'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Broker ID</Text>
            <View style={styles.idContainer}>
              <Text style={styles.idText}>{item.number}</Text>
              <TouchableOpacity
                style={[styles.copyIcon, { alignSelf: 'center' }]}
                onPress={() => {
                  handleItemNumberPress(item.number);
                }}>
                <Icon
                  source="content-copy"
                  size={19}
                  color={themes.colors.UnitedNationsBlue}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Disconnect Button */}
        <TouchableWithoutFeedback
          style={styles.disconnectButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.disconnectButtonText}>Disconnect Account</Text>
        </TouchableWithoutFeedback>
      </View>

      {/* Centered Modal to delete account */}
      <ModalWithOptions
        visible={isModalVisible}
        onBackdropShouldClose={false}
        isTitlePresent={true}
        isDeleteButton={true}
        setVisible={setModalVisible}
        onPress={handleDisconnectAccount}
        isDisconnect={true}
        imageUri={item.logo}
        title="Disconnect Account?"
        description="Are you sure you want to disconnect your broker account?"
        svgUri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/logoutLogo.svg'
        }
        secondBtnText="Disconnect"
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  brokerLogo: {
    width: 44,
    height: 44,
  },
  brokerText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  brokerLink: {
    color: themes.colors.SecondaryMain,
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: themes.colors.SecondaryMain,
    borderBottomWidth: 1,
  },
  labelText: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  statusContainer: {
    gap: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
    color: themes.colors.successGreenPill,
    fontSize: 18,
  },
  statusText: {
    color: themes.colors.white,
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    color: themes.colors.white,
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
  },
  copyIcon: {
    marginLeft: 8,
  },
  disconnectButton: {
    marginVertical: 30,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderColor: themes.colors.MaximumRed,
    borderWidth: 1,
    borderRadius: 8,
  },
  disconnectButtonText: {
    color: themes.colors.MaximumRed,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
});
