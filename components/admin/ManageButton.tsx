import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtomProps {
	title: string;
	onPress: () => void;
	isActive: boolean;
}

const Buttom = ({ title, onPress, isActive }: ButtomProps) => {
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
		backgroundColor: "#F7F7F7",
		paddingVertical: 14,
		paddingHorizontal: 15,
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E6E6E6",
	},
	optionText: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
		color: "#333",
		fontWeight: "500",
	},
});

export default Buttom;
