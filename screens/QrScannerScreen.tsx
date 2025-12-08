import { useModalAnimation } from "@/components/animations/modalAnimation";
import Header from "@/components/common/HeaderItem";
import { useAuth } from "@/contexts/AuthContext";
import { useRefresh } from "@/contexts/RefreshContext";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { passportService } from "@/services/passportService";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";

import {
	ActivityIndicator,
	Animated,
	Keyboard,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

type QrScannerRoute = RouteProp<RootStackParamList, "QrScanner">;

interface QrScannerScreenProps {
	navigation: any;
	route: QrScannerRoute;
}

const QrScannerScreen = ({ navigation, route }: QrScannerScreenProps) => {
	const { experienciaId } = route.params;
	const { token } = useAuth();
	const { refreshPassport, refreshTop, refreshComments } = useRefresh();
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [opinionModalVisible, setOpinionModalVisible] = useState(false);
	const [scannedUID, setScannedUID] = useState<string | null>(null);
	const [opinion, setOpinion] = useState("");
	const [registering, setRegistering] = useState(false);

	useEffect(() => {
		console.log("QrScannerScreen montado - experienciaId:", experienciaId);
		return () => {
			console.log("QrScannerScreen desmontado");
		};
	}, []);

	useEffect(() => {
		console.log("Estado de permisos:", JSON.stringify(permission, null, 2));
		if (!permission) {
			console.log("Solicitando permisos de cámara...");
			requestPermission().then((result) => {
				console.log("Resultado de solicitud de permisos:", JSON.stringify(result, null, 2));
			});
		} else if (permission.granted) {
			console.log("Permisos de cámara concedidos - canAskAgain:", permission.canAskAgain);
		} else {
			console.log("Permisos de cámara denegados - canAskAgain:", permission.canAskAgain);
		}
	}, [permission]);

	const handleBarCodeScanned = (result: BarcodeScanningResult) => {
		console.log("handleBarCodeScanned llamado con:", result);
		if (scanned) {
			console.log("Ya escaneado, ignorando");
			return;
		}
		console.log("Procesando código escaneado - Tipo:", result.type, "Data:", result.data);
		if (result.type === "qr" || result.data) {
			setScanned(true);
			setScannedUID(result.data);
			setOpinionModalVisible(true);
		}
	};

	const handleRegister = async () => {
		if (!token || !scannedUID) return;

		setRegistering(true);
		try {
			await passportService.registrar(scannedUID, opinion, token);
			
			refreshPassport();
			refreshTop();
			refreshComments(experienciaId);
			
			Toast.show({
				type: "success",
				text1: "¡Experiencia registrada!",
				text2: "La experiencia se ha añadido a tu pasaporte",
				position: "top",
			});
			setOpinionModalVisible(false);
			setScanned(false);
			setScannedUID(null);
			setOpinion("");
			navigation.goBack();
		} catch (error: any) {
			console.error("Error al registrar experiencia:", error);
			let errorMessage = "No se pudo registrar la experiencia";
			
			if (error?.message?.includes("ya registrada") || error?.message?.includes("already")) {
				errorMessage = "Ya has registrado esta experiencia";
			} else if (error?.message?.includes("inválido") || error?.message?.includes("invalid")) {
				errorMessage = "El código QR no es válido";
			} else if (error?.message?.includes("activo") || error?.message?.includes("active")) {
				errorMessage = "Este código QR no está activo";
			}

			Toast.show({
				type: "error",
				text1: "Error",
				text2: errorMessage,
				position: "top",
			});
			setOpinionModalVisible(false);
			setScanned(false);
			setScannedUID(null);
			setOpinion("");
		} finally {
			setRegistering(false);
		}
	};

	const handleCloseModal = () => {
		setOpinionModalVisible(false);
		setScanned(false);
		setScannedUID(null);
		setOpinion("");
	};

	if (!permission) {
		return (
			<>
				<Header
					title="Escáner QR"
					icon="qr-code-outline"
					isSecondIcon={true}
					icon2="chevron-back"
					onPress={() => navigation.goBack()}
				/>
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color="#FF6B00" />
					<Text style={styles.loadingText}>Solicitando permisos...</Text>
				</View>
			</>
		);
	}

	if (!permission.granted) {
		return (
			<>
				<Header
					title="Escáner QR"
					icon="qr-code-outline"
					isSecondIcon={true}
					icon2="chevron-back"
					onPress={() => navigation.goBack()}
				/>
				<View style={styles.centerContainer}>
					<Ionicons name="camera-outline" size={64} color="#999" />
					<Text style={styles.permissionText}>
						Se necesita permiso para acceder a la cámara
					</Text>
					<TouchableOpacity
						style={styles.permissionButton}
						onPress={() => {
							console.log("Botón de permisos presionado");
							requestPermission();
						}}
					>
						<Text style={styles.permissionButtonText}>Conceder permiso</Text>
					</TouchableOpacity>
				</View>
			</>
		);
	}

	return (
		<>
			<Header
				title="Escáner QR"
				icon="qr-code-outline"
				isSecondIcon={true}
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>

			<View style={styles.cameraContainer}>
				<CameraView
					style={styles.camera}
					facing="back"
					onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
					barcodeScannerSettings={{
						barcodeTypes: [
							"qr",
							"ean13",
							"ean8",
							"upc_a",
							"upc_e",
							"code39",
							"code93",
							"code128",
							"itf14",
							"aztec",
							"pdf417",
							"datamatrix",
						],
					}}
				/>
				<View style={styles.overlay} pointerEvents="none">
					<View style={styles.scanArea}>
						<View style={[styles.corner, styles.topLeft]} />
						<View style={[styles.corner, styles.topRight]} />
						<View style={[styles.corner, styles.bottomLeft]} />
						<View style={[styles.corner, styles.bottomRight]} />
					</View>
					<Text style={styles.instructionText}>
						Apunta la cámara al código QR
					</Text>
				</View>
			</View>

			{!scanned && (
				<TouchableOpacity
					style={styles.rescanButton}
					onPress={() => setScanned(false)}
				>
					<Ionicons name="refresh-outline" size={20} color="white" />
					<Text style={styles.rescanButtonText}>Reintentar</Text>
				</TouchableOpacity>
			)}

			<OpinionModal
				visible={opinionModalVisible}
				opinion={opinion}
				onOpinionChange={setOpinion}
				onRegister={handleRegister}
				onClose={handleCloseModal}
				registering={registering}
			/>
		</>
	);
};

interface OpinionModalProps {
	visible: boolean;
	opinion: string;
	onOpinionChange: (text: string) => void;
	onRegister: () => void;
	onClose: () => void;
	registering: boolean;
}

const OpinionModal = ({
	visible,
	opinion,
	onOpinionChange,
	onRegister,
	onClose,
	registering,
}: OpinionModalProps) => {
	const { scale, opacity } = useModalAnimation(visible);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const handleOverlayPress = () => {
		dismissKeyboard();
	};

	const handleContentPress = (e: any) => {
		e.stopPropagation();
	};

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent
			onRequestClose={() => {
				dismissKeyboard();
				onClose();
			}}
		>
			<TouchableWithoutFeedback onPress={handleOverlayPress}>
				<KeyboardAwareScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
					}}
					enableOnAndroid
					extraScrollHeight={60}
					keyboardShouldPersistTaps="handled"
					onScrollBeginDrag={dismissKeyboard}
				>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback onPress={handleContentPress}>
							<Animated.View
								style={[
									styles.modalContent,
									{
										transform: [{ scale }],
										opacity: opacity,
									},
								]}
							>
								<TouchableWithoutFeedback onPress={dismissKeyboard}>
									<View>
										<Text style={styles.modalTitle}>Registrar experiencia</Text>
										<Text style={styles.modalSubtitle}>
											Opcional: Comparte tu opinión sobre esta experiencia
										</Text>
									</View>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
									<TextInput
										style={styles.opinionInput}
										placeholder="Escribe tu opinión (máximo 1000 caracteres)"
										placeholderTextColor="#999"
										value={opinion}
										onChangeText={(text) => {
											if (text.length <= 1000) {
												onOpinionChange(text);
											}
										}}
										onBlur={dismissKeyboard}
										multiline
										numberOfLines={6}
										maxLength={1000}
										returnKeyType="done"
										blurOnSubmit={true}
									/>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback onPress={dismissKeyboard}>
									<View>
										<Text style={styles.charCount}>
											{opinion.length}/1000 caracteres
										</Text>
									</View>
								</TouchableWithoutFeedback>

								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={[styles.modalButton, styles.registerButton]}
										onPress={() => {
											dismissKeyboard();
											onRegister();
										}}
										disabled={registering}
										activeOpacity={0.8}
									>
										{registering ? (
											<ActivityIndicator color="white" />
										) : (
											<Text style={styles.modalButtonText}>Registrar</Text>
										)}
									</TouchableOpacity>

									<TouchableOpacity
										style={[styles.modalButton, styles.cancelButton]}
										onPress={() => {
											dismissKeyboard();
											onClose();
										}}
										disabled={registering}
										activeOpacity={0.8}
									>
										<Text style={styles.modalButtonText}>Cancelar</Text>
									</TouchableOpacity>
								</View>
							</Animated.View>
						</TouchableWithoutFeedback>
					</View>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	cameraContainer: {
		flex: 1,
		marginTop: 70,
		position: "relative",
	},
	camera: {
		flex: 1,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "none",
	},
	scanArea: {
		width: 250,
		height: 250,
		position: "relative",
	},
	corner: {
		position: "absolute",
		width: 30,
		height: 30,
		borderColor: "#FF6B00",
	},
	topLeft: {
		top: 0,
		left: 0,
		borderTopWidth: 4,
		borderLeftWidth: 4,
	},
	topRight: {
		top: 0,
		right: 0,
		borderTopWidth: 4,
		borderRightWidth: 4,
	},
	bottomLeft: {
		bottom: 0,
		left: 0,
		borderBottomWidth: 4,
		borderLeftWidth: 4,
	},
	bottomRight: {
		bottom: 0,
		right: 0,
		borderBottomWidth: 4,
		borderRightWidth: 4,
	},
	instructionText: {
		color: "white",
		fontSize: 16,
		marginTop: 30,
		textAlign: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
		padding: 12,
		borderRadius: 8,
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		marginTop: 70,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
	},
	permissionText: {
		marginTop: 16,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 24,
	},
	permissionButton: {
		backgroundColor: "#FF6B00",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 10,
	},
	permissionButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
	rescanButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FF6B00",
		padding: 16,
		margin: 16,
		borderRadius: 10,
		gap: 8,
	},
	rescanButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 24,
		width: "85%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 8,
		color: "#333",
	},
	modalSubtitle: {
		fontSize: 14,
		color: "#666",
		marginBottom: 16,
	},
	opinionInput: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
		textAlignVertical: "top",
		minHeight: 120,
		fontSize: 16,
	},
	charCount: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
		marginBottom: 16,
	},
	modalButtons: {
		flexDirection: "row",
		gap: 12,
	},
	modalButton: {
		flex: 1,
		padding: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	registerButton: {
		backgroundColor: "#FF6B00",
	},
	cancelButton: {
		backgroundColor: "#ccc",
	},
	modalButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
});

export default QrScannerScreen;

