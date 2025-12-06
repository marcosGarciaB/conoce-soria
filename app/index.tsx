/*
 * Este es el archivo raíz de la aplicación.
 */

import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import LoadingScreen from "@/components/common/Loading";
import AnimatedSplash from "@/components/splash/AnimatedSplash";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AppContent = () => {
	const { status } = useAuth();

	if (status === "checking") {
		return (
			<LoadingScreen />
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
			<GestureHandlerRootView>
				<Toast />
				<AuthProvider>
					<StatusBar barStyle={("dark-content")} />
					<NavigationContainer>
						<View style={styles.appContainer}>
							<AppContent />
						</View>
					</NavigationContainer>
				</AuthProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: "#ffffffff",
	}
});
