/*
 * Este es el archivo raíz de la aplicación.
 */
// Permitir reasignar fetch (solo a nivel de TypeScript)
declare var fetch: typeof globalThis.fetch;

const originalFetch = globalThis.fetch;

globalThis.fetch = async (...args) => {
    console.log("FETCH →", args);
    const response = await originalFetch(...args);
    console.log("RESPUESTA →", response);
    return response;
};


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
import { ExperienciaProvider } from "@/contexts/ExperienceContext";
import { RefreshProvider } from "@/contexts/RefreshContext";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AppContent = () => {
	const { status } = useAuth();

	if (status === "checking") {
		return <LoadingScreen />;
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
				<AuthProvider>
					<RefreshProvider>
						<ExperienciaProvider>
							<StatusBar barStyle={"dark-content"} />
							<NavigationContainer>
								<View style={styles.appContainer}>
									<AppContent />
									<Toast />
								</View>
							</NavigationContainer>
						</ExperienciaProvider>
					</RefreshProvider>
				</AuthProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: "#ffffffff",
	},
});
