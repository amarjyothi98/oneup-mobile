import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { HeaderComponent } from '../../components/header';
import { themes } from '../../../1up/theme/theme';
import { SvgUri } from 'react-native-svg';
import RobinhoodModal from '../../components/RobinhoodModal';
import { authenticatedGet, authenticatedPost } from '../../../1up/utils/api';
import { AxiosResponse } from 'axios';
import Toast from 'react-native-toast-message';
import SnapTradeLoginWebView from './SnapTradeLoginWebView';
import { GlobalNavigationProp } from '../../../../App';
import { CommonActions, useNavigation } from '@react-navigation/core';

const { width } = Dimensions.get('window');

const BrokerItem = ({ item, onSelect, isSelected }: any) => {
    return (
        <TouchableOpacity
            style={styles.brokerItemContainer}
            onPress={() => { item.name === 'Fidelity' || item.name === 'Schwab' ? null : onSelect(item) }}
        >
            <Image
                source={{ uri: item.logo }}
                style={styles.brokerLogo}
                resizeMode="contain"
            />
            <View style={styles.brokerDetails}>
                <Text style={styles.brokerName}>{item.name}</Text>
                <Text style={styles.brokerWebsite}>{item.website}</Text>
            </View>
            {item.name === 'Fidelity' || item.name === 'Schwab' ? (
                <SvgUri
                    uri={
                        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/comingSoon.svg'
                    }
                    style={styles.comingSoon}
                />
            ) : (
                <View style={styles.radioContainer}>
                    <View
                        style={[
                            styles.radioButton,
                            isSelected && styles.radioButtonSelected,
                        ]}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const ConnectYourAccounts = () => {
    const [query, setQuery] = useState<string>('');
    const [selectedBroker, setSelectedBroker] = useState<any>(null);
    const [brokers, setBrokers] = useState<any>({
        brokers: [],
        loading: true,
    });
    const [robinhoodSelected, setRobinhoodSelected] = useState<boolean>(false);
    const [robinhoodModalVisible, setRobinhoodModalVisible] = useState<boolean>(false);
    const [snapTradeModalVisible, setSnapTradeModalVisible] = useState<boolean>(false);
    const [snapTradeLoginLink, setSnapTradeLoginLink] = useState<string>('');
    const navigation = useNavigation<GlobalNavigationProp>();

    const loginUser = async () => {
        console.log(`/webV1/trading/loginUri?slug=${selectedBroker.slug}`);
        try {
            const res: AxiosResponse<any> = await authenticatedGet(
                `/webV1/trading/loginUri?slug=${selectedBroker.slug}`,
            );
            if (res.data) {
                setSnapTradeLoginLink(res.data?.redirectURI);
                setSnapTradeModalVisible(true);
            }
        } catch (error) {
            console.log("here", error);
            Toast.show({
                type: 'errorToast',
                text1: 'Error while logging in',
            });
        }
    };

    const getBrokers = async () => {
        setBrokers({
            brokers: [],
            loading: true,
        });
        try {
            const res: AxiosResponse<any> = await authenticatedGet(
                '/webV1/trading/getBrokers',
            );
            if (res.data) {
                setBrokers({
                    brokers: res.data,
                    loading: false,
                });
            }
        } catch (error) {
            console.log(error);
            setBrokers({
                brokers: [],
                loading: false,
            });
        }
    };

    const allowedBrokers = [
        'Alpaca',
        'Robinhood',
        'Webull',
        'E-Trade',
        'Schwab',
        'Fidelity',
        'Alpaca Paper',
    ];

    const renderData =
        brokers.brokers &&
        brokers.brokers
            .filter(
                (v: any) => allowedBrokers.includes(v.name)
            )
            .sort(
                (a: any, b: any) =>
                    allowedBrokers.indexOf(a.name) - allowedBrokers.indexOf(b.name)
            );

    const filteredBrokers = renderData?.filter((broker: any) =>
        broker.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleBrokerSelect = (broker: any) => {
        if (broker.name === 'Robinhood') {
            setRobinhoodSelected(!robinhoodSelected);
            setSelectedBroker(null);
        } else {
            setSelectedBroker(broker);
            setRobinhoodSelected(false);
        }
    };

    const handleConnectPortfolio = () => {
        if (robinhoodSelected) {
            setRobinhoodModalVisible(true);
        } else if (selectedBroker) {
            console.log('Connecting', selectedBroker.name);
            loginUser();
        }
    };

    const renderBrokerItem = ({ item }: { item: any }) => (
        <BrokerItem
            key={item.slug}
            item={item}
            onSelect={handleBrokerSelect}
            isSelected={
                (item.name === 'Robinhood' && robinhoodSelected) ||
                (selectedBroker?.slug === item.slug)
            }
        />
    );

    const emailConfirmation = async () => {
        try {
            const res: AxiosResponse<any> = await authenticatedPost(
                `/webV1/trading/send-brokerage-connected-email/${selectedBroker.slug}`,
            );
            if (res.data) {
                Toast.show({
                    type: 'successToast',
                    text1: 'Connection email sent successfully',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'errorToast',
                text1: 'Error while sending email.',
            });
        }
    };

    useEffect(() => {
        getBrokers();
    }, []);
    // console.log(selectedBroker?.slug);

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#4253F0', '#2A1452', '#111928']}
                locations={[0.0164, 0.2446, 0.3717]}
                start={{ x: 0.7, y: 0 }}
                end={{ x: 0.4, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.headerContainer}>
                <HeaderComponent title="Link Your Broker Accounts" />
            </View>

            <View style={styles.mainContainer}>
                <View style={styles.logoSection}>
                    <View style={styles.headerImageContainer}>
                        <SvgUri
                            uri={
                                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneup-ellipse-borderless.svg'
                            }
                            width={42}
                            height={42}
                        />
                        <SvgUri
                            uri={
                                'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneup-bank-ellipse.svg'
                            }
                            width={42}
                            height={42}
                            style={{ marginLeft: -8 }}
                        />
                    </View>
                    <Text style={styles.headerTitle}>Securely link your broker account</Text>
                </View>
                <View style={styles.searchContainer}>
                    <SvgUri
                        uri={
                            'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/search.svg'
                        }
                        width={24}
                        height={24}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for broker"
                        placeholderTextColor={themes.colors.gray400}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
                <FlatList
                    data={filteredBrokers}
                    renderItem={renderBrokerItem}
                    keyExtractor={(item) => item.slug}
                    contentContainerStyle={styles.brokerListContent}
                />
            </View>
            <View style={styles.submitContainer}>
                <View style={styles.infoContainer}>
                    <SvgUri
                        uri={
                            'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/oneup-info.svg'
                        }
                        width={20}
                        height={20}
                    />
                    <Text style={styles.infoText}>Why do I need to connect to my broker account?</Text>
                </View>
                <TouchableWithoutFeedback
                    onPress={handleConnectPortfolio}
                    disabled={!selectedBroker && !robinhoodSelected}
                >
                    <LinearGradient
                        colors={['#4451ED', '#5521B5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[styles.gradientBtn, !selectedBroker && !robinhoodSelected && styles.buttonDisabled]}>
                            <View style={styles.submitButtonTextContainer}>

                    <SvgUri
                        uri={
                            'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/chart-bar.svg'
                        }
                        width={20}
                        height={20}
                    />
                        <Text style={styles.submitButtonText}>
                            Connect your Portfolio  ➜
                        </Text>
                            </View>
                    </LinearGradient>
                </TouchableWithoutFeedback>
            </View>
            <RobinhoodModal
                visible={robinhoodModalVisible}
                onBackdropShouldClose={true}
                setVisible={setRobinhoodModalVisible}
            />
            {snapTradeLoginLink && snapTradeModalVisible &&
                <SnapTradeLoginWebView
                    loginLink={snapTradeLoginLink}
                    onLoginSuccess={() => {
                        Toast.show({
                            type: 'successToast',
                            text1: 'Login Successful',
                        });
                        // navigation.reset({index: 0, routes: [{name: 'BrokerageHub'}]});
                        emailConfirmation();
                        // navigation.navigate('HomeTabs');
                        navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'HomeTabs' }],
                        }));
                        setSnapTradeModalVisible(false);
                    }}
                    onClose={() => {
                        setSnapTradeModalVisible(false);
                        Toast.show({
                            type: 'errorToast',
                            text1: "Connection Exited, don't worry connect later.",
                        });
                    }}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(17, 25, 40, 0.50)',
        borderBottomColor: themes.colors.SecondaryMain,
        borderBottomWidth: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    headerImageContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginHorizontal: 5,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: themes.colors.white,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themes.colors.gray600,
        backgroundColor: themes.colors.gray800,
        borderRadius: 8,
        margin: 15,
        paddingHorizontal: 10,
    },
    logoSection: {
        marginHorizontal: 15,
        marginVertical: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: themes.colors.gray400,
    },
    brokerListContainer: {
        flex: 1,
    },
    brokerListContent: {
        paddingBottom: 80,
    },
    brokerItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        overflow: 'hidden',
        position: 'relative',
    },
    brokerLogo: {
        width: 44,
        height: 44,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: themes.colors.brightGrey,
    },
    brokerDetails: {
        flex: 1,
    },
    brokerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: themes.colors.white,
    },
    brokerWebsite: {
        fontSize: 12,
        color: themes.colors.foundationSecondary,
        textDecorationLine: 'underline',
    },
    radioContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themes.colors.gray400,
        backgroundColor: themes.colors.SecondaryMain,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButton: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    radioButtonSelected: {
        borderColor: themes.colors.foundationSecondary,
        borderWidth: 5,
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    comingSoon: {
        position: 'absolute',
        zIndex: 999,
        right: 0,
    },
    noResultContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultText: {
        marginLeft: 10,
        fontWeight: '600',
    },
    submitContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    submitButtonTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    gradientBtn: {
        width: width * 0.92,
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 0.75,
        borderColor: '#5B7CE2',
    },
    submitButtonText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
        fontFamily: themes.fonts.fontFamily,
    },
    buttonDisabled: {
        opacity: 0.8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    infoText: {
        fontSize: 12,
        color: themes.colors.gray300,
        fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    },
});

export default ConnectYourAccounts;
