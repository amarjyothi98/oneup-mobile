import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {GlobalNavigationProp} from '../../../../App';
import {HeaderComponent} from '../../components/header';
import {themes} from '../../../1up/theme/theme';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SvgUri} from 'react-native-svg';
import {AxiosResponse} from 'axios';
import {authenticatedPost} from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<GlobalNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTPPress = async (emailToSendOtp: string) => {
    setIsLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/auth/forgetPassword/sendOtp',
        {
          email: emailToSendOtp,
        },
      );

      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'OTP sent successfully',
        });
        navigation.navigate('ForgotPasswordConfirm', {email: emailToSendOtp});
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while sending OTP',
      });
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderComponent title="Forgot Password" />
      </View>
      <ScrollView style={styles.content}>
        <View>
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
          <Text style={styles.title}>Forgot Password?</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            No worries! Just enter the email associated with your account.
          </Text>

          {/* Email Input */}
          <Text style={styles.label}>
            Your email <Text style={styles.required}>*</Text>
          </Text>

          <TextInput
            placeholder="name@example.com"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            placeholderTextColor={themes.colors.neutralN500}
          />

          {/* Send OTP Button */}
          <TouchableWithoutFeedback
            onPress={() => {
              handleSendOTPPress(email);
            }}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.gradientBackground]}>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={themes.colors.white} />
              ) : (
                <Text style={styles.buttonLabel}>Send One Time Password</Text>
              )}
            </LinearGradient>
          </TouchableWithoutFeedback>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember Password? </Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
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
    padding: 20,
    marginTop: height * 0.05,
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
    color: themes.colors.white,
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  subtitle: {
    color: themes.colors.neutralN500,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 21,
  },
  input: {
    marginTop: 10,
    backgroundColor: themes.colors.SecondaryMain,
    height: 42,
    borderRadius: 8,
    color: themes.colors.white,
    paddingLeft: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: themes.colors.foundationSecondary,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  footerText: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    lineHeight: 21,
  },
  footerLink: {
    color: themes.colors.UnitedNationsBlue,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    lineHeight: 21,
  },
  label: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginTop: 30,
  },
  required: {
    color: '#FF3B30',
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
