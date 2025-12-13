import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import AnimatedDropdown from "../animations/AnimateVerticalAccordion";
import HorizontalAccordion from "../animations/AnimatedHorizontalAccordion";
import RenderCatButtons from "./RenderButtons";

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface FiltersProps {
	searchText?: string;
	setSearchText?: (text: string) => void;
	selectedCat: string | null;
	setSelectedCat: (cat: string | null) => void;
	categories: string[];
	onFilterByText?: (text: string) => void;
	onFilterByCategory: (cat: string) => void;
	onlyButtons?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
	searchText,
	setSearchText,
	selectedCat,
	setSelectedCat,
	categories,
	onFilterByText,
	onFilterByCategory,
	onlyButtons,
}) => {
	const [open, setOpen] = useState(false);

	const toggleOpen = () => {
		setOpen(!open);
	};

	const handleCategory = (cat: string) => {
		const newSelected = selectedCat === cat ? null : cat;
		setSelectedCat(newSelected);
		onFilterByCategory(cat);
		setOpen(!open);
	};

	return (
		<>
			{onlyButtons ? (
				<View style={styles.containerHome}>
					<TouchableOpacity
						onPress={toggleOpen}
						style={styles.arrowContainer}
					>
						<Ionicons
							name={open ? "chevron-back" : "chevron-forward"}
							size={24}
							color="black"
						/>
					</TouchableOpacity>

					<HorizontalAccordion isOpen={open} maxWidth={300}>
						<RenderCatButtons
							onPress={handleCategory}
							categories={categories}
							selectedCat={selectedCat ?? ""}
						/>
					</HorizontalAccordion>
				</View>
			) : (
				<View style={styles.containerSeeker}>
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

					<AnimatedDropdown isOpen={open} maxHeight={150}>
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

						<RenderCatButtons
							onPress={handleCategory}
							categories={categories}
							selectedCat={selectedCat ?? ""}
						/>
					</AnimatedDropdown>
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	arrowContainer: {
		marginRight: 8,
		backgroundColor: "white",
		padding: 5,
		borderRadius: 40,
	},
	containerSeeker: {
		backgroundColor: "#fff",
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
		marginVertical: 5,
	},
	containerHome: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
		marginVertical: 5,
	},
	// Botón de abrir/cerrar filtros
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
	},
	buttonText: {
		color: "#333",
		fontWeight: "600",
		fontSize: 16,
	},
	// Input
	searchContainer: {
		marginTop: 10,
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f9f9f9",
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 10,
		height: 40,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
});

export default Filters;
