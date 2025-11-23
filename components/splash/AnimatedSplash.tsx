import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
	const opacity = useSharedValue(0);
	const scale = useSharedValue(0.7);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		//transform: [{ scale: scale.value }],
	}));

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 800 });
		scale.value = withTiming(1, { duration: 800 });

		setTimeout(async () => {
			opacity.value = withTiming(0, { duration: 350 });
			scale.value = withTiming(0.8, { duration: 350 });

			await SplashScreen.hideAsync();
			onFinish();
		}, 1600);
	}, []);

	return (
		<LinearGradient
			colors={["#FFF8F8", "#FFEBD1"]}
			style={styles.container}
		>
			<Animated.View style={[styles.logoContainer, animatedStyle]}>
				<Image
					source={require("../../assets/images/splash.png")}
					style={styles.logo}
					resizeMode="contain"
				/>
			</Animated.View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	logoContainer: {
		width: 250,
		height: 250,
		padding: 15,
		borderRadius: 999,
		backgroundColor: "#fff8f8ff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 14,
		elevation: 10,
		borderWidth: 4,
		borderColor: "#ffcc9aff",
	},
	logo: {
		width: "100%",
		height: "100%",
	},
});
