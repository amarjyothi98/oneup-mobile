/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/SupabaseClient';
import { SvgUri } from 'react-native-svg';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '891888813298-bnnhs75be09thlunklv972jt6ap9ued0.apps.googleusercontent.com',
  offlineAccess: true,
});

export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play services
    await GoogleSignin.hasPlayServices();

    // Sign in with Google
    const { idToken }: any = await GoogleSignin.signIn();

    // Get Supabase session using Google token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) { throw error; }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return {
      user: null,
      session: null,
      error,
    };
  }
};

// Sign out function
export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    await supabase.auth.signOut();
    return { error: null };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { error };
  }
};

// Example usage in a component:
export const SignInButton = () => {
  const handleSignIn = async () => {
    const { user, error } = await signInWithGoogle();
    if (error) {
      Alert.alert('Error', error as any);
      return;
    }
    // Handle successful sign-in
    console.log('Signed in user:', user);
  };

  return (
    <TouchableOpacity
      onPress={handleSignIn}
      style={{
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 30,
        marginRight: 6,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <SvgUri
        uri={
          'https://stocks-images.s3.us-east-2.amazonaws.com/OneUpMobileApp/googleAuthLogo.svg'
        }
        width={18}
        height={18}
      />
    </TouchableOpacity>
  );
};