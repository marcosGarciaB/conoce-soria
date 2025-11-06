/*
* - Este es el archivo raíz de tu aplicación.
* - Su función es configurar los "proveedores de contexto" y el sistema de navegación.
*/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthNavigator } from './navigation/AuthNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppContent = () => {
  // Usamos el hook useAuth para suscribirnos a los cambios de estado.
  const { status } = useAuth(); 
  
  // Muestra una pantalla de carga mientras se verifica el token.
  if (status === 'checking') {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Esta es la lógica que debería funcionar automáticamente.
  // Cuando 'status' cambie de 'not-authenticated' a 'authenticated',
  // React reemplazará AuthNavigator con AppNavigator.
  return status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />;
};

// El componente App solo se encarga de envolver todo en los proveedores.
export default function App() {
  return (
    // AuthProvider DEBE envolver a NavigationContainer y AppContent.
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});