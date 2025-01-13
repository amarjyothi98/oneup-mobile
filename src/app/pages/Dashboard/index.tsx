/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
import {CommonActions, useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import {GlobalNavigationProp} from '../../../../App';
import {themes} from '../../../1up/theme/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from 'react-native-paper';
import {SvgUri} from 'react-native-svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useData} from '../../../1up/provider/data';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

export const DashboardScreen = () => {
  const navigation = useNavigation<GlobalNavigationProp>();
  const inset = useSafeAreaInsets();
  const {user} = useData();

  const [pressedCard, setPressedCard] = useState<string | null>(null);

  const handleProfilePress = () => {
    navigation.navigate('ProfileDetails');
  };

  const handleThemeticSearch = () => {
    navigation.navigate('ThematicSearch');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notification');
  };

  const handleStrategySelection = () => {
    navigation.navigate('StrategySelection');
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#4253F0', '#2A1452', '#111928']}
        locations={[0.0164, 0.2446, 0.3717]}
        start={{x: 0.7, y: 0}}
        end={{x: 0.4, y: 0.8}}
        style={styles.container}>
        <View style={styles.content}>
          <View
            style={[
              styles.header,
              {paddingTop: Platform.OS === 'ios' ? inset.top : inset.top + 20},
            ]}>
            <Pressable onPress={() => { navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            })); }}>
              <SvgUri
                uri={
                  'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneUpHomePageLogo.svg'
                }
                width={34}
                height={34}
              />
            </Pressable>
            <View style={styles.iconContainer}>
              {/* Notification icon */}
              <TouchableWithoutFeedback onPress={handleNotificationPress}>
                <Icon
                  source="bell"
                  size={24}
                  color={themes.colors.neutralN500}
                />
              </TouchableWithoutFeedback>

              {/* Profile icon */}
              <TouchableWithoutFeedback
                style={styles.profileIcon}
                onPress={handleProfilePress}>
                {user?.userData?.profileImage ? (
                  <Image
                    source={{uri: user?.userData.profileImage}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.profileInitials}>
                    {`${user?.userData?.firstName[0].toUpperCase()}${user?.userData?.lastName[0].toUpperCase()}`}
                  </Text>
                )}
              </TouchableWithoutFeedback>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.message}>
                {`Let Wall Street’s Finest Build Your Wealth`}
              </Text>
              <Text style={styles.build}>
                {`From proven strategies to your unique ideas, the world’s top investors pick the stocks.`}
              </Text>
            </View>

            {/* Tailor Winning Strategies Card */}
            <LinearGradient
              colors={['#4253F0', '#9354D7']}
              start={{x: 0, y: 0}}
              end={{x: 0.2, y: 1}}
              style={[
                styles.gradientBorder,
                pressedCard !== 'strategy' && styles.normalBorder,
              ]}>
              <TouchableWithoutFeedback
                style={[
                  styles.card,
                  pressedCard === 'strategy' && styles.pressedCard,
                ]}
                onPressIn={() => setPressedCard('strategy')}
                onPressOut={() => setPressedCard(null)}
                onPress={handleStrategySelection}>
                <SvgUri
                  uri={
                    'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/WinningStrategies.svg'
                  }
                  width={64}
                  height={64}
                />
                <Text style={styles.cardTitle}>Tailor Winning Strategies</Text>
                <Text style={styles.cardDescription}>
                  Set up your customized high-performance portfolio in seconds.
                </Text>
              </TouchableWithoutFeedback>
            </LinearGradient>

            {/* Turn Ideas into Profits Card */}
            <LinearGradient
              colors={['#4253F0', '#9354D7']}
              start={{x: 0, y: 0}}
              end={{x: 0.2, y: 1}}
              style={[
                styles.gradientBorder,
                pressedCard !== 'thematic' && styles.normalBorder,
              ]}>
              <TouchableWithoutFeedback
                style={[
                  styles.card,
                  pressedCard === 'thematic' && styles.pressedCard,
                ]}
                onPressIn={() => setPressedCard('thematic')}
                onPressOut={() => setPressedCard(null)}
                onPress={handleThemeticSearch}>
                <SvgUri
                  uri={
                    'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/IdeasintoProfits.svg'
                  }
                  width={64}
                  height={64}
                />
                <Text style={styles.cardTitle}>Turn Ideas into Profits</Text>
                <Text style={styles.cardDescription}>
                  Leverage pro-level stock picks to turn your vision into
                  reality.
                </Text>
              </TouchableWithoutFeedback>
            </LinearGradient>
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
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
  profileImage: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  dashboard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: themes.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    backgroundColor: themes.colors.profilePageImageBackground,
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  profileInitials: {
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  message: {
    width: width * 0.723,
    paddingHorizontal: 20,
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontSize: width * 0.05,
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 20,
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  build: {
    width: width * 0.85,
    paddingHorizontal: 10,
    color: themes.colors.neutralN500,
    fontSize: width * 0.038,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    marginTop: 8,
    lineHeight: 24,
    marginBottom: 10,
    alignSelf: 'center',
    fontFamily: themes.fonts.fontFamily,
  },
  gradientBorder: {
    width: width * 0.92,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 15,
  },
  normalBorder: {
    borderWidth: Platform.OS === 'android' ? 1 : 0.6,
    borderColor: themes.colors.gray400,
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    paddingVertical: height * 0.03,
    alignItems: 'center',
    fontFamily: themes.fonts.fontFamily,
    backgroundColor: '#101828',
    paddingHorizontal: 30,
  },
  pressedCard: {
    margin: 2.5,
    backgroundColor: '#222838',
  },
  cardTitle: {
    color: themes.colors.white,
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginTop: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  cardDescription: {
    color: themes.colors.neutralN500,
    fontSize: width * 0.037,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
    fontFamily: themes.fonts.fontFamily,
  },
});
