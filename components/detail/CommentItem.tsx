import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { ComentariosResponse } from "../../services/commentService";

interface ComentarioItemProps {
	comentario: ComentariosResponse;
	onDelete?: (id: string) => void;
	onUpdate?: (id: string) => void;
}

const MAX = 30;

// ME FALTA PONER PARA QUE SE CAMBIE DE VERDAD

const ComentarioItem: React.FC<ComentarioItemProps> = ({
	comentario,
	onDelete,
	onUpdate,
}) => {
	const translate = useSharedValue(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [actionType, setActionType] = useState<"delete" | "update" | null>(
		null
	);

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			translate.value = Math.max(-MAX, Math.min(e.translationX, MAX));
		})
		.onEnd(() => {
			if (translate.value >= MAX / 2 && onUpdate) {
				setActionType("update");
				setModalVisible(true);
			} else if (translate.value <= -MAX / 2 && onDelete) {
				setActionType("delete");
				setModalVisible(true);
			}
			translate.value = withSpring(0);
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translate.value }],
		backgroundColor: interpolateColor(
			translate.value,
			[-MAX, 0, MAX],
			["#ffd3d3ff", "#fff", "#dfe7ffff"]
		),
	}));

	const handleConfirm = () => {
		if (actionType === "delete" && onDelete) onDelete(comentario.id);
		if (actionType === "update" && onUpdate) onUpdate(comentario.id);
		setModalVisible(false);
		setActionType(null);
	};

	const handleCancel = () => {
		setModalVisible(false);
		setActionType(null);
	};

	return (
		<>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[styles.commentItem, animatedStyle]}>
					<Text style={styles.commentUser}>
						{comentario.autorNombre}
					</Text>
					<Text style={styles.commentText}>{comentario.texto}</Text>
					<Text style={styles.commentDate}>
						{new Date(comentario.fecha).toLocaleString()}
					</Text>
				</Animated.View>
			</GestureDetector>

			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={handleCancel}
			>
				<View style={styles.modalBackground}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>
							{actionType === "delete"
								? "¿Borrar comentario?"
								: "¿Actualizar comentario?"}
						</Text>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[
									styles.modalButton,
									{ backgroundColor: "#FF4D4D" },
								]}
								onPress={handleConfirm}
							>
								<Text style={styles.modalButtonText}>Sí</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalButton,
									{ backgroundColor: "#ccc" },
								]}
								onPress={handleCancel}
							>
								<Text style={styles.modalButtonText}>
									Cancelar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	commentItem: {
		padding: 15,
		marginVertical: 6,
		margin: 2,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	commentUser: {
		fontWeight: "600",
		color: "#333",
	},
	commentText: {
		color: "#555",
		marginTop: 2,
	},
	commentDate: {
		color: "#999",
		fontSize: 12,
		marginTop: 2,
		alignSelf: "flex-end",
	},
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		width: "70%",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 20,
		textAlign: "center",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalButton: {
		flex: 1,
		marginHorizontal: 5,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: "center",
	},
	modalButtonText: {
		color: "#fff",
		fontWeight: "600",
	},
});

export default ComentarioItem;
