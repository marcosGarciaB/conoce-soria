/*
* - Este es el archivo raíz de tu aplicación.
* - Su función es configurar los "proveedores de contexto" y el sistema de navegación.
*/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
//import { PasaporteProvider } from './contexts/PasaporteContext';
//import { UiProvider } from './contexts/UiContext';

export default function App() {
  return (
    
    <AuthProvider>

      <NavigationContainer>

        <AppNavigator />

      </NavigationContainer>

    </AuthProvider>
  );
}