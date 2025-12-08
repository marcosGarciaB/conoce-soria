import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RenderCatButtonsProps {
	onPress: (cat: string) => void;
	categories: string[];
	selectedCat: string;
}

const RenderCatButtons = ({ onPress, selectedCat, categories }: RenderCatButtonsProps) => {
	return (
		<View style={styles.buttonsContainer}>
			{categories.map((cat) => (
				<TouchableOpacity
					key={cat}
					style={[
						styles.button,
						selectedCat === cat && styles.buttonCategorySelected,
					]}
					onPress={() => onPress(cat)}
				>
					<Text
						style={[
							styles.buttonText,
							selectedCat === cat &&
								styles.buttonTextCategorySelected,
						]}
					>
						{cat
							.replace("_", " ")
							.toLowerCase()
							.replace(/\b\w/g, (l) => l.toUpperCase())}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	buttonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	buttonCategorySelected: {
		backgroundColor: "#FF6B00",
		borderColor: "#FF6B00",
	},
	buttonTextCategory: {
		color: "#FF6B00",
		fontWeight: "500",
	},
	buttonTextCategorySelected: {
		color: "#fff",
	},
	button: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#ccc",
		margin: 5,
	},
	buttonText: {
		color: "#333",
		fontWeight: "600",
		fontSize: 16,
	}
});

export default RenderCatButtons;