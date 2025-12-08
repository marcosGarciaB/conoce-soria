import HeaderGeneral from "@/components/common/HeaderItem";
import OpinionModal from "@/components/modals/ModalOpinion";
import { OverlayQR } from "@/components/qr/OverlayQR";
import PermissionDenied from "@/components/qr/PermissionDenied";
import PermissionRequest from "@/components/qr/PermissionRequest";
import { useQrScanner } from "@/hooks/useQRScanner";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QrScannerScreen = ({ navigation, route }: any) => {
	const { experienciaId } = route.params;
	const {
		permission,
		requestPermission,
		scanned,
		setScanned,
		opinionModalVisible,
		opinion,
		setOpinion,
		registering,
		handleBarCodeScanned,
		handleRegister,
		handleCloseModal,
	} = useQrScanner(experienciaId, navigation);

	if (!permission) {
		return <PermissionRequest navigation={navigation} />;
	}

	if (!permission.granted) {
		return (
			<PermissionDenied
				navigation={navigation}
				onRequestPermission={requestPermission}
			/>
		);
	}

	return (
		<>
			<HeaderGeneral
				title="Escáner QR"
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>
			<View style={styles.cameraContainer}>
				<CameraView
					style={styles.camera}
					facing="back"
					onBarcodeScanned={
						scanned ? undefined : handleBarCodeScanned
					}
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
			</View>

			<OverlayQR />

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

const styles = StyleSheet.create({
	cameraContainer: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	rescanButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FF6B00",
		padding: 16,
		margin: 16,
		borderRadius: 30,
		gap: 8,
	},
	rescanButtonText: {
		color: "white",
		fontWeight: "700",
		fontSize: 16,
	},
});

export default QrScannerScreen;
