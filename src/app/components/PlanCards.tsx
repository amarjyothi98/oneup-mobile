/* eslint-disable react-native/no-inline-styles */
// PlanCard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {themes} from '../../1up/theme/theme';
import {PlansCardProps} from '../types/types';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {LinearGradient} from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export const PlanCard = ({
  title,
  price,
  // description,
  features,
  isYearly,
  onPress,
  isPurchased,
}: PlansCardProps) => (
  <LinearGradient
    colors={['#3F83F8', '#9354D7']}
    start={{x: 0, y: 0}}
    end={{x: 0.2, y: 1}}
    style={styles.gradientBorder}>
    <View style={styles.planContainer}>
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{title}</Text>
        {!isYearly && (
          <View style={[styles.freeTrialBadge]}>
            <View style={styles.greenCircle} />
            <Text style={styles.freeTrialText}>Free Trial</Text>
          </View>
        )}
      </View>

      <View style={styles.planPrice}>
        {/* <Text style={styles.priceText}>
          <Text style={[styles.strokeText, {marginRight: 5}]}>$100</Text>
          {price}
        </Text> */}
        <View style={styles.priceView}>
          <Text style={styles.strokeText}>$100</Text>
          <Text style={styles.priceText}>{price}</Text>
        </View>
        <Text style={styles.perMonth} adjustsFontSizeToFit={true}>
          /month
        </Text>
      </View>
      <View>
        <Text style={styles.offerText}>
          LIMITED TIME OFFER (-{isYearly ? 80 : 75}% OFF)
        </Text>
      </View>
      <Text style={styles.description}>
        Enjoy unlimited strategies{' '}
        <Text style={styles.highlight}>effortlessly tailored to you.</Text>
      </Text>

      <View style={styles.featuresList}>
        {features &&
          features.length > 0 &&
          features.map((feature, index) => (
            <View style={styles.featureItem} key={index}>
              <Image source={require('../../1up/images/tick.png')} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
      </View>

      <TouchableWithoutFeedback onPress={onPress} disabled={isPurchased}>
        <LinearGradient
          colors={['#4451ED', '#5521B5']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.gradientBackground]}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.choosePlanButtonText}>
              {isPurchased ? 'Current Plan' : 'Choose Plan'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 10,
  },
  planContainer: {
    borderRadius: 10,
    padding: 20,
    margin: 2.5,
    backgroundColor: '#1B2233',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
  },
  planTitle: {
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontSize: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  freeTrialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themes.colors.green100,
    paddingHorizontal: 10,
    borderRadius: 7,
    height: 26,
  },
  greenCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: themes.colors.green500,
    marginRight: 8,
  },
  freeTrialText: {
    color: themes.colors.green800,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 18,
  },
  priceText: {
    fontSize: 36,
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 36,
  },
  strokeText: {
    fontSize: 36,
    color: themes.colors.gray400,
    textDecorationLine: 'line-through',
    textDecorationColor: themes.colors.gray400,
    fontFamily: themes.fonts.fontFamily,
    marginRight: 10,
    lineHeight: 36,
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  planPrice: {
    flexDirection: 'row',
    marginTop: 15,
  },
  perMonth: {
    fontSize: 15.5,
    color: themes.colors.neutralN500,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 24,
    marginTop: 8,
    paddingLeft: 5,
  },
  offerText: {
    fontSize: Platform.OS === 'android' ? 12 : 13,
    color: themes.colors.green400,
    lineHeight: 18,
    marginTop: 5,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  description: {
    color: themes.colors.neutralN500,
    fontSize: width * 0.04,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    lineHeight: 24,
    marginVertical: 10,
  },
  highlight: {
    color: themes.colors.blue400,
  },
  featuresList: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tickIcon: {
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
  },
  featureText: {
    marginLeft: 10,
    color: themes.colors.white,
    fontSize: 13.5,
    fontFamily: themes.fonts.fontFamily,
  },
  gradientBackground: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
  choosePlanButtonText: {
    color: themes.colors.white,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
});
