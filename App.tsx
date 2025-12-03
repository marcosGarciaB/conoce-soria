/*
 * - Este es el archivo raíz de tu aplicación.
 * - Su función es configurar los "proveedores de contexto" y el sistema de navegación.
 */
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import AnimatedSplash from "@/components/splash/AnimatedSplash";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AppContent = () => {
	const { status } = useAuth();

	if (status === "checking") {
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return status === "authenticated" ? <AuthNavigator /> : <AppNavigator />;
};

export default function App() {
	const [isSplashFinished, setSplashFinished] = useState(false);

	if (!isSplashFinished) {
		return <AnimatedSplash onFinish={() => setSplashFinished(true)} />;
	}

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<AuthProvider>
					<StatusBar barStyle={("dark-content")} />
					<NavigationContainer>
						<AppContent />
						<Toast />
					</NavigationContainer>
				</AuthProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
