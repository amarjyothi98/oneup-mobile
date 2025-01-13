/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Image,
    Pressable,
} from 'react-native';
import { themes } from '../../1up/theme/theme';
import Modal from 'react-native-modal';
import { BlurView } from '@react-native-community/blur';
import { TextInput } from 'react-native-gesture-handler';
import { AxiosResponse } from 'axios';
import { authenticatedPost } from '../../1up/utils/api';
import { SvgUri } from 'react-native-svg';
import BasicLoader from './BasicLoader';
import { GlobalNavigationProp } from '../../../App';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onBackdropShouldClose: boolean;
}

interface RobinhoodPayload {
    username: string;
    password: string;
    challenge_response_id: string;
    device_token: string;
    sms_code: string;
}

const RobinhoodModal = ({
    visible,
    setVisible,
    onBackdropShouldClose,
}: Props) => {
    const navigation = useNavigation<GlobalNavigationProp>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [requireChallenge, setRequireChallenge] = useState<boolean>(false);
    const [errorString, setErrorString] = useState<string>('');
    const [loading, setLoading] = useState<{
        login: boolean;
        challenge: boolean;
    }>({
        login: false,
        challenge: false,
    });
    const [robinhoodPayload, setRobinhoodPayload] = useState<RobinhoodPayload>({
        username: '',
        password: '',
        challenge_response_id: '',
        device_token: '',
        sms_code: '',
    });

    const handleLogin = async () => {
        console.log(robinhoodPayload);
        setLoading((prev: any) => ({ ...prev, login: true }));
        if (robinhoodPayload.username === '' || robinhoodPayload.password === '') {
            setErrorString('Please enter username and password');
            setLoading((prev: any) => ({ ...prev, login: false }));
            return;
        }
        try {
            const res: AxiosResponse<any> = await authenticatedPost(
                'webV1/robinhood/login',
                robinhoodPayload,
            );
            if (res?.data?.message === 'LOGIN_FAILED') {
                console.log('control is in login failed block');
                setErrorString(res?.data?.error);
            } else {
                setRobinhoodPayload((prev: any) => ({ ...prev, challenge_response_id: res?.data?.challengeId, device_token: res?.data?.deviceToken }));
                setRequireChallenge(true);
            }
            setLoading((prev: any) => ({ ...prev, login: false }));
        } catch (error) {
            console.log(error);
            setErrorString('Error while connecting Robinhood');
        } finally {
            setLoading((prev: any) => ({ ...prev, login: false }));
        }
    };

    const HandleChallenge = async () => {
        setLoading((prev: any) => ({ ...prev, challenge: true }));
        if (robinhoodPayload.sms_code === '') {
            setErrorString('Please enter SMS code');
            setLoading((prev: any) => ({ ...prev, challenge: false }));
            return;
        }
        try {
            const res: AxiosResponse<any> = await authenticatedPost(
                'webV1/robinhood/login_challenge',
                robinhoodPayload,
            );
            console.log('final', robinhoodPayload, res);
            if (res.data) {
                console.log('res.data', res.data);
                setVisible(false);
                navigation.navigate('BrokerageHub');
                Toast.show({
                    type: 'successToast',
                    text1: 'Robinhood Connected Successfully',
                  });
            }
            setLoading((prev: any) => ({ ...prev, challenge: false }));
        } catch (error) {
            console.log(error);
            setErrorString('Error while connecting Robinhood');
            setLoading((prev: any) => ({ ...prev, challenge: false }));
        } finally {
            setLoading((prev: any) => ({ ...prev, challenge: false }));
        }
        console.log('login');
    };
    console.log(loading);

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
                <View style={styles.mainContainer}>
                    <View style={styles.preHeaderContainer}>
                        <Text style={styles.preHeaderTitle}>Connect Broker</Text>
                        <Pressable onPress={() => {
                            setVisible(false);
                            setRobinhoodPayload((prev: any) => ({ ...prev, challenge_response_id: '', username: '', password: '' }));
                            setErrorString('');
                            }}>
                            <SvgUri uri={'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/x.svg'} width={20} height={20} />
                        </Pressable>
                    </View>
                    <View style={styles.headerContainer}>
                        <Image
                            source={{
                                uri: 'https://passiv-brokerage-logos.s3.ca-central-1.amazonaws.com/robinhood-logo-square.png',
                            }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.MainHeading}>Login to your robinhood account</Text>
                    </View>
                    {!requireChallenge ? (
                        <View>
                            <Text style={styles.title}>Your Robinhood Username<Text style={{ color: 'red' }}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor={themes.colors.gray400}
                                value={robinhoodPayload.username}
                                onChangeText={value => setRobinhoodPayload({ ...robinhoodPayload, username: value })}
                            />
                            <View>
                                <Text style={styles.title}>Password<Text style={{ color: 'red' }}>*</Text></Text>
                                <TouchableOpacity
                                    style={styles.showPasswordButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={[styles.title]}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
                                    <SvgUri uri={!showPassword ? 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/eye-off.svg' : 'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/eye.svg'} width={17} height={17} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••••"
                                    placeholderTextColor={themes.colors.gray400}
                                    secureTextEntry={!showPassword}
                                    value={robinhoodPayload.password}
                                    onChangeText={value => setRobinhoodPayload({ ...robinhoodPayload, password: value })}
                                />
                            </View>
                            {errorString !== '' && (
                                <Text style={styles.errorText}>{errorString}</Text>
                            )}
                            <TouchableOpacity disabled={loading?.login} style={[styles.loginButton, loading?.login && styles.buttonDisable]} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>{loading?.login ? <BasicLoader/> : 'Login'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.title}>Enter Robinhood Code<Text style={{ color: 'red' }}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Robinhood Code"
                                placeholderTextColor={themes.colors.gray400}
                                value={robinhoodPayload.sms_code}
                                onChangeText={value => setRobinhoodPayload({ ...robinhoodPayload, sms_code: value })}
                            />
                            <TouchableOpacity disabled={loading?.challenge} style={[styles.loginButton, loading?.challenge && styles.buttonDisable]} onPress={HandleChallenge}>
                                <Text style={styles.loginButtonText}>{loading?.challenge ? <BasicLoader/> : 'Verify'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default RobinhoodModal;

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
    preHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: themes.colors.SecondaryMain,
        marginBottom: 20,
    },
    preHeaderTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: themes.colors.white,
    },
    MainHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themes.colors.white,
        marginBottom: 8,
        marginHorizontal: 'auto',
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
        minWidth: 200,
    },
    mainContainer: {
        width: width * 0.75,
        alignSelf: 'center',
    },
    headerContainer: {
        marginBottom: 15,
    },
    logo: {
        width: 44,
        height: 44,
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: themes.colors.gray400,
    },
    gradientBackground: {
        width: width * 0.3,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        backgroundColor: themes.colors.gray700,
        borderWidth: 1,
        borderColor: themes.colors.gray600,
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showPasswordButton: {
        position: 'absolute',
        right: 12,
        flexDirection: 'row',
        gap: 5,
        overflow: 'hidden',
    },
    loginButton: {
        backgroundColor: themes.colors.foundationSecondary,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        width: 250,
        marginHorizontal: 'auto',
        borderWidth: 1,
        borderColor: themes.colors.blueCTA,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: themes.colors.fireOpal,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    buttonDisable: {
        opacity: 0.8,
    },
});
