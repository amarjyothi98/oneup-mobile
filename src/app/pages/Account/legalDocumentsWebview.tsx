/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ActivityIndicator, Icon} from 'react-native-paper';
import {themes} from '../../../1up/theme/theme';
import {GlobalNavigationProp} from '../../../../App';
import {LegalDocumentsWebViewProps} from '../../types/types';
import {LinearGradient} from 'react-native-linear-gradient';
import {HeaderComponent} from '../../components/header';

export const LegalDocumentsWebview = () => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<GlobalNavigationProp>();
  const route =
    useRoute<RouteProp<{params: LegalDocumentsWebViewProps}, 'params'>>();
  const {url, name} = route.params;

  const renderBackIocn = () => {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon source={'chevron-left'} size={24} color={themes.colors.white} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (webViewRef) {
      navigation.setOptions({
        headerTitle: name,
        headerStyle: {
          backgroundColor: themes.colors.primaryMain,
        },
        headerTintColor: themes.colors.white,
        headerTitleStyle: {
          color: themes.colors.white,
          fontFamily: themes.fonts.fontFamily,
          fontSize: 18,
          fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
        },
        headerLeft: () => renderBackIocn(),
      });
    }
  }, [navigation]);

  console.log('URL', url);

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <HeaderComponent title={name} />
        </View>
        <View style={styles.webViewContainer}>
          <WebView
            originWhitelist={['*']}
            ref={webViewRef}
            source={{
              uri:
                Platform.OS === 'ios'
                  ? url
                  : `https://docs.google.com/gview?embedded=true&url=${url}`,
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            onMessage={() => {}}
            style={styles.webView}
            webviewDebuggingEnabled={true}
          />
          {isLoading && <ActivityIndicator style={styles.activityLoader} />}
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.50)',
  },
  webViewContainer: {
    flex: 1,
  },
  activityLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
  },
});
