import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ButtonLocationProps {
	isGlobal?: boolean;
	onPress: () => void;
}

const ButtonLocation = ({ isGlobal, onPress }: ButtonLocationProps) => {
	return (
		<View style={[styles.buttonsContainer, isGlobal && {bottom: 60}]}>
			<TouchableOpacity style={styles.button} onPress={onPress}>
				{isGlobal ? (
					<Ionicons name="planet" size={20} color="grey" />
				) : (
					<Ionicons name="person" size={20} color="grey" />
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonsContainer: {
		position: "absolute",
		bottom: 10,
		right: 20,
	},
	button: {
		backgroundColor: "#ffffffff",
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 25,
		marginBottom: 10,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
});

export default ButtonLocation;
