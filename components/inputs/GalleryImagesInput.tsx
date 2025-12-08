import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
	Alert,
	Animated,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import ImageSearchModal from "../modals/ImageSearchModal";

interface FormData {
	galeriaImagenes: string[];
}

interface GalleryImagesInputProps {
	control: Control<any>;
	errors: FieldErrors<FormData>;
}

const GalleryImagesInput: React.FC<GalleryImagesInputProps> = ({ control, errors }) => {
	const { shakeAnim, shake } = useShakeAnimation();
	const [currentUrl, setCurrentUrl] = useState("");
	const [showSearchModal, setShowSearchModal] = useState(false);

	const validateAndAddUrl = (url: string, onChange: (images: string[]) => void, images: string[]) => {
		const trimmedUrl = url.trim();
		
		if (!trimmedUrl) return;
		
		try {
			const urlObj = new URL(trimmedUrl);
			if (!['http:', 'https:'].includes(urlObj.protocol)) {
				throw new Error('Protocolo no válido');
			}
			
			if (images.includes(trimmedUrl)) {
				Alert.alert(
					"Imagen duplicada",
					"Esta imagen ya está en la galería"
				);
				return;
			}
			
			onChange([...images, trimmedUrl]);
			setCurrentUrl("");
		} catch (error) {
			Alert.alert(
				"URL inválida",
				"Por favor, ingresa una URL válida.\nDebe comenzar con http:// o https://"
			);
		}
	};

	return (
		<View style={styles.formContainer}>
			<Text style={styles.label}>Galería de Imágenes</Text>
			
			<TouchableOpacity
				style={styles.searchGoogleButton}
				onPress={() => setShowSearchModal(true)}
				activeOpacity={0.7}
			>
				<Ionicons name="search" size={20} color="#FF6B00" />
				<Text style={styles.searchGoogleButtonText}>
					Buscar imágenes en Google
				</Text>
				<Ionicons name="images-outline" size={18} color="#FF6B00" />
			</TouchableOpacity>

			<Controller
				control={control}
				name="galeriaImagenes"
				defaultValue={[]}
				render={({ field: { onChange, value } }) => {
					const images = value || [];

					const handleAddImage = () => {
						validateAndAddUrl(currentUrl, onChange, images);
					};

					const handlePaste = async () => {
						try {
							const text = await Clipboard.getStringAsync();
							if (text && text.trim()) {
								setCurrentUrl(text.trim());
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

					const handleRemoveImage = (index: number) => {
						const newImages = images.filter((_: string, i: number) => i !== index);
						onChange(newImages);
					};

					const handleSelectImagesFromSearch = (urls: string[]) => {
						if (!urls || urls.length === 0) return;

						const validUrls: string[] = [];
						const currentImagesSet = new Set(images);

						urls.forEach((url) => {
							const trimmedUrl = url.trim();
							
							if (!trimmedUrl) return;
							
							try {
								const urlObj = new URL(trimmedUrl);
								if (!['http:', 'https:'].includes(urlObj.protocol)) {
									return;
								}
								
								if (!currentImagesSet.has(trimmedUrl)) {
									validUrls.push(trimmedUrl);
									currentImagesSet.add(trimmedUrl);
								}
							} catch (error) {
								return;
							}
						});

						if (validUrls.length > 0) {
							onChange([...images, ...validUrls]);
						}
					};

					return (
						<View>
							<ImageSearchModal
								visible={showSearchModal}
								onClose={() => setShowSearchModal(false)}
								onSelectImages={handleSelectImagesFromSearch}
								skipResults={4}
								allowMultiple={true}
							/>

							<View style={styles.addImageContainer}>
								<Animated.View
									style={[
										styles.inputWrapper,
										{ transform: [{ translateX: shakeAnim }] },
										errors.galeriaImagenes && styles.inputError,
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
										onChangeText={setCurrentUrl}
										value={currentUrl}
										multiline={false}
										autoCapitalize="none"
										autoCorrect={false}
										keyboardType="url"
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
								<TouchableOpacity
									style={styles.addButton}
									onPress={handleAddImage}
									disabled={!currentUrl.trim()}
									activeOpacity={0.7}
								>
									<Ionicons
										name="add-circle"
										size={24}
										color={currentUrl.trim() ? "#FF6B00" : "#ccc"}
									/>
								</TouchableOpacity>
							</View>

							{images.length > 0 && (
								<View style={styles.imagesListContainer}>
									<View style={styles.imagesHeader}>
										<Text style={styles.imagesCount}>
											{images.length} imagen{images.length !== 1 ? "es" : ""} añadida{images.length !== 1 ? "s" : ""}
										</Text>
									</View>
									<ScrollView 
										style={styles.imagesList}
										nestedScrollEnabled={true}
									>
										{images.map((url: string, index: number) => (
											<View key={index} style={styles.imageItem}>
												<View style={styles.imageUrlContainer}>
													<Ionicons
														name="image"
														size={16}
														color="#FF6B00"
														style={{ marginRight: 8 }}
													/>
													<Text style={styles.imageUrl} numberOfLines={1}>
														{url}
													</Text>
												</View>
												<TouchableOpacity
													style={styles.removeButton}
													onPress={() => handleRemoveImage(index)}
												>
													<Ionicons
														name="close-circle"
														size={24}
														color="#ff4444"
													/>
												</TouchableOpacity>
											</View>
										))}
									</ScrollView>
								</View>
							)}
						</View>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	formContainer: {
		flex: 1,
		marginBottom: 10,
		padding: 1,
	},
	label: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
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
	addImageContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
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
	addButton: {
		width: 45,
		height: 45,
		alignItems: "center",
		justifyContent: "center",
	},
	inputError: {
		borderColor: "red",
		backgroundColor: "#ffe6e6",
	},
	imagesListContainer: {
		marginTop: 15,
		maxHeight: 200,
		borderWidth: 1,
		borderColor: "#ffbf8bff",
		borderRadius: 10,
		backgroundColor: "#f9f9f9",
	},
	imagesHeader: {
		paddingHorizontal: 12,
		paddingTop: 10,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	imagesCount: {
		fontSize: 13,
		color: "#666",
		fontWeight: "500",
	},
	imagesList: {
		padding: 10,
	},
	imageItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 8,
		paddingHorizontal: 10,
		marginBottom: 5,
		backgroundColor: "white",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	imageUrlContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		marginRight: 10,
	},
	imageUrl: {
		flex: 1,
		fontSize: 14,
		color: "#666",
	},
	removeButton: {
		padding: 4,
	},
});

export default GalleryImagesInput;

