/*
* Muestra las pantallas de la app según el estado de autenticación.
* - Si el usuario no está autenticado, muestra la pantalla de login.
* - Si el usuario está autenticado, muestra la app principal.
*/

import React, { use } from 'react';
import { AuthNavigator } from './AuthNavigator';
import { BottomTabs } from './BottomTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 

const RootStack = createNativeStackNavigator();

export const AppNavigator = () => {
    return (
        <RootStack.Navigator>
            {/* Grupo 1: La aplicación principal */}
            <RootStack.Screen
                name="MainApp"
                component={BottomTabs}
                options={{ headerShown: false }}
            />

            {/* Grupo 2: El flujo de autenticación como un modal */}
            <RootStack.Screen
                name="Auth"
                component={AuthNavigator}
                options={{
                    presentation: 'modal',
                    headerShown: false,
                }}
            />
        </RootStack.Navigator>
    );
};

export type RootStackParamList = {
    MainApp: undefined;
    Auth: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;