import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	titulo: string;
}

interface TitleInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const TitleInput: React.FC<TitleInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="titulo"
				rules={{
					required: "Debes poner un título",
					minLength: { value: 3, message: "Mínimo 3 caracteres" },
				}}
				render={({ field: { onChange, value, onBlur } }) => (
					<Animated.View
						style={[
							styles.inputWrapper,
							{ transform: [{ translateX: shakeAnim }] },
							errors.titulo && styles.inputError,
						]}
					>
						<Ionicons
							name="book-outline"
							size={22}
							color="#ffbf8bff"
							style={{ marginRight: 10 }}
						/>
						<TextInput
							style={styles.inputWithIcon}
							placeholder="Título"
							placeholderTextColor="#999"
							onChangeText={onChange}
							value={value}
							onBlur={() => {
								onBlur();
								if (errors.titulo) {
									shake();
									showErrorToast(
										"Error en el título",
										errors.titulo.message!
									);
								}
							}}
						/>
					</Animated.View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	formContainer: { 
		flex: 1, 
		marginBottom: 10 ,
		padding: 1,	
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 50,
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
		height: 50 
	},
	inputError: {
		borderColor: "red",
		backgroundColor: "#ffe6e6",
	},
});

export default TitleInput;
