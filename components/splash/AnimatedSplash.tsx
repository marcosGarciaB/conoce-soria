import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function ProfessionalSplash({ onFinish }: { onFinish: () => void }) {
	useEffect(() => {
		const timeout = setTimeout(async () => {
			await SplashScreen.hideAsync();
			onFinish();
		}, 3000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/images/splash.webp")}
				style={styles.image}
				resizeMode="contain"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white", // o el color que quieras
	},
	image: {
		width: "70%",  // controla el tamaño
		height: "70%", // y esto también
	},
});
