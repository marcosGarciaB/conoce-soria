import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useDotsAnimation } from "../animations/loadingAnimation";

const LoadingScreen = () => {
	const { dot1, dot2, dot3 } = useDotsAnimation();

	return (
		<View style={styles.container}>
			<Text style={styles.loadingText}>
				<Animated.Text style={{ opacity: dot1 }}>.</Animated.Text>
				<Animated.Text style={{ opacity: dot2 }}>.</Animated.Text>
				<Animated.Text style={{ opacity: dot3 }}>.</Animated.Text>
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
