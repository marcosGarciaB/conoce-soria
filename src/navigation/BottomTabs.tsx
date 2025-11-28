/**
 * Navegación inferior de la app (Bottom Tabs)
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import InicioScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SeekerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PassportScreen from "../screens/PassportScreen";

type BottomTabParamList = {
    Inicio: undefined;
    Buscador: undefined;
    Profile: undefined;
    PassportScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

                    if (route.name === "Inicio") iconName = "home-outline";
                    if (route.name === "Buscador") iconName = "search-outline";
                    if (route.name === "Profile") iconName = "person-outline";

                    return (
                        <View
                            style={{
                                width: 80,
                                height: 50,
                                borderRadius: 45,
                                backgroundColor: focused ? "#faebd7ff" : "transparent",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 20,
                            }}
                        >
                            <Ionicons name={iconName} size={28} color={color} />
                        </View>
                    );
                },
                tabBarActiveTintColor: "#FF6B00",
                tabBarInactiveTintColor: "gray",
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    elevation: 5,
                    backgroundColor: "white",
                    borderRadius: 30,
                    height: 60,
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                },
            })}
        >

            <Tab.Screen name="Inicio" component={InicioScreen} />
            <Tab.Screen name="Buscador" component={SearchScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
