import { ImageSearchResult, imageSearchService } from "@/services/imageSearchService";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Animated,
	FlatList,
	Image,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useModalAnimation } from "../animations/modalAnimation";

interface ImageSearchModalProps {
	visible: boolean;
	onClose: () => void;
	onSelectImages: (urls: string[]) => void;
	skipResults?: number;
	allowMultiple?: boolean; 
}

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
	visible,
	onClose,
	onSelectImages,
	skipResults = 0,
	allowMultiple = true,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState<ImageSearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
	const { scale, opacity } = useModalAnimation(visible);

	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			return;
		}

		setLoading(true);
		setError(null);
		setHasSearched(true);

		try {
			const searchResults = await imageSearchService.searchGoogleImages(
				searchQuery.trim(),
				skipResults
			);

			if (searchResults.length === 0) {
				setError("No se encontraron imágenes. Intenta con otros términos.");
			} else {
				setError(null);
			}

			setResults(searchResults);
		} catch (err) {
			setError(
				"No se pudieron cargar imágenes. Puedes pegar la URL manualmente."
			);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleImage = (url: string) => {
		setSelectedImages((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(url)) {
				newSet.delete(url);
			} else {
				if (allowMultiple) {
					newSet.add(url);
				} else {
					newSet.clear();
					newSet.add(url);
				}
			}
			return newSet;
		});
	};

	const handleConfirm = () => {
		if (selectedImages.size > 0) {
			const urlsArray = Array.from(selectedImages);
			onSelectImages(urlsArray);
			handleClose();
		}
	};

	const handleClose = () => {
		setSearchQuery("");
		setResults([]);
		setError(null);
		setHasSearched(false);
		setSelectedImages(new Set());
		onClose();
	};


	return (
		<Modal
			animationType="fade"
			transparent
			visible={visible}
			onRequestClose={handleClose}
		>
			<Animated.View
				style={[
					styles.overlay,
					{
						opacity: opacity,
					},
				]}
			>
				<TouchableOpacity
					style={styles.overlayTouchable}
					activeOpacity={1}
					onPress={handleClose}
				/>
				<Animated.View
					style={[
						styles.modalContent,
						{
							transform: [{ scale }],
						},
					]}
				>
						<View style={styles.header}>
							<View style={styles.headerLeft}>
								<Text style={styles.title}>Buscar Imágenes</Text>
								{selectedImages.size > 0 && (
									<Text style={styles.selectedCount}>
										{selectedImages.size} seleccionada{selectedImages.size !== 1 ? "s" : ""}
									</Text>
								)}
							</View>
							<TouchableOpacity
								onPress={handleClose}
								style={styles.closeButton}
							>
								<Ionicons name="close" size={28} color="#333" />
							</TouchableOpacity>
						</View>

						<View style={styles.searchContainer}>
							<Ionicons
								name="search"
								size={22}
								color="#999"
								style={styles.searchIcon}
							/>
							<TextInput
								style={styles.searchInput}
								placeholder="Buscar imágenes..."
								placeholderTextColor="#999"
								value={searchQuery}
								onChangeText={setSearchQuery}
								onSubmitEditing={handleSearch}
								returnKeyType="search"
								autoCapitalize="none"
								autoCorrect={false}
							/>
							{searchQuery.length > 0 && (
								<TouchableOpacity
									onPress={() => setSearchQuery("")}
									style={styles.clearButton}
								>
									<Ionicons
										name="close-circle"
										size={20}
										color="#999"
									/>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[
									styles.searchButton,
									(!searchQuery.trim() || loading) &&
										styles.searchButtonDisabled,
								]}
								onPress={handleSearch}
								disabled={!searchQuery.trim() || loading}
							>
								{loading ? (
									<ActivityIndicator size="small" color="#fff" />
								) : (
									<Ionicons name="search" size={20} color="#fff" />
								)}
							</TouchableOpacity>
						</View>

						{loading && results.length === 0 ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color="#FF6B00" />
								<Text style={styles.loadingText}>
									Buscando imágenes...
								</Text>
							</View>
						) : error ? (
							<View style={styles.emptyContainer}>
								<Ionicons name="alert-circle" size={64} color="#ff9500" />
								<Text style={styles.errorText}>{error}</Text>
								<Text style={styles.emptySubtext}>
									Puedes cerrar este modal y pegar la URL manualmente
								</Text>
							</View>
						) : results.length > 0 ? (
							<View style={styles.resultsContainer}>
								<Text style={styles.resultsCount}>
									{results.length} imagen{results.length !== 1 ? "es" : ""}{" "}
									encontrada{results.length !== 1 ? "s" : ""}
								</Text>
								<FlatList
									data={results}
									numColumns={2}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => {
										const isSelected = selectedImages.has(item.url);
										return (
											<TouchableOpacity
												style={[
													styles.imageContainer,
													isSelected && styles.imageContainerSelected,
												]}
												onPress={() => handleToggleImage(item.url)}
												activeOpacity={0.7}
											>
												<Image
													source={{ uri: item.thumbnail }}
													style={styles.image}
													resizeMode="cover"
												/>
												{isSelected && (
													<View style={styles.imageOverlay}>
														<View style={styles.checkmarkContainer}>
															<Ionicons
																name="checkmark-circle"
																size={40}
																color="#fff"
															/>
														</View>
													</View>
												)}
												{!isSelected && (
													<View style={styles.imageBorder} />
												)}
											</TouchableOpacity>
										);
									}}
									contentContainerStyle={styles.flatListContent}
									showsVerticalScrollIndicator={true}
									scrollEnabled={true}
									style={styles.flatList}
								/>
							</View>
						) : hasSearched ? null : (
							<View style={styles.emptyContainer}>
								<Ionicons
									name="search-outline"
									size={64}
									color="#ccc"
								/>
								<Text style={styles.emptyText}>
									Escribe un término y presiona buscar
								</Text>
							</View>
						)}

						{results.length > 0 && (
							<View style={styles.footer}>
								<TouchableOpacity
									style={[styles.footerButton, styles.cancelButton]}
									onPress={handleClose}
									activeOpacity={0.7}
								>
									<Text style={styles.cancelButtonText}>Cancelar</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.footerButton,
										styles.confirmButton,
										selectedImages.size === 0 && styles.confirmButtonDisabled,
									]}
									onPress={handleConfirm}
									disabled={selectedImages.size === 0}
									activeOpacity={0.7}
								>
									<Text style={styles.confirmButtonText}>
										{allowMultiple
											? `Añadir ${selectedImages.size} imagen${selectedImages.size !== 1 ? "es" : ""}`
											: "Confirmar"}
									</Text>
								</TouchableOpacity>
							</View>
						)}
				</Animated.View>
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		position: "relative",
	},
	overlayTouchable: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.7)",
	},
	modalContent: {
		width: "100%",
		maxWidth: "95%",
		height: "90%",
		maxHeight: "90%",
		backgroundColor: "#fff",
		borderRadius: 28,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.3,
		shadowRadius: 25,
		elevation: 15,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 20,
	},
	headerLeft: {
		flex: 1,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		color: "#333",
		marginBottom: 4,
	},
	selectedCount: {
		fontSize: 14,
		color: "#FF6B00",
		fontWeight: "600",
	},
	closeButton: {
		padding: 5,
		marginLeft: 10,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		borderRadius: 12,
		paddingHorizontal: 15,
		height: 50,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	searchIcon: {
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	clearButton: {
		padding: 5,
		marginRight: 5,
	},
	searchButton: {
		backgroundColor: "#FF6B00",
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 5,
	},
	searchButtonDisabled: {
		backgroundColor: "#ccc",
	},
	loadingContainer: {
		height: 200,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 15,
		fontSize: 16,
		color: "#666",
	},
	resultsContainer: {
		flex: 1,
		minHeight: 200,
		maxHeight: "100%",
	},
	resultsCount: {
		fontSize: 14,
		color: "#666",
		marginBottom: 15,
		fontWeight: "500",
	},
	flatList: {
		flex: 1,
	},
	flatListContent: {
		paddingBottom: 10,
	},
	imageContainer: {
		flex: 1,
		margin: 5,
		aspectRatio: 1,
		borderRadius: 12,
		overflow: "hidden",
		position: "relative",
		borderWidth: 2,
		borderColor: "#e0e0e0",
	},
	imageContainerSelected: {
		borderColor: "#FF6B00",
		borderWidth: 3,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	imageBorder: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#e0e0e0",
	},
	imageOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(255, 107, 0, 0.6)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
	},
	checkmarkContainer: {
		backgroundColor: "rgba(255, 107, 0, 0.9)",
		borderRadius: 20,
		padding: 4,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		gap: 10,
	},
	footerButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	cancelButton: {
		backgroundColor: "#f5f5f5",
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	cancelButtonText: {
		color: "#666",
		fontSize: 16,
		fontWeight: "600",
	},
	confirmButton: {
		backgroundColor: "#FF6B00",
	},
	confirmButtonDisabled: {
		backgroundColor: "#ccc",
	},
	confirmButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	emptyContainer: {
		height: 300,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	emptyText: {
		marginTop: 20,
		fontSize: 16,
		color: "#999",
		textAlign: "center",
	},
	errorText: {
		marginTop: 20,
		fontSize: 16,
		color: "#ff9500",
		textAlign: "center",
		fontWeight: "500",
	},
	emptySubtext: {
		marginTop: 10,
		fontSize: 14,
		color: "#999",
		textAlign: "center",
	},
});

export default ImageSearchModal;

