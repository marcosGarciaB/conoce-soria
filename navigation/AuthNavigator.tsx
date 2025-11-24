/**
 * Navegador para cuando el usuario cuando haya iniciado sesión.
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailsScreen from "../screens/DetailsScreen";
import { ExperienciasResponse } from "../services/experienceService";
import { BottomTabs } from "./BottomTabs";


export type AuthStackParamList = {
    Inicio: undefined;
    Buscador: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Details: { experiencia: ExperienciasResponse };
    Profile: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};

