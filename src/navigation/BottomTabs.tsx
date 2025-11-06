/**
 * Este archivo define la navegación inferior (Bottom Tab Navigator)
 * de la aplicación. 
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InicioScreen from "../screens/InicioScreen";
import { AppHeader } from "../components/common/AppHeader";

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitle: 'Nombre de la App',
                headerRight: () => <AppHeader />, 
            }}
        >
            <Tab.Screen name="Inicio" component={InicioScreen} />
            {/* Aquí pondré más pantallas como Buscador, Pasaporte, etc. */}

        </Tab.Navigator>
    );
};