/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Dimensions, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {AxiosResponse} from 'axios';
import {authenticatedPost} from '../../../1up/utils/api';
import {LinearGradient} from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

export const CustomerSupport = () => {
  const [mailSubject, setMailSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePaperclipIconPress = () => {
    console.log('handlePaperclipIconPress');
  };

  const handleLocationIconPress = () => {
    console.log('handleLocationIconPress');
  };

  const handleImageIconPress = () => {
    console.log('handleImageIconPress');
  };

  const handleSendPress = async () => {
    setIsLoading(true);
    try {
      const res: AxiosResponse<any> = await authenticatedPost(
        '/webV1/pages/contact/sendQueryEmail',
        {
          query: message,
          subject: mailSubject,
        },
      );
      if (res.data) {
        Toast.show({
          type: 'successToast',
          text1: 'Query sent successfully',
        });
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'errorToast',
        text1: 'Error while submitting query',
      });
      setIsLoading(false);
    }
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
          <HeaderComponent title="Customer Support" />
        </View>

        {/* Support Email */}
        <View style={styles.section}>
          <Text style={styles.label}>Mail subject</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Mail Subject"
              placeholderTextColor={themes.colors.neutralN500}
              value={mailSubject}
              onChangeText={setMailSubject}
              style={styles.input}
              editable={true}
            />
          </View>
        </View>

        {/* Text Area and Bottom Section with Send Button and Icons */}
        <View style={styles.textAreaSection}>
          <Text style={styles.label}>Directly write us query</Text>
          <View style={styles.textAreaContainer}>
            <View style={styles.textAreaBox}>
              <TextInput
                placeholder="Write text here ..."
                placeholderTextColor={themes.colors.neutralN500}
                multiline={true}
                style={styles.textArea}
                value={message}
                onChangeText={setMessage}
              />
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomContainer}>
              {/* Send Button */}
              <TouchableWithoutFeedback onPress={handleSendPress}>
                <LinearGradient
                  colors={['#4451ED', '#5521B5']}
                  locations={[0.0000, 1.000]}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={[
                    styles.sendButton,
                    isLoading && {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                    {isLoading ? (
                      <ActivityIndicator
                        color={themes.colors.white}
                        size={15}
                      />
                    ) : (
                      <>
                        <Icon
                          source="send"
                          size={18}
                          color={themes.colors.white}
                        />
                        <Text style={styles.sendButtonText}>Send message</Text>
                      </>
                    )}
                </LinearGradient>
              </TouchableWithoutFeedback>

              {/* Icons */}
              <View style={styles.iconContainer}>
                {/* paper clip */}
                <TouchableWithoutFeedback onPress={handlePaperclipIconPress}>
                  <Icon
                    source="paperclip"
                    size={18}
                    color={themes.colors.neutralN500}
                  />
                </TouchableWithoutFeedback>

                {/* map-marker */}
                <TouchableWithoutFeedback onPress={handleLocationIconPress}>
                  <Icon
                    source="map-marker"
                    size={18}
                    color={themes.colors.neutralN500}
                  />
                </TouchableWithoutFeedback>

                {/* image */}
                <TouchableWithoutFeedback onPress={handleImageIconPress}>
                  <Icon
                    source="image"
                    size={18}
                    color={themes.colors.neutralN500}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
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
  label: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    paddingHorizontal: 2,
  },
  section: {
    width: width,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  textAreaSection: {
    width: width,
    paddingHorizontal: 20,
    paddingTop: 36,
    gap: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    backgroundColor: themes.colors.SecondaryMain,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 7,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    color: themes.colors.white,
  },
  textAreaContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themes.colors.silverSand,
    backgroundColor: themes.colors.gray800,
    paddingVertical: 8,
  },
  textArea: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    textAlignVertical: 'top',
    paddingHorizontal: 15,
  },
  textAreaBox: {
    width: width * 0.9,
    height: height * 0.17,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.silverSand,
    paddingBottom: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 7,
    paddingHorizontal: 15,
  },
  sendButton: {
    width: width * 0.36,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    borderWidth: 0.75,
    borderColor: '#5B7CE2',
  },
  sendButtonText: {
    color: themes.colors.white,
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginLeft: 5,
    fontFamily: themes.fonts.fontFamily,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});
