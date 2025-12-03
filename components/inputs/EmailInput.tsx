import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	email: string;
}

interface EmailInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const EmailInput: React.FC<EmailInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="email"
				rules={{
					required: "El email es obligatorio",
					pattern: {
						value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i,
						message: "Email no válido",
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<View>
						<Animated.View
							style={[
								styles.inputWrapper,
								{ transform: [{ translateX: shakeAnim }] },
								errors.email && styles.inputError,
							]}
						>
							<Ionicons
								name="mail"
								size={20}
								color="#ffbf8bff"
								style={{ marginRight: 8 }}
							/>
							<TextInput
								style={styles.inputWithIcon}
								placeholder="Email"
								placeholderTextColor="#999"
								onBlur={() => {
									onBlur();
									if (errors.email) {
										shake();
										showErrorToast(
											"Error en el email",
											errors.email.message!
										);
									}
								}}
								onChangeText={onChange}
								value={value}
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
		marginBottom: 20,
        padding: 1
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

export default EmailInput;
