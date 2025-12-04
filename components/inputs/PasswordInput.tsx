import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	Animated,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	password: string;
}

interface PasswordInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
	initialData?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
	control,
	errors,
	initialData,
}) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [showPass, setShowPass] = useState(false);

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="password"
				rules={{
					required: !initialData
						? "Debes ingresar una contraseña"
						: false,
					minLength: {
						value: 8,
						message: "Debe tener al menos 8 caracteres",
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<Animated.View
							style={[
								styles.inputWrapper,
								{ transform: [{ translateX: shakeAnim }] },
								errors.password && styles.inputError,
							]}
						>
							<Ionicons
								name="lock-closed-outline"
								size={20}
								color="#ffbf8bff"
								style={{ marginRight: 8 }}
							/>
							<TextInput
								style={styles.inputWithIcon}
								placeholder="Contraseña"
								placeholderTextColor="#999"
								secureTextEntry={!showPass}
								onBlur={() => {
									onBlur();
									if (errors.password) {
										shake();
										showErrorToast(
											"Error en la contraseña",
											errors.password.message!
										);
									}
								}}
								onChangeText={onChange}
								value={value}
							/>

							<TouchableOpacity
								onPress={() => setShowPass(!showPass)}
							>
								<Ionicons
									name={
										showPass
											? "eye-off-outline"
											: "eye-outline"
									}
									size={20}
									color="#ffbf8bff"
								/>
							</TouchableOpacity>
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

export default PasswordInput;
