import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	nombre: string;
}

interface NameInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const NameInput: React.FC<NameInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="nombre"
				rules={{
					required: "Nombre de usuario obligatorio",
					minLength: {
						value: 5,
						message: "Debe tener al menos 5 caracteres",
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<Animated.View
							style={[
								styles.inputWrapper,
								{ transform: [{ translateX: shakeAnim }] },
								errors.nombre && styles.inputError,
							]}
						>
							<Ionicons
								name="person"
								size={20}
								color="#ffbf8bff"
								style={{ marginRight: 8 }}
							/>
							<TextInput
								style={styles.inputWithIcon}
								placeholder="Nombre de usuario"
								placeholderTextColor="#999"
								onChangeText={onChange}
								keyboardType="default"
								autoCapitalize="sentences"
								autoCorrect={true}
								spellCheck={true}
								value={value}
								onBlur={() => {
									onBlur();
									if (errors.nombre) {
										shake();
										showErrorToast(
											"Error en el nombre",
											errors.nombre.message!
										);
									}
								}}
							/>
						</Animated.View>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	// General
	formContainer: {
		flex: 1,
		marginBottom: 10,
		padding: 1,
	},
	// Input
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 50,
		fontSize: 16,
		backgroundColor: "white",
		borderColor: "#ffbf8bff",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 10,
	},
	inputWithIcon: {
		flex: 1,
		fontSize: 16,
		color: "#333",
		height: 50,
	},
	iconLeft: {
		marginRight: 8,
	},
	// Error
	inputError: {
		borderColor: "red",
		backgroundColor: "#ffe6e6",
	},
});

export default NameInput;
