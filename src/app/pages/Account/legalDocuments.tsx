/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {useNavigation} from '@react-navigation/native';
import {GlobalNavigationProp} from '../../../../App';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {documentDetails} from '../../types/documentLinks';
import {LinearGradient} from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export const LegalDocuments = () => {
  const navigation = useNavigation<GlobalNavigationProp>();

  const handleDocumetnLinkPress = (url: string, name: string) => {
    Platform.OS === 'android' && name === 'OneUp Terms of Use'
      ? Linking.openURL(url)
      : navigation.navigate('LegalDocumentsWebview', {url: url, name: name});
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#4253F0', '#2A1452', '#111928']}
        locations={[0.0164, 0.2446, 0.3717]}
        start={{x: 0.7, y: 0}}
        end={{x: 0.4, y: 0.8}}
        style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <HeaderComponent title="Documents" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Text and subText */}
            <View style={styles.textAndSubText}>
              <Text style={styles.legalDocumentText}>Legal Documents</Text>
              <Text style={styles.termsAndConditionText}>
                Terms & conditions/privacy policy
              </Text>
            </View>

            {/* Links for the documents */}
            <View style={styles.linkContainer}>
              {documentDetails.map((item, index) => (
                <TouchableWithoutFeedback
                  key={index}
                  style={styles.listItem}
                  onPress={() => {
                    handleDocumetnLinkPress(item.url, item.name);
                  }}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableWithoutFeedback>
              ))}
            </View>

            {/* Footer Note */}
            <View style={styles.footerNote}>
              <Text style={styles.footerText}>
                Please note that any references to 'OneUp' in any legal
                documents or communications are in reference to Kensys Ltd, and
                all legal responsibilities and rights therein are held by Kensys
                Ltd.
              </Text>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
  },
  textAndSubText: {
    paddingVertical: 18,
    gap: 5,
    alignItems: 'center',
  },
  legalDocumentText: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
  },
  termsAndConditionText: {
    color: themes.colors.neutralN500,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
  },
  linkContainer: {
    paddingHorizontal: 23,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  bullet: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 24,
    marginRight: 8,
  },
  itemText: {
    width: width * 0.8,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    color: themes.colors.white,
    textDecorationLine: 'underline',
  },
  footerNote: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  footerText: {
    color: themes.colors.brightGrey,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    lineHeight: 21,
  },
});
