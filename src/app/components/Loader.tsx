import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import LottieView from 'lottie-react-native';
import {themes} from '../../1up/theme/theme';

export const Loader = ({onlyLoader = false}) => {
  return (
    <View style={styles.content}>
      {/* Lottie Animation */}
      <LottieView
        source={{
          uri: 'https://lottie.host/feb1ae75-7bb1-4b84-9e0a-4c5214d86e23/4L0cC8Hlhw.json',
        }}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Main Status Text */}
      {!onlyLoader && (
        <Text style={styles.title}>We’re setting things up for you…</Text>
      )}

      {/* Subtitle Text */}
      {!onlyLoader && (
        <Text style={styles.subtitle}>
          Please hold on while we build your strategy.
        </Text>
      )}

      {/* Additional Info */}
      {!onlyLoader && (
        <Text style={styles.info}>
          You'll  be redirected to your portfolio, where you can explore other strategies while we set everything up.
        </Text>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  animation: {
    width: 58,
    height: 58,
    marginBottom: 5,
  },
  title: {
    color: themes.colors.white,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 30,
  },
  subtitle: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    lineHeight: 21,
  },
  info: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
});
