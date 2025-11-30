import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authService } from "@/services/authService";
import Toast from "react-native-toast-message";
import EmailInput from "../components/inputs/EmailInput";
import PasswordInput from "../components/inputs/PasswordInput";
import { useAuth } from "../contexts/AuthContext";

type FormData = {
	email: string;
	password: string;
};

const LoginScreen = ({ navigation }: { navigation: any }) => {
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);

		try {
			const exists = await authService.emailExists(data.email);

			if (!exists) {
				Toast.show({
					type: "error",
					position: "top",
					text1: "No existe ninguna cuenta con ese correo.",
					visibilityTime: 2000,
					autoHide: true,
					topOffset: 60,
				});

			} else {
				try {
					await login({ email: data.email, password: data.password });
					let message = "Bienvenido " + data.email; 

					Toast.show({
						type: "success",
						position: "top",
						text1: message,
						visibilityTime: 3000,
						autoHide: true,
						topOffset: 60,
					});

					setTimeout(() => {
						navigation.navigate("MainTabs");
					}, 5000);
				} catch (error) {
					console.error("Error en login:", error);
				}
			}

		} catch (error) {
			console.error("Error en login:", error);

		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"
			>
				<SafeAreaView style={styles.container}>
					<View style={styles.innerContainer}>
						<View style={styles.formContainer}>
							<Text style={styles.title}>Iniciar Sesión</Text>

							<EmailInput control={control} errors={errors} />
							<PasswordInput control={control} errors={errors} />

							<TouchableOpacity
								style={styles.button}
								onPress={handleSubmit(onSubmit)}
								disabled={isLoading}
							>
								<Text style={styles.buttonText}>
									{isLoading
										? "Iniciando..."
										: "Iniciar Sesión"}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.buttonRegister}
								onPress={() => navigation.navigate("Register")}
							>
								<View style={styles.buttonWrapper}>
									<Ionicons
										name={"person-add-sharp"}
										size={20}
										color={"black"}
									/>
									<Text style={styles.buttonRegisterText}>
										Crear Cuenta
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		width: "100%",
	},
	formContainer: {
		width: "100%",
		maxWidth: 500,
		backgroundColor: "#f8f3f3ff",
		padding: 40,
		margin: 20,
		borderColor: "#7a7978ff",
		borderWidth: 1,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#d35800ff",
		textAlign: "center",
		marginBottom: 24,
	},
	// Botones
	buttonWrapper: {
		flexDirection: "row",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#d35800ff",
		paddingVertical: 14,
		borderRadius: 50,
		alignItems: "center",
		marginTop: 30,
		marginBottom: 10,
	},
	buttonRegister: {
		backgroundColor: "#ffeddfff",
		borderColor: "#f79e5aff",
		borderWidth: 1,
		paddingVertical: 14,
		borderRadius: 50,
		alignItems: "center",
		marginBottom: 16,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	buttonRegisterText: {
		color: "black",
		fontSize: 16,
	},
});

export default LoginScreen;
