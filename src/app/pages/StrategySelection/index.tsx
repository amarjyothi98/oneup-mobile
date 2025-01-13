/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {SvgUri} from 'react-native-svg';
import {iconMapping} from '../../types/iconMapping';
import {LinearGradient} from 'react-native-linear-gradient';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {generateAiCodeAndTicker} from '../../../1up/utils/generateCode';
import {useNavigation} from '@react-navigation/core';
import {GlobalNavigationProp} from '../../../../App';

const {width} = Dimensions.get('window');

const optionsData = {
  style: ['Value', 'Growth', 'Dividend', 'Balanced', 'Momentum'],
  risk: ['Safety first', 'Moderate', 'Aggressive'],
  priorities: ['CO2 Footprint', 'Human Rights', 'Gender Equality', 'Fair Pay'],
  dealBreakers: [
    'No Alcohol',
    'No Animal Testing',
    'No Tobacco',
    'No Weapons',
    'No Pesticides',
    'No Nuclear',
    'No Fossil Fuel',
  ],
};

interface StockInfo {
  code: string;
  ticker: string;
}

export const StrategySelection = () => {
  const navigate = useNavigation<GlobalNavigationProp>();
  const [selectedOptions, setSelectedOptions] = useState<any>({
    style: '',
    risk: '',
    priorities: [],
    dealBreakers: [],
  });
  const [codeTicker, setCodeTicker] = useState<StockInfo>();

  const [selections, setSelections] = useState<any[]>([]);

  const mapRiskToAlternative = (risk: string) => {
    const riskMapping: Record<string, string> = {
      'Safety first': 'Diversified',
      Moderate: 'Balanced',
      Aggressive: 'Concentrated',
    };
    return riskMapping[risk] || risk;
  };

  const handleSelect = (section: any, option: any) => {
    if (section === 'style' || section === 'risk') {
      setSelectedOptions({
        ...selectedOptions,
        [section]: selectedOptions[section] === option ? '' : option,
      });
    } else {
      const currentSelections = selectedOptions[section];
      const isSelected = currentSelections.includes(option);
      setSelectedOptions({
        ...selectedOptions,
        [section]: isSelected
          ? currentSelections.filter((item: any) => item !== option)
          : [...currentSelections, option],
      });
    }
  };

  const convertToArray = () => {
    const combinedArray = [
      selectedOptions.style,
      mapRiskToAlternative(selectedOptions.risk),
      ...selectedOptions.priorities,
      ...selectedOptions.dealBreakers,
    ].filter(Boolean);

    return combinedArray;
  };

  useEffect(() => {
    if (selections && selections.length > 0) {
      const {code, ticker} = generateAiCodeAndTicker(selections);
      if (code && ticker) {
        setCodeTicker({
          code: code,
          ticker: ticker,
        });
      }
    }
  }, [selections]);

  useEffect(() => {
    if (codeTicker) {
      navigate.navigate('StrategySelectionLoader', {
        code: codeTicker.code,
        ticker: codeTicker.ticker,
        inclusion: selectedOptions?.priorities,
        exclusion: selectedOptions?.dealBreakers,
      });
    }
  }, [codeTicker]);

  const handleSelection = () => {
    if (selectedOptions && selectedOptions.style && selectedOptions.risk) {
      setSelections(convertToArray());
    }
  };

  console.log(selectedOptions.dealBreakers);

  const renderOptions = (section: any, options: any) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {options.map((option: any) => (
        <LinearGradient
          colors={['#4451ED', '#5521B5']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.5}}
          key={option}
          style={[styles.gradientBackground]}>
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              (section === 'style' || section === 'risk'
                ? selectedOptions[section] === option
                : selectedOptions[section].includes(option)) &&
                styles.optionButtonSelected,
            ]}
            onPress={() => handleSelect(section, option)}>
            <View style={styles.iconAndTextContainer}>
              {/* Icon View */}
              <View style={styles.iconView}>
                <SvgUri uri={iconMapping[option]} width={25} height={25} />
                {(section === 'style' || section === 'risk'
                  ? selectedOptions[section] === option
                  : selectedOptions[section].includes(option)) && (
                  <SvgUri
                    uri={
                      'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/SelectedTick.svg'
                    }
                    style={styles.rightIcon}
                    width={9}
                    height={9}
                  />
                )}
              </View>
              {/* Text View */}
              <Text style={styles.optionText}>{option}</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      ))}
    </ScrollView>
  );

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent title="Strategy Selection" />
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Build Your Perfect Portfolio</Text>
          <Text style={styles.subheading}>
            Unlock insights from 5,000+ fund managers.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's your style?</Text>
            <Text style={styles.subSectionTitle}>
              Match with pros who invest like you.
            </Text>
            {renderOptions('style', optionsData.style)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How bold are you?</Text>
            <Text style={styles.subSectionTitle}>
              Balance risk with leading investors.
            </Text>
            {renderOptions('risk', optionsData.risk)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Do you have priorities?</Text>
            <Text style={styles.subSectionTitle}>
              Support companies that align with your values.
            </Text>
            {renderOptions('priorities', optionsData.priorities)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Any deal-breakers?</Text>
            <Text style={styles.subSectionTitle}>
              Exclude industries against your values.
            </Text>
            {renderOptions('dealBreakers', optionsData.dealBreakers)}
          </View>
        </ScrollView>
        <View style={styles.submitContainer}>
          <TouchableWithoutFeedback onPress={handleSelection}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.gradientBtn]}>
              <Text style={styles.submitButtonText}>
                Discover Your Portfolio ➜
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </LinearGradient>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  heading: {
    fontSize: 17.5,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
    marginBottom: 8,
    marginTop: 15,
    fontFamily: themes.fonts.fontFamily,
    // lineHeight: 27,
  },
  subheading: {
    fontSize: 15,
    color: themes.colors.alabaster,
    marginBottom: 20,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    // lineHeight: 21,
    fontFamily: themes.fonts.fontFamily,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
    marginBottom: 5,
    fontFamily: themes.fonts.fontFamily,
  },
  subSectionTitle: {
    fontSize: 12,
    color: themes.colors.alabaster,
    marginBottom: 15,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    lineHeight: 18,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    width: width * 0.4,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: width * 0.03,
    flexDirection: 'column',
    backgroundColor: '#1C2137',
    margin: 1,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'space-between',
  },
  iconAndTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    flex: 1,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 13.6,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    marginTop: width * 0.05,
    alignSelf: 'flex-start',
  },
  rightIcon: {
    marginLeft: 'auto',
  },
  gradientBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 6,
    marginRight: 15,
  },
  optionButtonSelected: {
    borderColor: '#5B7AE3',
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  submitContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  gradientBtn: {
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
  submitButtonText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
  },
});

export default StrategySelection;
