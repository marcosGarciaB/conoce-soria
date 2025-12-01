import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingScreen = () => (
	<View style={styles.container}>
		<ActivityIndicator size="large" color="#FF6B00" />
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#FAFAFA",
	},
	text: {
		marginTop: 12,
		fontSize: 16,
		fontWeight: "500",
		color: "#666",
		textAlign: "center",
	},
});

export default LoadingScreen;
