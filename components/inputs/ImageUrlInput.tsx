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
	name: string;
}

interface ImageUrlInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
	isProfilePhoto?: boolean
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ control, errors, isProfilePhoto  }) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [open, setOpen] = useState(false);
	const [height, setHeight] = useState(50);

	const name = isProfilePhoto ? "fotoPerfilUrl" : "imagenPortadaUrl";
	
	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name={name}
				rules={{
					required: "Debes poner una url",
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					
					<View>
						<TouchableOpacity
							onPress={() => setOpen(!open)}
							activeOpacity={0.8}
						>
							<Animated.View
								style={[
									styles.inputWrapper,
									{ transform: [{ translateX: shakeAnim }] },
									errors.name &&
										styles.inputError,
								]}
							>
								<Ionicons
									name="image-outline"
									size={22}
									color="#ffbf8bff"
									style={{ marginRight: 10 }}
								/>

								<TextInput
									style={styles.inputWithIcon}
									placeholder="https://..."
									placeholderTextColor="#999"
									onBlur={() => {
										onBlur();
										if (errors.name) {
											shake();
											showErrorToast(
												"Error en la imagen",
												errors.name.message!
											);
										}
									}}
									onChangeText={onChange}
									value={value}
									multiline={true}
									onContentSizeChange={(e) =>
										setHeight(
											e.nativeEvent.contentSize.height
										)
									}
								/>
							</Animated.View>
						</TouchableOpacity>
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
		height: 100,
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
		height: 100,
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

export default ImageUrlInput;
