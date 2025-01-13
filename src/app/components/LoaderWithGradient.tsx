import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const loog = require('../../1up/images/tick.png');

export const LoaderWithGradient = () => {
  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.2284, y: 0.5}}
      style={styles.container}>
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
      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
});
