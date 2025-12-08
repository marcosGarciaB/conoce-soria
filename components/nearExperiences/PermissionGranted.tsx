import { StyleSheet, Text, View } from "react-native";
import HeaderGeneral from "../common/HeaderItem";

interface PermissionProps {
	onPress: () => void;
}

const PermissionGranted = ({ onPress }: PermissionProps) => {
	return (
		<>
			<HeaderGeneral
				title="Experiencias cercanas"
				icon="chevron-back"
				onPress={onPress}
			/>
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>
					Se necesitan permisos de ubicación para mostrar experiencias
					cercanas
				</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		paddingTop: 56,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});

export default PermissionGranted;
