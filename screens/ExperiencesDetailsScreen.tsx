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

	// Formulario de comentarios
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

	if (!detalle) return <Text>Cargando...</Text>;

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.headerPanel}>
				<Ionicons
					style={{ marginLeft: 15 }}
					name="chevron-back-circle"
					size={30}
					color="grey"
					onPress={() => navigation.goBack()}
				/>
				<Text style={styles.title}>{detalle.titulo}</Text>
				<Ionicons
					style={{ marginRight: 15 }}
					name="location"
					size={30}
					color="grey"
				/>
			</View>

			{/* Scroll principal */}
			<ScrollView ref={flatListRef} showsVerticalScrollIndicator={true}>
				{/* Imagen principal */}
				<Image source={{ uri: url }} style={styles.galleryImage} />

				{/* Galería */}
				<View style={styles.sectionTitleRow}>
					<Ionicons name="images" size={20} color="grey" />
					<Text style={styles.sectionTitle}>Galería</Text>
				</View>

				{/* Sobre la experiencia */}
				<View style={styles.aboutSection}>
					<View style={styles.aboutTitleRow}>
						<Ionicons name="book-outline" size={20} color="grey" />
						<Text style={styles.sectionTitle}>
							Sobre esta experiencia
						</Text>
					</View>
					<Text style={styles.aboutText}>{detalle.descripcion}</Text>
				</View>

				{/* Comentarios */}
				<View style={styles.commentsTitleRow}>
					<Ionicons name="chatbox-outline" size={20} color="grey" />
					<Text style={styles.commentsTitle}>Comentarios</Text>
				</View>

				{/* Lista de comentarios + formulario */}
				<View>
					{comentarios.map((comentario) => (
						<ComentarioItem
							key={comentario.id}
							comentario={comentario}
						/>
					))}

					<AddComment
						control={control}
						handleSubmit={handleSubmit}
						onSubmit={onSubmit}
						errors={errors}
					/>
				</View>

				{/* Botón final */}
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
	container: { flex: 1, backgroundColor: "#fff8f8ff", paddingHorizontal: 20 },
	headerPanel: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		elevation: 5,
		backgroundColor: "white",
		borderRadius: 30,
		height: 60,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		marginTop: 15,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FF6B00",
		marginLeft: 15,
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
	aboutTitleRow: { flexDirection: "row", alignItems: "center" },
	aboutText: { fontSize: 15, color: "#555", lineHeight: 22, marginTop: 5 },
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
});

export default DetailsScreen;
