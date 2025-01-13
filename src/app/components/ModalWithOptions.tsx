/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { themes } from '../../1up/theme/theme';
import Modal from 'react-native-modal';
import { SvgUri } from 'react-native-svg';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isTitlePresent: boolean;
  title: string;
  description: string;
  svgUri: string;
  firstBtnText: string;
  secondBtnText: string;
  isDeleteButton: boolean;
  onBackdropShouldClose: boolean;
  isDisconnect?: boolean;
  imageUri?: string;
  onPress?: () => void;
}

export const ModalWithOptions = ({
  visible,
  setVisible,
  title,
  isTitlePresent,
  description,
  svgUri,
  firstBtnText,
  secondBtnText,
  onBackdropShouldClose,
  onPress,
  isDeleteButton,
  isDisconnect,
  imageUri,
}: Props) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => {
        if (onBackdropShouldClose) {
          setVisible(false);
        }
      }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}>
      <View style={styles.modalContent}>
        {Platform.OS === 'ios' && (
          <BlurView style={styles.absolute} blurType={'dark'} blurAmount={1} />
        )}
        {/* Modal Icon */}
        {isDisconnect ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 56, height: 56, marginBottom: 5 }}
          />
        ) : (
          <SvgUri
            uri={svgUri}
            height={42}
            width={42}
            style={styles.modalIcon}
          />
        )}

        {/* Modal Text */}
        {isTitlePresent && <Text style={styles.modalTitle}>{`${title}`}</Text>}
        <Text
          style={
            isDisconnect ? styles.disconnectText : styles.modalText
          }>{`${description}`}</Text>

        {/* Modal Buttons */}
        <View style={styles.modalButtons}>
          {/* Go back */}
          <TouchableOpacity
            style={[styles.button, styles.goBackButton]}
            onPress={() => setVisible(false)}>
            <Text style={styles.goBackText}>{firstBtnText}</Text>
          </TouchableOpacity>

          {/* Delete */}
          {isDeleteButton ? (
            <TouchableOpacity
              onPress={onPress}
              style={[
                styles.button,
                {
                  backgroundColor: themes.colors.MaximumRed,
                },
              ]}>
              <Text style={styles.goBackText}>{`${secondBtnText}`}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPress}>
              <LinearGradient
                colors={['#4451ED', '#5521B5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientBackground]}>
                <Text style={styles.goBackText}>{`${secondBtnText}`}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 8,
  },
  modalContent: {
    padding: 20,
    backgroundColor:
      Platform.OS === 'ios'
        ? 'rgba(55, 65, 81, 0.65)'
        : 'rgba(55, 65, 81, 0.75)',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themes.colors.gray600,
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: themes.colors.white,
    marginBottom: 8,
    fontFamily: themes.fonts.fontFamily,
    textAlign: 'center',
  },
  modalText: {
    width: width * 0.65,
    fontSize: 14,
    color: themes.colors.alabaster,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    marginBottom: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  disconnectText: {
    width: width * 0.7,
    fontSize: 15,
    color: themes.colors.alabaster,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    marginBottom: 20,
    fontFamily: themes.fonts.fontFamily,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: width * 0.05,
  },
  button: {
    width: width * 0.3,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  gradientBackground: {
    width: width * 0.3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  goBackButton: {
    backgroundColor: themes.colors.SecondaryMain,
    borderColor: themes.colors.neutralN500,
    borderWidth: 1,
  },
  goBackText: {
    color: themes.colors.white,
    fontSize: 14,
    fontFamily: themes.fonts.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
  },
});
