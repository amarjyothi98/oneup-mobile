/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Platform} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {SvgUri} from 'react-native-svg';
import {Icon} from 'react-native-paper';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {AxiosResponse} from 'axios';
import {authenticatedPost} from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GlobalNavigationProp} from '../../../../App';

const {width} = Dimensions.get('window');

// Define the type for the route parameters
type InvestmentThemeScreenRouteProp = RouteProp<
  {
    InvestmentThemeScreen: {userMessage: string};
  },
  'InvestmentThemeScreen'
>;

// UserMessageBubble component
const UserMessageBubble = ({message}: {message: string}) => (
  <View style={styles.userMessageBubble}>
    <Text style={styles.userMessageText}>{message}</Text>
  </View>
);

// BotMessageBubble component
const BotMessageBubble = ({
  iconUri,
  message,
  isLoading,
}: {
  iconUri: string;
  message: string;
  isLoading: boolean;
}) => (
  <View style={styles.botMessageContainer}>
    <View style={styles.iconAndLoaderContainer}>
      <SvgUri uri={iconUri} width={40} height={40} style={styles.botIcon} />
      {isLoading && (
        <LottieView
          source={{
            uri: 'https://lottie.host/d81f167f-fb79-4b67-8898-1e0a71d93a43/7UFlhgc7id.json',
          }}
          autoPlay
          loop
          style={styles.loaderAnimation}
        />
      )}
    </View>
    <Text style={styles.botMessageText}>{message}</Text>
  </View>
);

// Main ThematicDetailScreen component
export const InvestmentThemeScreen = () => {
  const route = useRoute<InvestmentThemeScreenRouteProp>();
  const {userMessage} = route.params;
  const [getAIMessage, setAIMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigate = useNavigation<GlobalNavigationProp>();
  const [relatedTickers, setRelatedTickers] = useState<any[]>([]);
  const [stocksData, setStocksData] = useState<any[]>([]);
  const [ticker, setTicker] = useState<string>('');
  const [name, setName] = useState<string>('');

  // AI bot answer
  const handleAIChat = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/ai/v4-chat',
        {
          question: userMessage,
        },
      );
      if (res.data && res.data.reason) {
        console.log(JSON.stringify(res.data, null, 2));
        setIsLoading(false);
        simulateTyping(res.data.reason);
        setTicker(res.data.theme);
        setRelatedTickers(res?.data?.relatedTickers);
        setName(res?.data?.name);
      }
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while getting result',
      });
    }
  };

  const handleClick = () => {
    if (stocksData && stocksData.length > 0) {
      navigate.navigate('StrategySelectionLoader', {
        code: '00000000000000000000000',
        ticker: ticker,
        data: stocksData,
        userMessage: userMessage,
        stocksData: stocksData,
        name,
      });
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [getAIMessage, isLoading]);

  const simulateTyping = (text: string) => {
    let index = 0;
    const typingSpeed = 20;
    const charsPerFrame = 6;
    let messageBuffer = '';

    const typeNextChar = () => {
      if (index < text.length) {
        messageBuffer += text.substring(index, index + charsPerFrame);
        setAIMessage(messageBuffer);
        index += charsPerFrame;
        setTimeout(typeNextChar, typingSpeed);
      }
    };

    setAIMessage('');
    typeNextChar();
  };

  useEffect(() => {
    if (userMessage) {
      handleAIChat();
    }
  }, [userMessage]);

  useEffect(() => {
    if (relatedTickers && relatedTickers.length > 0) {
      handleTickers();
      console.log('calling fun');
    }
  }, [relatedTickers]);

  const handleTickers = async () => {
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/ai/portfolio-builder',
        {
          tickers: relatedTickers,
        },
      );
      if (res.data && res.data.stocks) {
        setStocksData(res.data.stocks);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while getting portfolio tickers',
      });
    }
  };
  console.log('stock data for ai', stocksData?.map((stock) => ({ticker: stock.ticker, upside: stock.upside ?? 0})));

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderComponent title={'Your Investment Theme'} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* User Message */}
            <UserMessageBubble message={userMessage} />

            {/* Bot Message with typing animation */}
            <BotMessageBubble
              iconUri={
                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneUpHomePageLogo.svg'
              }
              message={getAIMessage}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>

        {/* Call to Action at the Bottom */}
        <View style={styles.callToActionContainer}>
          {/* <Text style={styles.investPrompt}>How can top minds help you?</Text> */}
          <TouchableWithoutFeedback onPress={handleClick}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.gradientBackground]}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text style={styles.ctaButtonText}>
                  Discover Your Portfolio
                </Text>
                <Icon
                  source="arrow-right"
                  size={20}
                  color={themes.colors.white}
                />
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  userMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(55, 65, 81, 0.65)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    borderRadius: 20,
    marginTop: 20,
    maxWidth: '80%',
    fontFamily: themes.fonts.fontFamily,
  },
  userMessageText: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  gradientBackground: {
    width: width * 0.92,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
  iconAndLoaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    marginLeft: 5,
  },
  loaderAnimation: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  botIcon: {
    marginRight: 10,
    marginTop: 10,
  },
  botMessageText: {
    color: themes.colors.white,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
  },
  typingText: {
    color: themes.colors.neutralN500,
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    marginTop: 10,
    paddingHorizontal: 15,
    fontFamily: themes.fonts.fontFamily,
  },
  callToActionContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 25 : 40,
    // borderTopColor: themes.colors.gray700,
    // borderTopWidth: 1,
  },
  investPrompt: {
    textAlign: 'center',
    color: themes.colors.alabaster,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 21,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
  ctaButtonText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    marginRight: 8,
    fontFamily: themes.fonts.fontFamily,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
});
