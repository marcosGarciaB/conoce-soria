import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	Alert,
	Animated,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import ImageSearchModal from "../modals/ImageSearchModal";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
	name: string;
}

interface ImageUrlInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
	isProfilePhoto?: boolean;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
	control,
	errors,
	isProfilePhoto,
}) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [showSearchModal, setShowSearchModal] = useState(false);

	const name = isProfilePhoto ? "fotoPerfilUrl" : "imagenPortadaUrl";

	return (
		<View style={styles.formContainer}>
			<Controller
				control={control}
				name={name}
				rules={{
					required: "Debes poner una url",
				}}
				render={({ field: { onChange, onBlur, value } }) => {
					const handleSelectImagesFromSearch = (urls: string[]) => {
						if (urls.length > 0) {
							onChange(urls[0]);
						}
						setShowSearchModal(false);
					};

					const handlePaste = async () => {
						try {
							const text = await Clipboard.getStringAsync();
							if (text && text.trim()) {
								try {
									const urlObj = new URL(text.trim());
									if (
										["http:", "https:"].includes(
											urlObj.protocol
										)
									) {
										onChange(text.trim());
									} else {
										Alert.alert(
											"URL inválida",
											"El texto pegado no es una URL válida"
										);
									}
								} catch (error) {
									Alert.alert(
										"URL inválida",
										"El texto pegado no es una URL válida"
									);
								}
							} else {
								Alert.alert(
									"Portapapeles vacío",
									"No hay texto en el portapapeles"
								);
							}
						} catch (error) {
							Alert.alert(
								"Error",
								"No se pudo acceder al portapapeles"
							);
						}
					};

					return (
						<>
							<ImageSearchModal
								visible={showSearchModal}
								onClose={() => setShowSearchModal(false)}
								onSelectImages={handleSelectImagesFromSearch}
								skipResults={4}
								allowMultiple={false}
							/>

							<Text style={styles.label}>
								{ name === "fotoPerfilUrl"  ? "Foto de Perfil" : "Imágen de Portada"}
							</Text>

							<TouchableOpacity
								style={styles.searchGoogleButton}
								onPress={() => setShowSearchModal(true)}
								activeOpacity={0.7}
							>
								<Ionicons
									name="search"
									size={20}
									color="#FF6B00"
								/>
								<Text style={styles.searchGoogleButtonText}>
									Buscar imagen en Google
								</Text>
								<Ionicons
									name="image-outline"
									size={18}
									color="#FF6B00"
								/>
							</TouchableOpacity>

							<View style={styles.inputContainer}>
								<Animated.View
									style={[
										styles.inputWrapper,
										{
											transform: [
												{ translateX: shakeAnim },
											],
										},
										errors.name && styles.inputError,
									]}
								>
									<Ionicons
										name="link-outline"
										size={18}
										color="#999"
										style={{ marginRight: 8 }}
									/>
									<TextInput
										style={styles.inputWithIcon}
										placeholder="O pega la URL aquí..."
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
										multiline={false}
									/>
								</Animated.View>
								<TouchableOpacity
									style={styles.pasteButton}
									onPress={handlePaste}
									activeOpacity={0.7}
								>
									<Ionicons
										name="clipboard-outline"
										size={20}
										color="#FF6B00"
									/>
								</TouchableOpacity>
							</View>
						</>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	// General
	formContainer: {
		flex: 1,
		marginBottom: 10,
	},
	searchGoogleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff3e0",
		borderWidth: 2,
		borderColor: "#FF6B00",
		borderRadius: 10,
		paddingVertical: 14,
		paddingHorizontal: 15,
		marginBottom: 10,
		gap: 8,
	},
	searchGoogleButtonText: {
		color: "#FF6B00",
		fontSize: 15,
		fontWeight: "600",
		flex: 1,
		textAlign: "center",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	label: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 10,
	},
	// Input secundario
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		height: 45,
		fontSize: 14,
		backgroundColor: "#f9f9f9",
		borderColor: "#e0e0e0",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
	},
	inputWithIcon: {
		flex: 1,
		fontSize: 14,
		color: "#666",
		height: 45,
	},
	pasteButton: {
		width: 45,
		height: 45,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff3e0",
		borderWidth: 1,
		borderColor: "#FF6B00",
		borderRadius: 8,
	},
	// Error
	inputError: {
		borderColor: "red",
		backgroundColor: "#ffe6e6",
	},
});

export default ImageUrlInput;
