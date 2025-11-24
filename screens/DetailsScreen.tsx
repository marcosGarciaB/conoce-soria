import Header from "@/components/common/HeaderItem";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddComment from "../components/detail/AddComment";
import ComentarioItem from "../components/detail/CommentItem";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
	ComentariosResponse,
	comentariosService,
} from "../services/commentService";
import {
	ExperienciaDetailResponse,
	experienciaService,
} from "../services/experienceService";

const url =
	"https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type DetailsRoute = RouteProp<RootStackParamList, "Details">;

type FormData = {
	comentario: string;
};

const DetailsScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: DetailsRoute;
}) => {
	const { experiencia } = route.params;
	const [detalle, setDetalle] = useState<ExperienciaDetailResponse | null>(
		null
	);
	const [comentarios, setComentarios] = useState<ComentariosResponse[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { token } = useAuth();

	const flatListRef = useRef<ScrollView>(null);

	// Cargar detalles y comentarios
	useEffect(() => {
		const loadExperiencia = async () => {
			try {
				const data = await experienciaService.getExperiencia(
					experiencia.id
				);
				setDetalle(data);
			} catch (error) {
				console.error("Error cargando experiencia:", error);
			}
		};

		const loadComentarios = async () => {
			try {
				const data = await comentariosService.getComentarios(
					experiencia.id.toString()
				);
				setComentarios(data);
			} catch (error) {
				console.error("Error cargando comentarios:", error);
			}
		};

		loadExperiencia();
		loadComentarios();
	}, [experiencia.id]);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		if (!token) return console.error("Token no disponible");

		setIsLoading(true);
		try {
			await comentariosService.setComentario(
				experiencia.id.toString(),
				{ texto: data.comentario },
				token
			);

			const updatedComentarios = await comentariosService.getComentarios(
				experiencia.id.toString()
			);
			setComentarios(updatedComentarios);
			reset({ comentario: "" });
			flatListRef.current?.scrollToEnd({ animated: true });
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (comentarioId: string) => {
		if (!token) return console.error("Token no disponible");
		setIsLoading(true);

		try {
			await comentariosService.deleteComentario(
				experiencia.id.toString(),
				comentarioId,
				token
			);
			const updated = await comentariosService.getComentarios(
				experiencia.id.toString()
			);
			setComentarios(updated);
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdate = async (comentarioId: string, newText: string) => {
		if (!token) return console.error("Token no disponible");
		setIsLoading(true);

		try {
			await comentariosService.updateComentario(
				experiencia.id.toString(),
				comentarioId,
				{ texto: newText },
				token
			);
			const updated = await comentariosService.getComentarios(
				experiencia.id.toString()
			);

			setComentarios(updated);
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!detalle) return <Text>Cargando...</Text>;

	return (
		<SafeAreaView style={styles.container}>
			<Header
				title={detalle.titulo}
				icon="search-sharp"
				isSecondIcon={true}
				icon2="chevron-back-circle"
				onPress={() => navigation.goBack()}
			/>

			<ScrollView ref={flatListRef} showsVerticalScrollIndicator={true}>
				<Image source={{ uri: url }} style={styles.galleryImage} />

				<View style={styles.sectionTitleRow}>
					<Ionicons name="images" size={20} color="grey" />
					<Text style={styles.sectionTitle}>Galería</Text>
				</View>

				<View style={styles.aboutSection}>
					<View style={styles.aboutTitleRow}>
						<Ionicons name="book-outline" size={20} color="grey" />
						<Text style={styles.sectionTitle}>
							Sobre esta experiencia
						</Text>
					</View>
					<Text style={styles.aboutText}>{detalle.descripcion}</Text>
				</View>

				<View style={styles.commentsTitleRow}>
					<Ionicons name="chatbox-outline" size={20} color="grey" />
					<Text style={styles.commentsTitle}>Comentarios</Text>
				</View>

				<View>
					{comentarios.map((comentario) => (
						<ComentarioItem
							key={comentario.id}
							comentario={comentario}
							onDelete={(id) => handleDelete(id)}
							onUpdate={(id, newText) =>
								handleUpdate(id, newText)
							}
						/>
					))}

					<AddComment
						control={control}
						handleSubmit={handleSubmit}
						onSubmit={onSubmit}
						errors={errors}
					/>
				</View>

				<TouchableOpacity
					style={styles.inputButton}
					onPress={() => console.log("Registrar experiencia")}
				>
					<Ionicons
						name="qr-code"
						size={30}
						color="white"
						style={{ marginRight: 10 }}
					/>
					<Text style={styles.buttonText}>Registrar experiencia</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
	},
	sectionTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#333",
		marginLeft: 15,
	},
	galleryImage: {
		width: "100%",
		height: 200,
		borderRadius: 15,
		marginTop: 10,
	},
	aboutSection: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 15,
		marginTop: 20,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 6,
		elevation: 2,
	},
	aboutTitleRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	aboutText: {
		fontSize: 15,
		color: "#555",
		lineHeight: 22,
		marginTop: 5,
	},
	commentsTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 5,
	},
	commentsTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginLeft: 10,
	},
	inputButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "orange",
		height: 50,
		borderRadius: 30,
	},
	buttonText: {
		fontSize: 19,
		color: "white",
		fontWeight: "bold",
	},
	// Admin
	adminBadge: {
		position: "absolute",
		top: 10,
		right: 10,
		flexDirection: "row",
		borderRadius: 12,
		overflow: "hidden",
	},
	adminIcon: {
		width: 35,
		height: 35,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 5,
		borderRadius: 8,
	},
	editIcon: {
		backgroundColor: "#007bff",
	},
	deleteIcon: {
		backgroundColor: "#ff4d4f",
	},
});

export default DetailsScreen;
