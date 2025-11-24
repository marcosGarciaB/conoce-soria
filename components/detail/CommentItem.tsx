import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Ionicons } from "@expo/vector-icons";
import { ComentariosResponse } from "../../services/commentService";
import ModalComment from "./ModalComment";

interface ComentarioItemProps {
	comentario: ComentariosResponse;
	onDelete?: (id: string) => void;
	onUpdate?: (id: string, newText: string) => void;
}

const MAX = 200;

const ComentarioItem: React.FC<ComentarioItemProps> = ({
	comentario,
	onDelete,
	onUpdate,
}) => {
	const { token } = useAuth();
	const translate = useSharedValue(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [actionType, setActionType] = useState<"delete" | "update" | null>(
		null
	);
	const isAdminUser = useAdmin(token);

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			translate.value = Math.max(-MAX, Math.min(e.translationX, MAX));
		})
		.onEnd(() => {
			if (translate.value == MAX && onUpdate) {
				setActionType("update");
				setModalVisible(true);
			} else if (translate.value == -MAX && onDelete) {
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
			["#ffdfdfff", "#fff", "#eef2ffff"]
		),
	}));

	const handleConfirm = (newText?: string) => {
		if (actionType === "delete" && onDelete) onDelete(comentario.id);
		if (actionType === "update" && onUpdate && newText) onUpdate(comentario.id, newText);
		setModalVisible(false);
		setActionType(null);
	};

	const handleCancel = () => {
		setModalVisible(false);
		setActionType(null);
	};

	return (
		<View>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[styles.commentItem, animatedStyle]}>
					<View>
						{isAdminUser && (
							<View style={styles.adminBadge}>
								<TouchableOpacity style={[styles.adminIcon, styles.editIcon]}>
									<Ionicons name="warning" size={20} color="white" />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.adminIcon, styles.deleteIcon]}>
									<Ionicons name="trash-bin-sharp" size={20} color="white" />
								</TouchableOpacity>
							</View>
						)}
					</View>
					<Text style={styles.commentUser}>
						{comentario.autorNombre}
					</Text>
					
					<Text style={styles.commentText}>{comentario.texto}</Text>
					<Text style={styles.commentDate}>
						{new Date(comentario.fecha).toLocaleString()}
					</Text>
				</Animated.View>
			</GestureDetector>

			<ModalComment
				title={
					actionType === "delete" ? "Eliminar comentario" : "Editar comentario"
				}
				isVisible={modalVisible}
				onSave={handleConfirm}
				onClose={handleCancel}
				initialText={comentario.texto}
			/>
		</View>
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
	// Admin
	adminBadge: {
		position: "absolute",
		right: 10,
		flexDirection: "row",
		borderRadius: 12,
		overflow: "hidden",
	},
	adminIcon: {
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 5,
		borderRadius: 8,
	},
	editIcon: {
		backgroundColor: "#fbff00ff", // azul
	},
	deleteIcon: {
		backgroundColor: "#ff4d4f", // rojo
	},
});

export default ComentarioItem;
