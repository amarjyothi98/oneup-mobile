import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {GlobalNavigationProp} from '../../../App';
import {Icon} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {themes} from '../../1up/theme/theme';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export const HeaderComponent = ({title}: any) => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const inset = useSafeAreaInsets();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.header,
        Platform.OS === 'ios'
          ? {paddingTop: inset.top}
          : {paddingTop: inset.top + 20},
      ]}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Icon source="arrow-left" size={24} color="#FFFFFF" />
      </TouchableWithoutFeedback>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: themes.colors.white,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    opacity: 1,
    fontFamily: themes.fonts.fontFamily,
    marginLeft: 10,
  },
});
