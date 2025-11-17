/**
 * Este archivo define la navegación inferior (Bottom Tab Navigator)
 * de la aplicación. 
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InicioScreen from "../screens/InicioScreen";
import SearchScreen from "../screens/BuscadorScreen";
import { AppHeader } from "../components/common/AppHeader";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

type BottomTabParamList = {
    Inicio: undefined;
    Buscador: undefined;
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
                    backgroundColor: "#f8f2eaff",
                    borderRadius: 15,
                    height: 60,
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