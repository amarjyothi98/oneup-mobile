/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { supabase } from '../utils/SupabaseClient';
import 'react-native-url-polyfill/auto';
import { SvgUri } from 'react-native-svg';

const LinkedInAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Your app's custom URL scheme
    const scheme = 'mylinkedinapp';
    const redirectUrl = `${scheme}://login-callback`;

    useEffect(() => {
        const handleDeepLink = async (event: any) => {
            console.log('Deep link received:', event);
            if (!event.url) return;

            try {
                const { data: sessionData, error: sessionError } =
                    await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError.message);
                    setError(sessionError.message as any);
                    return;
                }

                if (sessionData?.session) {
                    console.log('Successfully signed in:', sessionData.session.user);
                    // Handle successful sign in here
                }
            } catch (err: any) {
                console.error('Deep link handling error:', err);
                setError(err.message);
            }
        };

        // Set up linking listener
        const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

        // Check initial URL
        Linking.getInitialURL()
            .then(url => {
                if (url) {
                    handleDeepLink({ url });
                }
            })
            .catch(err => console.error('Initial URL error:', err));

        return () => {
            linkingSubscription.remove();
        };
    }, []);

    const signInWithLinkedIn = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Starting LinkedIn sign in...');

            const { data, error: signInError } = await supabase.auth.signInWithOAuth({
                provider: 'linkedin',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (signInError) {
                throw signInError;
            }

            if (!data?.url) {
                throw new Error('No URL returned from Supabase');
            }

            console.log('Opening auth URL:', data.url);

            const isAvailable = await InAppBrowser.isAvailable();

            if (isAvailable) {
                const result = await InAppBrowser.open(data.url, {
                    ephemeralWebSession: true,
                    showTitle: false,
                    enableUrlBarHiding: true,
                    enableDefaultShare: false,
                });

                console.log('Browser result:', result);

                if (result.type === 'success' as any) {
                    // The deep link handler will process the authentication
                    console.log('Auth flow completed successfully');
                }
            } else {
                await Linking.openURL(data.url);
            }
            // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
        } catch (error: any) {
            console.error('LinkedIn sign in error:', error);
            setError(error.message);
            // alert(`Error signing in: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ paddingHorizontal: 5 }}>
            <TouchableOpacity
                onPress={signInWithLinkedIn}
                disabled={loading}
                style={{
                    backgroundColor: '#006FFD',
                    padding: 10,
                    borderRadius: 30,
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                }}
            >
                <SvgUri
                    uri={
                        'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/linkedinAuthLogo.svg'
                    }
                    width={18}
                    height={18}
                />
            </TouchableOpacity>

            {error && (
                <Text style={{ color: 'red', marginTop: 10 }}>
                    Error: {error}
                </Text>
            )}
        </View>
    );
};

export default LinkedInAuth;
