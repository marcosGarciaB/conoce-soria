/*
* - Este es el archivo raíz de tu aplicación.
* - Su función es configurar los "proveedores de contexto" y el sistema de navegación.
*/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from './navigation/AuthNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppContent = () => {
  const { status } = useAuth();

  // Muestra una pantalla de carga mientras se verifica el token.
  if (status === 'checking') {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});