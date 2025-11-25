import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	Animated,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Vibration,
	View,
} from "react-native";
import Toast from "react-native-toast-message";

interface FormData {
	password: string;
}

interface PasswordInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
	initialData?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ control, errors, initialData }) => {
	const shakeAnim = useRef(new Animated.Value(0)).current;
	const [showPass, setShowPass] = useState(false);

	useEffect(() => {
		if (errors.password) {
			Vibration.vibrate(500);

			Animated.sequence([
				Animated.timing(shakeAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
				Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
				Animated.timing(shakeAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
				Animated.timing(shakeAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
				Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
			]).start();

			Toast.show({
				type: "error",
				position: "top",
				text1: "Error en la contraseña del usuario",
				text2: errors.password.message,
				visibilityTime: 4000,
				autoHide: true,
				topOffset: 60,
			});
		}
	}, [errors.password]);

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
								secureTextEntry={!showPass}
								onBlur={onBlur}
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
		width: "95%",
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

export default PasswordInput;
