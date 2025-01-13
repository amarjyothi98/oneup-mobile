/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {GlobalNavigationProp} from '../../../../App';
import {HeaderComponent} from '../../components/header';
import {themes} from '../../../1up/theme/theme';
import {SvgUri} from 'react-native-svg';
import {ForgetPasswordConfirmProps} from '../../types/types';
import {OtpInput, OtpInputRef} from 'react-native-otp-entry';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {AxiosResponse} from 'axios';
import {authenticatedPost} from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export const ForgotPasswordOtpScreen = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const otpInputRef = useRef<OtpInputRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [isResendButtonVisible, setIsResendButtonVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const route =
    useRoute<RouteProp<{params: ForgetPasswordConfirmProps}, 'params'>>();

  const {email, newPassword} = route?.params;

  console.log('email', email);
  console.log('newPassword', newPassword);

  useEffect(() => {
    let timer: any;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else {
      setIsResendButtonVisible(true);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  const handleOTPChange = (input: string) => {
    setText(input);
  };

  const handleSendOTPPress = async () => {
    setIsLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/auth/forgetPassword/validateAndChange',
        {
          email: email,
          newPassword: newPassword,
          otp: text,
        },
      );
      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'OTP Verified successfully',
        });
        navigation.navigate('ForgetPasswordSuccess');
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while verifying the OTP',
      });
      setIsLoading(false);
    }
  };

  const handleResendPress = async () => {
    setIsResendButtonVisible(false);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        'webV1/auth/forgetPassword/sendOtp',
        {
          email: email,
        },
      );
      if (res.data) {
        setCountdown(10);
        Toast.show({
          type: 'successToast',
          text1: 'OTP resend successfully',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while resending the OTP',
      });
    }
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <HeaderComponent title="OTP Verification" />
        </View>

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.oneuplogo}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneLogo.svg'
              }
              style={styles.logo}
            />
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/upLogo.svg'
              }
              style={styles.uplogo}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Enter confirmation code</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {`A 4-digit code was sent to  ${email}`}
          </Text>

          {/* OTP */}
          <View style={{alignSelf: 'center', gap: 10}}>
            <OtpInput
              ref={otpInputRef}
              autoFocus
              numberOfDigits={4}
              focusColor="green"
              focusStickBlinkingDuration={500}
              onTextChange={handleOTPChange}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
                keyboardType: 'number-pad',
                autoComplete: 'sms-otp',
                inputMode: 'numeric',
              }}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              }}
            />
          </View>

          {/* Countdown Timer or Resend Button */}
          <View style={styles.resendContainer}>
            {isResendButtonVisible ? (
              <TouchableOpacity onPress={handleResendPress}>
                <Text style={styles.resendText}>Resend code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend code in {countdown}s</Text>
            )}
          </View>

          {/* Send OTP Button */}
          <TouchableWithoutFeedback  onPress={handleSendOTPPress}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.gradientBackground]}>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={themes.colors.white} />
              ) : (
                <Text style={styles.buttonLabel}>Continue</Text>
              )}
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.primaryMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.40)',
  },
  content: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 30,
    height: 40,
    resizeMode: 'contain',
  },
  uplogo: {
    alignSelf: 'center',
    marginBottom: 20,
    height: 40,
    resizeMode: 'contain',
  },
  oneuplogo: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: themes.fonts.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    lineHeight: 24,
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: themes.fonts.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  otpContainer: {
    width: width * 0.65,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pinCodeContainer: {
    borderColor: themes.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePinCodeContainer: {
    borderColor: themes.colors.foundationSecondary,
    borderWidth: 1.5,
    shadowColor: themes.colors.primaryMain,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 6,
  },
  focusStick: {
    color: themes.colors.foundationSecondary,
    height: 20,
  },
  pinCodeText: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
  },
  filledPinCodeContainer: {
    borderColor: themes.colors.white,
  },
  resendContainer: {
    paddingTop: 60,
    paddingBottom: 15,
    alignItems: 'center',
  },
  resendText: {
    color: themes.colors.foundationSecondary,
    fontSize: 16,
  },
  timerText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
  },
  gradientBackground: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
});
