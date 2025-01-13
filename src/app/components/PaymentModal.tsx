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
import {SvgUri} from 'react-native-svg';
import {themes} from '../../1up/theme/theme';

const {width} = Dimensions.get('window');

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  amount: string;
  action: string;
  date: string;
  broker: string;
  isPaymentComplete: boolean;
}

export const PaymentModals = ({
  visible,
  setVisible,
  amount,
  action,
  date,
  broker,
  isPaymentComplete,
}: Props) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}>
      <View style={styles.modalContent}>
        {/* Modal Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setVisible(false)}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <SvgUri
            uri={
              isPaymentComplete
                ? 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/Success.svg'
                : 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/failed.svg'
            }
          />
        </View>

        {/* Amount */}
        <Text style={styles.amountText}>${amount}.00</Text>

        {/* Status */}
        <Text style={styles.statusText}>Order Executed</Text>
        <Text style={styles.statusSubText}>
          Order Status -{' '}
          <Text
            style={isPaymentComplete ? styles.successText : styles.failedText}>
            {isPaymentComplete ? 'Successful' : 'Failed'}
          </Text>
        </Text>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Action</Text>
            <Text style={styles.detailValue}>{action}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Broker</Text>
            <Text style={styles.detailValue}>{broker}</Text>
          </View>
        </View>
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
    backgroundColor: themes.colors.primaryMain,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderColor: themes.colors.silverSand,
    borderWidth: 1,
    padding: 4,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  amountText: {
    fontSize: 36,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 54,
  },
  statusText: {
    fontSize: 16,
    color: themes.colors.white,
    marginBottom: 10,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  statusSubText: {
    fontSize: 14,
    color: themes.colors.white,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  successText: {
    color: themes.colors.successgreen,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  failedText: {
    color: themes.colors.fireOpal,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
  detailsContainer: {
    marginTop: 20,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomColor: themes.colors.silverSand,
    borderBottomWidth: 1,
  },
  detailLabel: {
    color: themes.colors.alabaster,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
  },
  detailValue: {
    color: themes.colors.white,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
});
