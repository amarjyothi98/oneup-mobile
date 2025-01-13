import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { Loader } from '../../components/Loader';

const SnapTradeLoginWebView = ({
    loginLink,
    onLoginSuccess,
    onClose,
}: {
    loginLink: string,
    onLoginSuccess: (data: any) => void,
    onClose: () => void
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleMessage = (event: any) => {
        try {
            const messageData = JSON.parse(event.nativeEvent.data);
            console.log("message Data", messageData);
            // Add your specific message handling logic here
            if (messageData.status === 'SUCCESS') {
                onLoginSuccess(messageData);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View> */}

            <WebView
                source={{ uri: loginLink }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                injectedJavaScript={`
          window.addEventListener('message', (event) => {
            window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
          });
        `}
                onMessage={handleMessage}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => onClose()}
                onHttpError={({ nativeEvent }) => {
                    if (nativeEvent.statusCode === 404) {
                        onClose();
                    }
                }}
            />

            {isLoading && (
                <LinearGradient
                    colors={['#4253F0', '#2A1452', '#111928']}
                    style={styles.loadingOverlay}
                >
                    {/* <BasicLoader /> */}
                    <Loader onlyLoader={true} />
                </LinearGradient>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#111928',
    },
    headerContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    webview: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
    },
});

export default SnapTradeLoginWebView;
