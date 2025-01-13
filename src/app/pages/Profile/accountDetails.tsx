/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import {AxiosResponse} from 'axios';
import {authenticatedPut} from '../../../1up/utils/api';
import {useData} from '../../../1up/provider/data';
import {LinearGradient} from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

export const AccountDetails = () => {
  const pickerRef = useRef<RNPickerSelect & {togglePicker: () => void}>(null);
  const {user, getUser} = useData();

  const [valueFullName, setValueFullName] = useState(
    user?.userData?.firstName || '',
  );
  const [valueEmail, setValueEmail] = useState(user?.userData?.email || '');
  const [valuePhoneNumber, setValuePhoneNumber] = useState(
    user?.userData?.phoneNumber.value === 'undefined'
      ? ''
      : user?.userData?.phoneNumber.value || '',
  );
  const [valueGender, setValueGender] = useState(user?.userData?.gender || '');

  const [phoneChnagePressed, setPhoneChangePressed] = useState(false);
  const [genderChangePressed, setGenderChangePressed] = useState(false);
  const [isPhoneChnageLoading, setIsPhoneChnageLoading] = useState(false);
  const [isGenderChnageLoading, setIsGenderChnageLoading] = useState(false);

  const handlePhoneNumberChangePress = () => {
    if (phoneChnagePressed) {
      if (!valuePhoneNumber) {
        Toast.show({
          type: 'errorToast',
          text1: 'Mobile number cannot be empty',
        });
      } else {
        handlePhoneNumberChangeApi();
      }
    } else {
      setPhoneChangePressed(true);
    }
  };

  const handlePhoneNumberChangeApi = async () => {
    setIsPhoneChnageLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPut(
        '/webV1/pages/account/updatePhoneNumber',
        {
          newNumber: valuePhoneNumber,
          oldNumber: user?.userData?.phoneNumber.value,
        },
      );
      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'Mobile number changed',
        });
        setPhoneChangePressed(false);
        getUser();
        setIsPhoneChnageLoading(false);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while updating mobile number',
      });
      setPhoneChangePressed(false);
    }
  };

  const handleGenderChangePress = () => {
    if (!genderChangePressed) {
      setGenderChangePressed(true);
      pickerRef.current?.togglePicker();
    } else {
      if (!valueGender) {
        Toast.show({
          type: 'errorToast',
          text1: 'Gender cannot be empty',
        });
      } else {
        handleGenderChange();
        setGenderChangePressed(false);
      }
    }
  };

  const handleGenderChange = async () => {
    setIsGenderChnageLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPut(
        '/webV1/pages/account/updateGender',
        {gender: valueGender},
      );
      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'Gender updated successfully',
        });
        setGenderChangePressed(false);
        getUser();
        setIsGenderChnageLoading(false);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'errorToast',
        text1: 'Error while updating gender',
      });
      setIsGenderChnageLoading(false);
    }
  };

  const dropdownIcon = () => (
    <View style={styles.dropdownIcon}>
      <Icon source="chevron-down" size={24} color={themes.colors.white} />
    </View>
  );

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
          <HeaderComponent title="Account Details" />
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.accountTopText}>My Account</Text>
          <Text style={styles.subaccountTopText}>
            View, edit and manage account details from my account page.
          </Text>
        </View>

        {/* Details part 1 including name and mobile number */}
        <View style={styles.nameAndMobile}>
          {/* Name */}
          <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Enter your full name"
              value={valueFullName}
              onChangeText={text => setValueFullName(text)}
              style={styles.input}
              placeholderTextColor={themes.colors.neutralN500}
              editable={false}
              keyboardType="default"
            />
          </View>

          {/* Mobile Number */}
          <View>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              placeholder="Enter your mobile number"
              value={valuePhoneNumber}
              onChangeText={text => setValuePhoneNumber(text)}
              style={styles.input}
              placeholderTextColor={themes.colors.neutralN500}
              editable={phoneChnagePressed ? true : false}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Change Button */}
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={handlePhoneNumberChangePress}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.gradientBackground]}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                {isPhoneChnageLoading ? (
                  <ActivityIndicator size="small" color={themes.colors.white} />
                ) : (
                  <Text style={styles.changeText}>
                    {phoneChnagePressed ? 'Save' : 'Change'}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>

        {/* Details part 2 including email and gender */}
        <View style={styles.nameAndMobile}>
          {/* Email */}
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={valueEmail}
              onChangeText={text => setValueEmail(text)}
              style={styles.input}
              placeholderTextColor={themes.colors.neutralN500}
              editable={false}
              keyboardType="email-address"
            />
          </View>

          {/* Gender Dropdown */}
          <View>
            <Text style={styles.label}>Gender</Text>
            {Platform.OS === 'ios' ? (
              <TouchableWithoutFeedback onPress={handleGenderChangePress}>
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={value => setValueGender(value)}
                    Icon={dropdownIcon}
                    items={[
                      {label: 'Male', value: 'male'},
                      {label: 'Female', value: 'female'},
                      {label: 'Prefer not to say', value: 'prefer not to say'},
                    ]}
                    value={valueGender}
                    ref={pickerRef}
                    style={{
                      inputIOS: styles.pickerInput,
                      inputAndroid: styles.pickerInput,
                      placeholder: {
                        color: themes.colors.neutralN500,
                      },
                      modalViewBottom: styles.modalViewBottom,
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={value => setValueGender(value)}
                  Icon={dropdownIcon}
                  darkTheme={true}
                  items={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                    {label: 'Prefer not to say', value: 'prefer not to say'},
                  ]}
                  value={valueGender}
                  ref={pickerRef}
                  style={{
                    inputIOS: styles.pickerInput,
                    inputAndroid: styles.pickerInput,
                    placeholder: {
                      color: themes.colors.neutralN500,
                    },
                    modalViewBottom: styles.modalViewBottom,
                  }}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            )}
          </View>
        </View>

        {/* Change Button */}
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={handleGenderChangePress}>
            <LinearGradient
              colors={['#4451ED', '#5521B5']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.gradientBackground]}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                {isGenderChnageLoading ? (
                  <ActivityIndicator size="small" color={themes.colors.white} />
                ) : (
                  <Text style={styles.changeText}>
                    {phoneChnagePressed ? 'Save' : 'Change'}
                  </Text>
                )}
              </View>
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
  topContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    textAlign: 'center',
    gap: 5,
  },
  accountTopText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: 30,
  },
  subaccountTopText: {
    width: width * 0.84,
    color: themes.colors.gray300,
    fontFamily: themes.fonts.fontFamily,
    fontSize: width * 0.035,
    lineHeight: 21,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    textAlign: 'center',
  },
  label: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    paddingHorizontal: 2,
  },
  nameAndMobile: {
    width: width * 0.98,
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    backgroundColor: themes.colors.SecondaryMain,
    marginTop: 8,
    height: 42,
    color: themes.colors.white,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 30,
  },
  gradientBackground: {
    width: width * 0.3,
    height: height * 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
  changeText: {
    fontFamily: themes.fonts.fontFamily,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    color: themes.colors.white,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    borderRadius: 8,
    backgroundColor: themes.colors.SecondaryMain,
    marginTop: 8,
  },
  pickerInput: {
    color: themes.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    height: 42,
  },
  modalViewBottom: {
    backgroundColor: themes.colors.white,
    height: 200,
  },
  dropdownIcon: {
    paddingVertical: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
