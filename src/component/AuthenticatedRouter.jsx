import React, { useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../untills/hooks/useAuth';
import { useAuth } from '../untills/hooks/useAuth';

export const RequireAuth = ({ children }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !user && isFocused) {
      navigation.navigate('Login');
    }
  }, [loading, user, isFocused, navigation]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator /> 
      </View>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
  