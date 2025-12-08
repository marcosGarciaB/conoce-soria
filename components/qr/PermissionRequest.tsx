import HeaderGeneral from "@/components/common/HeaderItem";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface PermissionRequestProps {
	navigation: any;
}

const PermissionRequest = ({ navigation }: PermissionRequestProps) => {
	return (
		<>
			<HeaderGeneral
				title="Escáner QR"
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#FF6B00" />
				<Text style={styles.loadingText}>Solicitando permisos...</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		marginTop: 70,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
	},
});

export default PermissionRequest;
