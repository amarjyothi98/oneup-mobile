import React, {memo, useCallback} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {themes} from '../../1up/theme/theme';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SvgUri} from 'react-native-svg';
import {PortfolioScreen} from '../pages/Portfolio';
import {AccountMainPage} from '../pages/Account/accountMainPage';
import {DashboardScreen} from '../pages/Dashboard';

const tabBarIcon = ({
  focused,
  route,
}: {
  focused: boolean;
  route: {name: 'Dashboard' | 'Portfolio' | 'Account'};
}) => {
  const iconUriMap: {
    [key in 'Dashboard' | 'Portfolio' | 'Account']: {
      active: string;
      inactive: string;
    };
  } = {
    Dashboard: {
      active:
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/dashboardLogo.svg',
      inactive:
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/dahboardTabIcon.svg',
    },
    Portfolio: {
      active:
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/PortfolioTabActive.svg',
      inactive:
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/portfolioTabIcon.svg',
    },
    Account: {
      active:
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/AccountTabActive.svg',
      inactive:
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/accountLogo.svg',
    },
  };

  return (
    <View style={focused ? styles.iconBlock : null}>
      <SvgUri
        uri={
          focused
            ? iconUriMap[route.name].active
            : iconUriMap[route.name].inactive
        }
        style={focused ? styles.homeActive : styles.homeInactive}
      />
    </View>
  );
};

export const TabsNavigation = memo(() => {
  const Tab = createBottomTabNavigator();

  const getTabBarIcon = useCallback((props: any) => tabBarIcon({...props}), []);

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: themes.colors.white,
        tabBarInactiveTintColor: themes.colors.neutralN500,
        tabBarIcon: props => getTabBarIcon({...props, route}),
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{tabBarLabel: 'Portfolio'}}
      />
      <Tab.Screen
        name="Account"
        component={AccountMainPage}
        options={{tabBarLabel: 'Account'}}
      />
    </Tab.Navigator>
  );
});

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#111928',
    height: Platform.OS === 'android' ? '10%' : '11%',
    borderTopColor: themes.colors.SecondaryMain,
    paddingTop: Platform.OS === 'android' ? 5 : 10,
    borderTopWidth: 0.7,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: Platform.OS === 'android' ? 15 : 0,
  },
  iconBlock: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  homeActive: {
    width: 24,
    height: 24,
    tintColor: themes.colors.white,
  },
  homeInactive: {
    width: 24,
    height: 24,
    tintColor: themes.colors.neutralN500,
  },
});
