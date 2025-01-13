/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {themes} from '../../1up/theme/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {GlobalNavigationProp} from '../../../App';
import Toast from 'react-native-toast-message';
import {AxiosResponse} from 'axios';
import {authenticatedGet} from '../../1up/utils/api';

const {width} = Dimensions.get('window');

const logos = [
  require('../../1up/images/adobe.png'),
  require('../../1up/images/apple.png'),
  require('../../1up/images/BHHS.png'),
  require('../../1up/images/black-rock.png'),
  require('../../1up/images/bridgewater.png'),
  require('../../1up/images/cisco.png'),
  require('../../1up/images/citadel.png'),
  require('../../1up/images/meta.png'),
  require('../../1up/images/tesla.png'),
  require('../../1up/images/nvidia.png'),
  require('../../1up/images/jp-morgan.png'),
  require('../../1up/images/unknown.png'),
];

const titles = [
  'Tapping into the strategies of Wall Street…',
  'Spotting high-conviction moves…',
  'Crafting your portfolio tailored to you…',
];

type StategySelectionLoaderProps = RouteProp<
  {
    StrategySelectionLoader: {
      code: string;
      ticker: string;
      data?: any;
      userMessage?: string;
      stocksData?: any;
      name?: string;
      inclusion?: any,
      exclusion?: any,
    };
  },
  'StrategySelectionLoader'
>;

const LoadingAnimation = () => {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);
  const [currentLogos, setCurrentLogos] = useState([0, 1, 2]);
  const [currentTitle, setCurrentTitle] = useState(0);
  const route = useRoute<StategySelectionLoaderProps>();
  const navigation = useNavigation<GlobalNavigationProp>();
  const {code, ticker, data, userMessage, name, inclusion, exclusion} = route.params;
  const [investDeatils, setInvestmentDetails] = useState<any[]>([]);
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2].name;

  useEffect(() => {
    const rotateAnimation = withRepeat(
      withTiming(360, {duration: 4000, easing: Easing.linear}),
      -1,
    );
    rotation.value = rotateAnimation;

    const progressAnimation = withRepeat(
      withTiming(100, {duration: 13000}),
      -1,
    );
    progress.value = progressAnimation;

    const logoInterval = setInterval(() => {
      setCurrentLogos(prev => {
        const nextIndex = (prev[0] + 1) % logos.length;
        return [
          nextIndex,
          (nextIndex + 1) % logos.length,
          (nextIndex + 2) % logos.length,
        ];
      });
    }, 2000);

    const titleInterval = setInterval(() => {
      setCurrentTitle(prev => (prev + 1) % titles.length);
    }, 2054);

    return () => {
      clearInterval(logoInterval);
      clearInterval(titleInterval);
    };
  }, []);

  const animatedRotationStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const animatedProgressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  useEffect(() => {
    let timer;
    if (prevRoute === 'StrategySelection') {
      console.log('inside', JSON.stringify(investDeatils, null, 2));
      timer = setTimeout(() => {
        navigation.replace('PortfolioDetailScreen', {
          code: code,
          ticker: ticker,
          strategyId: 'STRATEGY',
          data: investDeatils,
          userMessage: userMessage,
          stocksData: data,
          name,
          inclusion,
          exclusion,
        });
      }, 5000);
    } else {
      timer = setTimeout(() => {
        navigation.replace('PortfolioDetailScreen', {
          code: code,
          ticker: ticker,
          strategyId: 'STRATEGY',
          data: data,
          userMessage: userMessage,
          stocksData: data,
          name,
          inclusion,
          exclusion,
        });
      }, 5000);
    }

    // Clear the timer if the component is unmounted before the timeout
    return () => clearTimeout(timer);
  }, [investDeatils, data]);

  useEffect(() => {
    console.log(prevRoute);
    if (prevRoute === 'StrategySelection') {
      handleInvestmentDetails();
    }
  }, []);

  const handleInvestmentDetails = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedGet(
        `/webV1/pages/strategyManegement/strategyInsight/dashboard/stock?ticker=${ticker}&selectionCode=${code}`,
      );
      if (res.data) {
        setInvestmentDetails(res.data);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while fetching the portfolio holdings',
      });
    }
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.2284, y: 0.5}}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.logoContainer, animatedRotationStyle]}>
            {currentLogos.map((logoIndex, i) => (
              <View
                key={i}
                style={[
                  styles.logoWrapper,
                  {
                    top: i === 0 ? -50 : 50,
                    left: i === 1 ? -60 : i === 2 ? 60 : 0,
                  },
                ]}>
                <Image source={logos[logoIndex]} style={styles.logo} />
              </View>
            ))}
          </Animated.View>
        </View>
        <Text style={styles.title}>{titles[currentTitle]}</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBar, animatedProgressBarStyle]}>
            <LinearGradient
              colors={['#4253F0', '#9354D7']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradientProgress}
            />
          </Animated.View>
        </View>
        <Text style={styles.subtitle}>This may take a few seconds...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 125,
    borderWidth: 3.2,
    borderColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  logoWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: -65,
    marginLeft: -50,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: themes.colors.white,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
  },
  progressBarBackground: {
    width: width * 0.92,
    height: 6,
    backgroundColor: themes.colors.white,
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4253F0',
  },
  gradientProgress: {
    flex: 1,
    borderRadius: 2,
    flexDirection: 'row',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: Platform.OS === 'android' ? 'semibold' : '400',
    color: themes.colors.gray500,
    marginTop: 10,
  },
});

export default LoadingAnimation;
