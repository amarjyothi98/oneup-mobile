import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { themes } from '../../1up/theme/theme';

const BasicLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={themes.colors.gray400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BasicLoader;
