import useShakeAnimation from "@/hooks/useShakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	direccion: string;
}

interface DirectionInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const DirectionInput: React.FC<DirectionInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [open, setOpen] = useState(false);
	const [height, setHeight] = useState(50);

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name="direccion"
				rules={{
					required: "Debes poner una dirección",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<Animated.View
						style={[
							styles.inputWrapper,
							{ transform: [{ translateX: shakeAnim }] },
							errors.direccion && styles.inputError,
						]}
					>
						<Ionicons
							name="location-outline"
							size={22}
							color="#ffbf8bff"
							style={{ marginRight: 10 }}
						/>

						<TextInput
							style={[styles.inputWithIcon]}
							placeholder="Dirección"
							placeholderTextColor="#999"
							onBlur={() => {
								onBlur;
								if (errors.direccion) {
									shake();
									showErrorToast(
										"Error en la dirección",
										errors.direccion.message!
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
		height: 80,
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
		height: 80,
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

export default DirectionInput;
