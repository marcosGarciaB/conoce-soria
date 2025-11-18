/**
 * Este archivo define la navegación inferior (Bottom Tab Navigator)
 * de la aplicación. 
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioScreen from "../screens/InicioScreen";
import SearchScreen from "../screens/BuscadorScreen";
import DetailsScreen from "../screens/DetalleExperienciaScreen";
import { Ionicons } from "@expo/vector-icons";


type BottomTabParamList = {
    Inicio: undefined;
    Buscador: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator();

const InicioStackScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Inicio" component={InicioScreen} />
        </Stack.Navigator>
    );
};

const SearchStackScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{

                }}
            />
        </Stack.Navigator>
    );
};

export const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = "home";

                    if (route.name === "Inicio") iconName = "home-outline";
                    if (route.name === "Buscador") iconName = "search-outline";

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#FF6B00",
                tabBarInactiveTintColor: "gray",
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    elevation: 5,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    height: 60,
                    alignItems: 'stretch',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                },
            })}
        >
            <Tab.Screen name="Inicio" component={InicioScreen} />
            <Tab.Screen name="Buscador" component={SearchScreen} />
        </Tab.Navigator>
    );
};