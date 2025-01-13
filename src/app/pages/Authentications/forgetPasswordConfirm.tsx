import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Platform} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {GlobalNavigationProp} from '../../../../App';
import {HeaderComponent} from '../../components/header';
import {themes} from '../../../1up/theme/theme';
import {SvgUri} from 'react-native-svg';
import {ForgetPasswordConfirmProps} from '../../types/types';
import Toast from 'react-native-toast-message';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

export const ForgotPasswordConfirm = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const route =
    useRoute<RouteProp<{params: ForgetPasswordConfirmProps}, 'params'>>();
  const {email} = route?.params;

  console.log('email', email);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinuePress = async () => {
    setIsLoading(true);
    if (newPassword.length < 8) {
      Toast.show({
        type: 'errorToast',
        text1: 'Password must be at least 8 characters',
      });
      setIsLoading(false);
    } else if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'errorToast',
        text1: 'Password does not match',
      });
      setIsLoading(false);
    } else {
      navigation.replace('ForgotPasswordOtpScreen', {
        email: email,
        newPassword: newPassword,
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
          <HeaderComponent title="Reset Password" />
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
          <Text style={styles.title}>Reset Your Password</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Please reset your password and reconfirm it
          </Text>

          <View>
            {/* New  Password */}
            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder="Must be min 8 characters"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              style={styles.input}
              placeholderTextColor={themes.colors.neutralN500}
            />

            {/* Confirm Password */}
            <Text style={styles.label}>Reconfirm New Password</Text>
            <TextInput
              placeholder="Reconfirm New Password"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              style={styles.input}
              placeholderTextColor={themes.colors.neutralN500}
            />
          </View>

          {/* Send OTP Button */}
          <TouchableWithoutFeedback onPress={handleContinuePress}>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  input: {
    marginTop: 8,
    backgroundColor: themes.colors.SecondaryMain,
    height: 42,
    borderRadius: 8,
    color: themes.colors.white,
    paddingLeft: 15,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
  },
  label: {
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginTop: 30,
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
