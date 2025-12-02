import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	descripcion: string;
}

interface DescInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const DescInput: React.FC<DescInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [open, setOpen] = useState(false);
	const [height, setHeight] = useState(50);

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="descripcion"
				rules={{
					required: "Debes poner una descripción",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<Animated.View
						style={[
							styles.inputWrapper,
							{ transform: [{ translateX: shakeAnim }] },
							errors.descripcion && styles.inputError,
						]}
					>
						<Ionicons
							name="document-lock-sharp"
							size={22}
							color="#ffbf8bff"
							style={{ marginRight: 10 }}
						/>

						<TextInput
							style={[styles.inputWithIcon]}
							placeholder="Descripción"
							placeholderTextColor="#999"
							onBlur={() => {
								onBlur();
								if (errors.descripcion) {
									shake();
									showErrorToast(
										"Error en la descripción",
										errors.descripcion.message!
									);
								}
							}}
							onChangeText={onChange}
							value={value}
							multiline={true}
							onContentSizeChange={(e) =>
								setHeight(e.nativeEvent.contentSize.height)
							}
						/>
					</Animated.View>
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
		padding: 1,
	},
	// Input
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 125,
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
		height: 125,
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

export default DescInput;
