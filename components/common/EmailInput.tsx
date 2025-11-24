import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Animated, StyleSheet, TextInput, Vibration, View } from "react-native";
import Toast from "react-native-toast-message";

interface FormData {
	email: string;
}

interface EmailInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const EmailInput: React.FC<EmailInputProps> = ({ control, errors }) => {
	const shakeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (errors.email) {
			Vibration.vibrate(500);

			Animated.sequence([
				Animated.timing(shakeAnim, {
					toValue: 5, // Mover a la derecha
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: -5, // Mover a la izquierda
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: 5, // Mover a la derecha
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: -5, // Mover a la izquierda
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(shakeAnim, {
					toValue: 0, // Posición inicial
					duration: 100,
					useNativeDriver: true,
				}),
			]).start();

			Toast.show({
				type: "error",
				position: "top",
				text1: "Error en el email del usuario",
				text2: errors.email.message,
				visibilityTime: 4000,
				autoHide: true,
				topOffset: 60,
			});
		}
	}, [errors.email]);

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
								onBlur={onBlur}
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
		backgroundColor: "white",
		width: "95%",
		borderRadius: 10,
		marginBottom: 60,
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
