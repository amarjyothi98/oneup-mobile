/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {themes} from '../../../1up/theme/theme';
import {useNavigation} from '@react-navigation/native';
import {GlobalNavigationProp} from '../../../../App';
import {SvgUri} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AxiosResponse} from 'axios';
import {authenticatedPost, AuthStatus} from '../../../1up/utils/api';
import {useData} from '../../../1up/provider/data';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

export const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<GlobalNavigationProp>();
  const inset = useSafeAreaInsets();
  const {setAuthStatus} = useData();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    navigation.navigate('Signin');
  };

  const handleSingup = () => {
    if (email && password && firstName && lastName) {
      setIsLoading(true);
      handleSignupCall();
    }
  };

  const handleSignupCall = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/auth/default/user/mobile/signup',
        {
          firstName,
          lastName,
          email,
          password,
          phoneNumber: {},
        },
      );

      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'Sign up successful',
        });
        console.log('signup response', res.data);
        setAuthStatus(AuthStatus.ValidateAccess);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while signing up',
      });
      setIsLoading(false);
    }
  };

  const handleDocumetnLinkPress = (url: string, name: string) => {
    Platform.OS === 'android' && name === 'OneUp Terms of Use'
      ? Linking.openURL(url)
      : navigation.navigate('LegalDocumentsWebview', {url: url, name: name});
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <ScrollView
        style={[
          styles.content,
          {
            paddingTop: inset.top,
          },
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
        <Text style={styles.title}>Register</Text>

        <Text style={styles.label}>
          First Name <Text style={styles.required}>*</Text>
        </Text>
        <RNTextInput
          placeholder="Enter here"
          value={firstName}
          onChangeText={text => setFirstName(text)}
          style={styles.input}
          placeholderTextColor={themes.colors.neutralN500}
        />

        <Text style={styles.label}>
          Last Name <Text style={styles.required}>*</Text>
        </Text>
        <RNTextInput
          placeholder="Enter here"
          value={lastName}
          onChangeText={text => setLastName(text)}
          style={styles.input}
          placeholderTextColor={themes.colors.neutralN500}
        />

        <Text style={styles.label}>
          Your email <Text style={styles.required}>*</Text>
        </Text>
        <RNTextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          placeholderTextColor={themes.colors.neutralN500}
        />

        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <RNTextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            placeholderTextColor={themes.colors.neutralN500}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Icon
              source={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={themes.colors.neutralN500}
            />
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={handleSingup}>
          <LinearGradient
            colors={['#4451ED', '#5521B5']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.gradientBackground]}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {isLoading ? (
                <ActivityIndicator color={themes.colors.white} size="small" />
              ) : (
                <Text style={styles.signupText}>Register Now</Text>
              )}
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.continueWith}>Or continue with</Text>

        <View style={styles.socialIcons}>
          <TouchableOpacity
            style={[styles.iconButton, {backgroundColor: '#fff'}]}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/googleAuthLogo.svg'
              }
              width={18}
              height={18}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/appleAuthLogo.svg'
              }
              width={18}
              height={18}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, {backgroundColor: '#006FFD'}]}>
            <SvgUri
              uri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/linkedinAuthLogo.svg'
              }
              width={18}
              height={18}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.termsAndCondContainer}>
          <Text style={styles.termAndCondText}>
            By creating an account, you agree to our{' '}
          </Text>
          <TouchableWithoutFeedback
            onPress={() =>
              handleDocumetnLinkPress(
                'https://app.oneupinvest.com/pdfs/Terms%20&%20Conditions.pdf',
                'Terms & Conditions',
              )
            }>
            <Text style={[styles.tcText, {lineHeight: 18}]}>
              Terms & Conditions
            </Text>
          </TouchableWithoutFeedback>
          <Text style={styles.termAndCondText}>
            and have read and understood the{' '}
          </Text>
          <TouchableWithoutFeedback
            onPress={() =>
              handleDocumetnLinkPress(
                'https://app.oneupinvest.com/pdfs/Privacy%20Policy.pdf',
                'Privacy Policy',
              )
            }>
            <Text style={[styles.tcText, {lineHeight: 18}]}>
              Privacy Policy
            </Text>
          </TouchableWithoutFeedback>
          <Text style={styles.termAndCondText}>.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: 1900,
  },
  content: {
    flex: 1,
    padding: 20,
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
  input: {
    marginTop: 8,
    backgroundColor: themes.colors.SecondaryMain,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: themes.colors.white,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 8,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: themes.colors.SecondaryMain,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: themes.colors.white,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    color: themes.colors.neutralN500,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    lineHeight: 21,
  },
  signInText: {
    color: themes.colors.foundationSecondary,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    lineHeight: 21,
  },
  continueWith: {
    color: themes.colors.neutralN500,
    textAlign: 'center',
    marginVertical: 15,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '300' : 'regular',
    lineHeight: 18,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  label: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginTop: 20,
    fontFamily: themes.fonts.fontFamily,
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
  signupText: {
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  termsAndCondContainer: {
    width: 362,
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 200,
  },
  termAndCondText: {
    fontSize: 12,
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.gray400,
    lineHeight: 18,
  },
  tcText: {
    textDecorationLine: 'underline',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.gray400,
  },
});
