import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import React from 'react';
import {View, StyleSheet, Platform, ScrollView} from 'react-native';
import {GlobalNavigationProp} from '../../../../App';
import {themes} from '../../../1up/theme/theme';
import {SvgUri} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from 'react-native-paper';
import {LinearGradient} from 'react-native-linear-gradient';

type SuccessSubOrPassRouteProp = RouteProp<
  {SuccessSubOrPass: {successMessage?: string | null}},
  'SuccessSubOrPass'
>;

export const SuccessSubOrPass = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const inset = useSafeAreaInsets();
  const route = useRoute<SuccessSubOrPassRouteProp>();
  const {successMessage = null} = route?.params || {};

  const handleSignIn = () => {
    navigation.navigate('Signin');
  };

  const HandleInvesting = () => {};

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <ScrollView
        style={[
          styles.container,
          {
            paddingTop: inset.top,
          },
        ]}>
        <View style={styles.svgContainer}>
          <SvgUri
            uri={
              successMessage
                ? 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/SubscriptionSuccess.svg'
                : 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/passwordResetSuccess.svg'
            }
            style={styles.svgContainer}
          />
        </View>

        <Button
          mode="contained"
          style={styles.login}
          onPress={successMessage ? HandleInvesting : handleSignIn}>
          {successMessage ? 'Start Investing' : 'Back to Login'}
        </Button>
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
    justifyContent: 'space-between',
  },
  svgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    backgroundColor: themes.colors.foundationSecondary,
    borderRadius: 8,
    height: 42,
    marginBottom: Platform.OS === 'android' ? 20 : 25,
  },
});
