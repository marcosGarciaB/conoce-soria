import { useModalAnimation } from "@/components/animations/modalAnimation";
import React from "react";
import { ActivityIndicator, Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QRModalProps {
	visible: boolean;
	qrCode: string | null;
	loading: boolean;
	onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ visible, qrCode, loading, onClose }) => {
	const { scale, opacity } = useModalAnimation(visible);

	return (
		<Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<Animated.View style={[styles.modalContent, { transform: [{ scale }], opacity }]}>
					<Text style={styles.modalTitle}>Código QR</Text>
					{loading ? (
						<ActivityIndicator size="large" color="#FF6B00" />
					) : qrCode ? (
						<Image source={{ uri: qrCode }} style={styles.qrImage} resizeMode="contain" />
					) : (
						<Text style={styles.errorText}>No se pudo cargar el QR</Text>
					)}
					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<Text style={styles.closeButtonText}>Cerrar</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: { 
		flex: 1, 
		backgroundColor: "rgba(0,0,0,0.7)", 
		justifyContent: "center", 
		alignItems: "center" 
	},
	modalContent: { 
		backgroundColor: "white", 
		borderRadius: 20, 
		padding: 24,
		width: "85%",
		alignItems: "center" 
	},
	modalTitle: { 
		fontSize: 20, 
		fontWeight: "700", 
		marginBottom: 20, 
		color: "#333" 
	},
	qrImage: { 
		width: 250, 
		height: 250, 
		marginBottom: 20
	},
	errorText: { 
		color: "#d9534f", 
		fontSize: 16, 
		marginBottom: 20 
	},
	closeButton: { 
		backgroundColor: "#FF6B00", 
		paddingHorizontal: 24, 
		paddingVertical: 12, 
		borderRadius: 10 
	},
	closeButtonText: { 
		color: "white", 
		fontWeight: "700", 
		fontSize: 16 
	},
});

export default QRModal;
