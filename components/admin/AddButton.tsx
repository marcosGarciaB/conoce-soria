import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AddButton({
	title,
	onPress,
}: {
	title: string;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity style={styles.addButton} onPress={onPress}>
			<Ionicons name="add-circle-outline" size={24} color="white" />
			<Text style={styles.addButtonText}>{title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	addButton: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "#FF6B00",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#FF6B00",
		gap: 8,
		marginVertical: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 4,
		width: "95%",

	},
	addButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "white",
	},
});
