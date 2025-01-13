/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {GlobalNavigationProp} from '../../../../App';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {AxiosResponse} from 'axios';
import {authenticatedPost} from '../../../1up/utils/api';
import Toast from 'react-native-toast-message';
import {LinearGradient} from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export const ChangePassword = () => {
  const navigation = useNavigation<GlobalNavigationProp>();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [oldPasswordSecure, setOldPasswordSecure] = useState(true);
  const [newPasswordSecure, setNewPasswordSecure] = useState(true);
  const [confirmNewPasswordSecure, setConfirmNewPasswordSecure] =
    useState(true);

  const handleChangePasswordPress = () => {
    if (!newPassword && !oldPassword && !confirmNewPassword) {
      Toast.show({
        type: 'errorToast',
        text1: 'Please fill all mandatory fields',
      });
    } else if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: 'errorToast',
        text1: 'New passwords do not match',
      });
    } else {
      handleChangePasswordApi();
    }
  };

  const handleChangePasswordApi = async () => {
    try {
      const requestBody = {
        oldPassword,
        newPassword,
      };
      setIsLoading(true);
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/auth/resetPassword/reset',
        requestBody,
      );

      if (res.data) {
        console.log('signup response', res.data);
        Toast.show({
          type: 'successToast',
          text1: 'Password changed successfully',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while changing password',
      });
      setIsLoading(false);
    }
  };

  const handleForgetPasswordPress = () => {
    navigation.navigate('ForgetPassword');
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderComponent title="Change Password" />
        </View>

        {/* Text and subText */}
        <View style={styles.textAndSubText}>
          <Text style={styles.changePassText}>Reset your Password</Text>
          <Text style={styles.changePassSubText}>
            Please reset your new password and reconfirm it.
          </Text>
        </View>

        {/* password containers */}
        <View style={styles.nameAndMobile}>
          {/* Old password */}
          <View>
            <Text style={styles.label}>Old Password</Text>
            <View style={styles.inputContainer}>
              <Icon source="lock" size={16} color={themes.colors.neutralN500} />
              <TextInput
                placeholder="Enter old password"
                value={oldPassword}
                onChangeText={text => setOldPassword(text)}
                style={styles.input}
                placeholderTextColor={themes.colors.neutralN500}
                secureTextEntry={oldPasswordSecure}
              />
              <TouchableOpacity
                onPress={() => setOldPasswordSecure(!oldPasswordSecure)}>
                <Icon
                  source={oldPasswordSecure ? 'eye-off' : 'eye'}
                  size={14}
                  color={themes.colors.neutralN500}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New password */}
          <View>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Icon source="lock" size={16} color={themes.colors.neutralN500} />
              <TextInput
                placeholder="Must be min 8 characters"
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                style={styles.input}
                placeholderTextColor={themes.colors.neutralN500}
                secureTextEntry={newPasswordSecure}
              />
              <TouchableOpacity
                onPress={() => setNewPasswordSecure(!newPasswordSecure)}>
                <Icon
                  source={newPasswordSecure ? 'eye-off' : 'eye'}
                  size={14}
                  color={themes.colors.neutralN500}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm new password */}
          <View>
            <Text style={styles.label}>Reconfirm New Password</Text>
            <View style={styles.inputContainer}>
              <Icon source="lock" size={16} color={themes.colors.neutralN500} />
              <TextInput
                placeholder="Repeat new password"
                value={confirmNewPassword}
                onChangeText={text => setConfirmNewPassword(text)}
                style={styles.input}
                placeholderTextColor={themes.colors.neutralN500}
                secureTextEntry={confirmNewPasswordSecure}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmNewPasswordSecure(!confirmNewPasswordSecure)
                }>
                <Icon
                  source={confirmNewPasswordSecure ? 'eye-off' : 'eye'}
                  size={14}
                  color={themes.colors.neutralN500}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password Button */}
          <View style={styles.forgetButtonContainer}>
            <TouchableWithoutFeedback onPress={handleForgetPasswordPress}>
              <Text style={styles.forgetPasswordText}>Forget Password?</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Change password button */}
        <TouchableWithoutFeedback onPress={handleChangePasswordPress}>
          <LinearGradient
            colors={['#4451ED', '#5521B5']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.gradientBackground]}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {isLoading ? (
                <ActivityIndicator color={themes.colors.white} size="small" />
              ) : (
                <Text style={styles.changeText}>Change Password</Text>
              )}
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
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
  textAndSubText: {
    paddingHorizontal: 15,
    marginTop: 18,
    gap: 10,
  },
  changePassText: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
  },
  changePassSubText: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
  },
  label: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    paddingHorizontal: 2,
  },
  nameAndMobile: {
    width: width,
    paddingHorizontal: 15,
    paddingTop: 24,
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    backgroundColor: themes.colors.SecondaryMain,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 42,
    color: themes.colors.white,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  forgetButtonContainer: {
    alignSelf: 'flex-end',
    marginTop: 5,
    paddingBottom: 25,
  },
  forgetPasswordText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    color: themes.colors.UnitedNationsBlue,
  },
  changeText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
  },
  gradientBackground: {
    width: width * 0.7,
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
});
