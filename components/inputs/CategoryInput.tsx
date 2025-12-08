import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import AnimatedDropdown from "../animations/AnimateVerticalAccordion";

interface FormData {
	categoria: string;
}

interface CategoryInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [open, setOpen] = useState(false);

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="categoria"
				rules={{
					required: "Debes seleccionar una categoría",
				}}
				render={({ field: { onChange, value } }) => (
					<View>
						<TouchableOpacity
							onPress={() => setOpen(!open)}
							activeOpacity={0.8}
						>
							<Animated.View
								style={[
									styles.inputWrapper,
									{ transform: [{ translateX: shakeAnim }] },
									errors.categoria && styles.inputError,
								]}
							>
								<Ionicons
									name="map-outline"
									size={22}
									color="#ffbf8bff"
									style={{ marginRight: 10 }}
								/>

								<Text style={styles.categoriaText}>
									{value || "Seleccionar Categoría"}
								</Text>

								<Ionicons
									name={open ? "chevron-up" : "chevron-down"}
									size={20}
									color="#666"
								/>
							</Animated.View>
						</TouchableOpacity>

						<AnimatedDropdown isOpen={open} maxHeight={180}>
							<View style={styles.dropdown}>
								{[
									"AIRE_LIBRE",
									"RESTAURANTE",
									"MUSEO",
									"MONUMENTO",
								].map((r) => (
									<TouchableOpacity
										key={r}
										style={styles.option}
										onPress={() => {
											onChange(r);
											setOpen(false);
										}}
									>
										<Text style={styles.optionText}>
											{r}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</AnimatedDropdown>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	formContainer: {
		flex: 1,
		marginBottom: 10,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 50,
		borderWidth: 1,
		borderColor: "#ffbf8bff",
		borderRadius: 10,
		paddingHorizontal: 10,
		backgroundColor: "white",
	},
	categoriaText: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	dropdown: {
		backgroundColor: "white",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ffbf8bff",
		overflow: "hidden",
	},
	option: {
		padding: 12,
	},
	optionText: {
		fontSize: 16,
		color: "#333",
	},
	inputError: {
		borderColor: "red",
		backgroundColor: "#ffe6e6",
	},
});

export default CategoryInput;
