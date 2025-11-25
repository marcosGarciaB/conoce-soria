/**
 * Lo que ve el usuario cuando no ha inciado sesión.
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import DetailsScreen from "@/screens/DetailsScreen";
import InicioScreen from "@/screens/HomeScreen";
import LoginScreen from "@/screens/LoginScreen";
import ManageUserScreen from "@/screens/ManageUserScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import { UserCredentials } from "@/services/authService";
import { ExperienciasResponse } from "@/services/experienceService";
import { BottomTabs } from "./BottomTabs";

export type RootStackParamList = {
    Inicio: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Details:  { experiencia: ExperienciasResponse };
    Profile: undefined;
    ManageUser: {user: UserCredentials};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="Inicio" component={InicioScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ManageUser" component={ManageUserScreen} />
        </Stack.Navigator>
    );
};

