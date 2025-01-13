import React, {useState, useRef, memo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {SvgUri} from 'react-native-svg';
import {GlobalNavigationProp} from '../../../../App';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Icon, TextInput} from 'react-native-paper';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {cardsData} from '../../types/cardsData';
import {LinearGradient} from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

// Reusable IconBadge component
const IconBadge = memo(() => (
  <View style={styles.iconBadgeContainer}>
    <SvgUri
      uri={
        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneUpHomePageLogo.svg'
      }
      width={56}
      height={56}
    />
  </View>
));

const ThematicCard = memo(
  ({
    icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <View style={styles.cardContainer}>
      <SvgUri uri={icon} width={24} height={24} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  ),
);

// ThematicSearchScreen Component
export const ThematicSearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<GlobalNavigationProp>();
  const [focused, setFocused] = useState(false);
  const isNavigatingRef = useRef(false);

  const handleSearch = () => {
    if (searchText) {
      isNavigatingRef.current = true;
      navigation.navigate('InvestmentThemeScreen', {
        userMessage: searchText,
      });
      setSearchText('');
    }
  };

  useFocusEffect(
    useCallback(() => {
      isNavigatingRef.current = false;
      setFocused(false);
    }, []),
  );

  const renderArrowButton = () => {
    return (
      <View style={styles.uparrow}>
        <TouchableWithoutFeedback onPress={handleSearch}>
          <Icon source="arrow-up" size={20} color={themes.colors.white} />
        </TouchableWithoutFeedback>
      </View>
    );
  };
  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent title={'Thematic Search'} />
        </View>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          {!focused && (
            <>
              <IconBadge />
              <View style={styles.cardsContainer}>
                {cardsData.map((card, index) => (
                  <ThematicCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputContainer}>
            {!focused && (
              <Text style={styles.bottomText}>
                Unlock the Power of Wall Street’s Titans
              </Text>
            )}
            <TouchableWithoutFeedback>
              <LinearGradient
                colors={['#3A8CFF', '#9354D7']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.gradientBorder}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Message OneUp"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.textInput}
                    placeholderTextColor={themes.colors.neutralN500}
                    onSubmitEditing={handleSearch}
                    right={<TextInput.Icon icon={renderArrowButton} />}
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      if (!isNavigatingRef.current) {
                        setFocused(false);
                      }
                    }}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    contentStyle={styles.textInput}
                  />
                </View>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
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
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingBottom: 15,
    borderBottomWidth: 1,
    fontFamily: themes.fonts.fontFamily,
  },
  iconBadgeContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardContainer: {
    width: '48%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: themes.colors.SecondaryMain,
    paddingVertical: 15,
    // paddingHorizontal: 20,
  },
  cardTitle: {
    marginTop: 10,
    color: themes.colors.white,
    // fontSize: 16,
    fontSize: Platform.OS === 'android' ? width * 0.04 : width * 0.04,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 24,
    fontFamily: themes.fonts.fontFamily,
  },
  cardDescription: {
    marginTop: 4,
    color: themes.colors.neutralN500,
    // fontSize: 12,
    fontSize: Platform.OS === 'android' ? width * 0.03 : width * 0.03,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 18,
    fontFamily: themes.fonts.fontFamily,
    marginBottom: 10,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 30,
  },
  gradientBorder: {
    borderRadius: 75,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.92,
    borderRadius: 75,
    backgroundColor: themes.colors.SecondaryMain,
    height: 48,
    margin: 1,
  },
  textInput: {
    flex: 1,
    color: themes.colors.white,
    backgroundColor: 'transparent',
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontSize: 14,
    borderRadius: 16,
    fontFamily: themes.fonts.fontFamily,
    paddingLeft: 10,
  },
  uparrow: {
    backgroundColor: themes.colors.primaryMain,
    borderRadius: 18,
    marginRight: 10,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themes.colors.white,
  },
  bottomText: {
    color: themes.colors.white,
    fontSize: 16,
    marginBottom: 15,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
    alignSelf: 'center',
    lineHeight: 27,
  },
});
