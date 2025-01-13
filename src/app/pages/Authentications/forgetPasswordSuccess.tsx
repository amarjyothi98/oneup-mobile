import React from 'react';
import {View, StyleSheet, Dimensions, Text, Platform} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon} from 'react-native-paper';
import {themes} from '../../../1up/theme/theme';
import {GlobalNavigationProp} from '../../../../App';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/core';

const {width} = Dimensions.get('window');

export const ForgetPasswordSuccess = () => {
  const navigation = useNavigation<GlobalNavigationProp>();

  const handleSignIn = () => {
    navigation.reset({index: 0, routes: [{name: 'Signin'}]});
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.containerGradient}>
      <View style={styles.content}>
        <SvgUri
          uri="https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/passReset.svg"
          style={styles.icon}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback onPress={handleSignIn}>
          <LinearGradient
            colors={['#4451ED', '#5521B5']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.gradientBackground]}>
            <Text style={styles.buttonLabel}>Back to Login</Text>
            <Icon source="arrow-right" size={20} color={themes.colors.white} />
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: width * 0.4,
    height: width * 0.4,
  },
  buttonContainer: {
    marginBottom: 35,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    marginRight: 5,
  },
  gradientBackground: {
    width: width * 0.85,
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
});
