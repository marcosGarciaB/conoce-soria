import { BlurView } from "expo-blur";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useDotsAnimation } from "../animations/loadingAnimation";

const LoadingScreen = () => {
	const { dot1, dot2, dot3 } = useDotsAnimation();

	return (
		<View style={styles.container}>
			<BlurView intensity={10} style={styles.glassCard}>

				<Text style={styles.loadingText}>
					<Animated.Text style={{ opacity: dot1 }}>.</Animated.Text>
					<Animated.Text style={{ opacity: dot2 }}>.</Animated.Text>
					<Animated.Text style={{ opacity: dot3 }}>.</Animated.Text>
				</Text>
				<View style={styles.backgroundGlow} />
			</BlurView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backgroundGlow: {
		position: "absolute",
		top: 65,
		width: 140,
		height: 50,
		borderRadius: 100,
		backgroundColor: "#9BB6FF33",
		shadowColor: "#9BB6FF",
		shadowOpacity: 0.4,
		shadowRadius: 40,
		shadowOffset: { width: 0, height: 0 },
	},
	glassCard: {
		width: 220,
		height: 220,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.35)",
		overflow: "hidden",
		backdropFilter: "blur(20px)",
	},
	loadingText: {
		position: "absolute",
		top: 0,
		fontSize: 90,
		fontWeight: "600",
		color: "#4A4A4A",
		textAlign: "center",
	},
});

export default LoadingScreen;
