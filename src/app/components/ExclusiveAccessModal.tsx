import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {themes} from '../../1up/theme/theme';
import {SvgUri} from 'react-native-svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Icon} from 'react-native-paper';

const {width} = Dimensions.get('window');

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ExclusiveAccessModal = ({visible, setVisible}: Props) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}>
      <View style={styles.modalContent}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setVisible(false)}>
          <Icon source={'close'} size={20} color={themes.colors.white} />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <SvgUri
            uri={
              'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneUpHomePageLogo.svg'
            }
            width={84}
            height={80}
          />
        </View>

        {/* Title */}
        <Text style={styles.titleText}>Unlock Exclusive Access —</Text>
        <Text style={styles.subtitleText}>FREE for 30 Days!</Text>

        {/* Description */}
        <Text style={styles.descriptionText}>
          The market is moving fast, and the pros are already making big moves.
          Don't miss out!
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <Text style={styles.options}>
            Here's what you'll gain instant access to:
          </Text>
          {[
            'Unlimited high-conviction strategies',
            'Real-time insider opportunities before the crowd',
            'Automated buying, selling, and rebalancing',
            'Advanced ESG & sustainable investing options',
            'Multiple broker integrations',
            'Continuous tax-loss harvesting',
          ].map((feature, index) => (
            <Text key={index} style={styles.featureText}>
              <Text style={styles.tick}>✓</Text> {feature}
            </Text>
          ))}
        </View>

        {/* Start Free Trial Button */}
        <TouchableWithoutFeedback style={styles.freeTrialButton}>
          <Text style={styles.freeTrialButtonText}>Start my free trial</Text>
        </TouchableWithoutFeedback>

        {/* Go Back Button */}
        <TouchableWithoutFeedback style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>← Go Back</Text>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: themes.colors.SecondaryMain,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderColor: themes.colors.silverSand,
    borderWidth: 1,
    borderRadius: 6,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#CCCCCC',
    borderRadius: 25,
  },
  titleText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitleText: {
    fontSize: 20,
    color: themes.colors.white,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  descriptionText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 21,
  },
  featuresList: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 14,
    color: themes.colors.white,
    marginVertical: 2,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    lineHeight: 21,
  },
  tick: {
    color: themes.colors.successgreen,
  },
  freeTrialButton: {
    backgroundColor: themes.colors.foundationSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 10,
  },
  freeTrialButtonText: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  goBackButton: {
    borderColor: themes.colors.chineseWhite,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: themes.colors.white,
    fontSize: 14,
  },
  options: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 21,
    color: themes.colors.white,
    marginBottom: 10,
  },
});
