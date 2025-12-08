import HeaderGeneral from "@/components/common/HeaderItem";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PermissionDeniedProps {
	navigation: any;
	onRequestPermission: () => void;
}

const PermissionDenied = ({
	navigation,
	onRequestPermission,
}: PermissionDeniedProps) => {
	return (
		<>
			<HeaderGeneral
				title="Escáner QR"
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>
			<View style={styles.centerContainer}>
				<Ionicons name="camera-outline" size={64} color="#999" />
				<Text style={styles.permissionText}>
					Se necesita permiso para acceder a la cámara
				</Text>
				<TouchableOpacity
					style={styles.permissionButton}
					onPress={onRequestPermission}
				>
					<Text style={styles.permissionButtonText}>
						Conceder permiso
					</Text>
				</TouchableOpacity>
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
	permissionText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 24,
	},
	permissionButton: {
		backgroundColor: "#FF6B00",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 10,
	},
	permissionButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
});

export default PermissionDenied;
