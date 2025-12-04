import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtomProps {
	title: string;
	onPress: () => void;
	isActive: boolean;
}

const ManageButtom = ({ title, onPress, isActive }: ButtomProps) => {
	return (
		<TouchableOpacity style={styles.optionButton} onPress={onPress}>
			<Ionicons name="people-outline" size={20} color="#333" />
			<Text style={styles.optionText}>{title}</Text>
			<Ionicons
				name={
					isActive
						? "chevron-down-outline"
						: "chevron-forward-outline"
				}
				size={20}
				color="#999"
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	optionButton: {
		backgroundColor: "white",
		paddingVertical: 14,
		paddingHorizontal: 15,
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 2,
		borderColor: "#d6d6d6ff",
		marginTop: 10,
		marginRight: 10,
		marginLeft: 10,
	},
	optionText: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
		color: "#333",
		fontWeight: "500",
	},
});

export default ManageButtom;
