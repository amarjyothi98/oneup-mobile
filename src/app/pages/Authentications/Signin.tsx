/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';
import { themes } from '../../../1up/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { GlobalNavigationProp } from '../../../../App';
import { SvgUri } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AxiosResponse } from 'axios';
import { authenticatedPost, AuthStatus } from '../../../1up/utils/api';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useData } from '../../../1up/provider/data';
import { LoaderWithGradient } from '../../components/LoaderWithGradient';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'react-native-linear-gradient';
import LinkedInAuth from '../../../1up/auth/LinkedIn';
import { SignInButton } from '../../../1up/auth/GoogleClient';

const { height } = Dimensions.get('window');

export const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<GlobalNavigationProp>();
  const inset = useSafeAreaInsets();
  const { setAuthStatus, authStatus } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (authStatus === AuthStatus.AuthRequired) {
      setShowLoader(false);
    }
  }, [authStatus]);

  const handleSigninCall = async () => {
    setIsLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/auth/default/user/mobile/login',
        {
          email,
          password,
          rememberMe: true,
        },
      );
      if (res.data) {
        setAuthStatus(AuthStatus.ValidateAccess);
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Invalid username or password. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return showLoader ? (
    <LoaderWithGradient />
  ) : (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.4, y: 0.8 }}
      style={styles.container}>
      <ScrollView
        style={[
          styles.content,
          Platform.OS === 'ios'
            ? { paddingTop: inset.top }
            : { paddingTop: inset.top + 30 },
        ]}>
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
        <Text style={styles.title}>Sign in to our platform</Text>

        <Text style={styles.label}>
          Your email <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input]}
          placeholderTextColor={themes.colors.neutralN500}
        />

        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.passwordInput]}
            placeholderTextColor={themes.colors.neutralN500}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Icon
              source={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color={themes.colors.neutralN500}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={handleSigninCall}>
          <LinearGradient
            colors={['#4451ED', '#5521B5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.gradientBackground]}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {isLoading ? (
                <ActivityIndicator color={themes.colors.white} size="small" />
              ) : (
                <Text style={styles.signinText}>Sign In</Text>
              )}
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Not registered? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.createAccount}>Create account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.continueWith}>Or continue with</Text>

        {/* Social Icons */}
        <View style={styles.socialIcons}>
          <SignInButton />
          <TouchableWithoutFeedback style={styles.iconButton}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/appleAuthLogo.svg'
              }
              width={18}
              height={18}
            />
          </TouchableWithoutFeedback>
          <LinkedInAuth />
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
    alignContent: 'center',
    marginTop: height * 0.05,
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
    color: themes.colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: themes.fonts.fontFamily,
  },
  label: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginTop: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: themes.colors.SecondaryMain,
    color: themes.colors.white,
    padding: 10,
    marginTop: 8,
    height: 42,
    borderRadius: 5,
  },
  passwordContainer: {
    position: 'relative',
    marginTop: 8,
  },
  passwordInput: {
    backgroundColor: themes.colors.SecondaryMain,
    color: themes.colors.white,
    padding: 10,
    height: 42,
    borderRadius: 5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  errorInput: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  forgotText: {
    color: themes.colors.foundationSecondary,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  registerText: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
  },
  createAccount: {
    color: themes.colors.foundationSecondary,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
  },
  continueWith: {
    color: themes.colors.neutralN500,
    textAlign: 'center',
    marginVertical: 15,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    lineHeight: 18,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: themes.fonts.fontFamily,
  },
  iconButton: {
    backgroundColor: themes.colors.backish,
    padding: 10,
    borderRadius: 30,
    marginHorizontal: 10,
    width: 44,
    height: 44,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
});
