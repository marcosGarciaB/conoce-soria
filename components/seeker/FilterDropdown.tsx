import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	LayoutAnimation,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface FiltersProps {
	searchText: string;
	setSearchText: (text: string) => void;
	selectedCat: string | null;
	setSelectedCat: (cat: string | null) => void;
	categories: string[];
	onFilterByText: (text: string) => void;
	onFilterByCategory: (cat: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
	searchText,
	setSearchText,
	selectedCat,
	setSelectedCat,
	categories,
	onFilterByText,
	onFilterByCategory,
}) => {
	const [open, setOpen] = useState(false);

	const toggleOpen = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setOpen(!open);
	};

	const handleCategory = (cat: string) => {
		const newSelected = selectedCat === cat ? null : cat;
		setSelectedCat(newSelected);
		onFilterByCategory(cat);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.button}
				onPress={() => toggleOpen()}
			>
				<Text style={styles.buttonText}>
					{open ? "Cerrar Filtros" : "Abrir Filtros"}
				</Text>
				<Ionicons
					name={open ? "chevron-up" : "chevron-down"}
					size={20}
					color="black"
				/>
			</TouchableOpacity>

			{open && (
				<View style={styles.filtersContainer}>
					<View style={styles.searchContainer}>
						<Ionicons
							name="search-outline"
							size={20}
							color="#c7a899"
							style={{ marginHorizontal: 10 }}
						/>
						<TextInput
							style={styles.input}
							placeholder="Buscar experiencia"
							placeholderTextColor="#c7a899"
							value={searchText}
							onChangeText={onFilterByText}
						/>
					</View>

					<View style={styles.buttonsContainer}>
						{categories.map((cat) => (
							<TouchableOpacity
								key={cat}
								style={[
									styles.button,
									selectedCat === cat &&
										styles.buttonCategorySelected,
								]}
								onPress={() => handleCategory(cat)}
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
										.replace(/\b\w/g, (l) =>
											l.toUpperCase()
										)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fffdfdff",
		marginVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 30,
		paddingVertical: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
	},
	// Botón de abrir/cerrar filtros
	button: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "black",
	},
	buttonText: {
		color: "#333",
		fontWeight: "600",
		fontSize: 16,
	},
	filtersContainer: {
		marginTop: 5,
	},
	// Input
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffffff",
		borderColor: "grey",
		borderWidth: 1,
		borderRadius: 30,
		paddingHorizontal: 10,
		height: 40,
		marginBottom: 5,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	// Botones de categorías
	buttonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 5,
	},
	buttonCategory: {
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#FF6B00",
		backgroundColor: "#fff",
		marginRight: 5,
		marginBottom: 5,
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
});

export default Filters;
