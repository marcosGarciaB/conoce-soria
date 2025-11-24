import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	LayoutAnimation,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAdmin } from "@/hooks/useAdmin";
import Filters from "../components/seeker/FilterDropdown";
import { useAuth } from "../contexts/AuthContext";
import {
	experienciaService,
	ExperienciasResponse,
} from "../services/experienceService";

const { width } = Dimensions.get("window");
const categories = ["RESTAURANTE", "MUSEO", "AIRE_LIBRE", "MONUMENTO"];

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SearchScreen = ({ navigation }: { navigation: any }) => {
	const { status, token } = useAuth();
	const isLogged = status === "authenticated";
	const isAdminUser = useAdmin(token);
	
	// Resto
	const url ="https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";
	const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>(
		[]
	);
	const [searchText, setSearchText] = useState("");
	const [selectedCat, setSelectedCat] = useState<string | null>(null);
	const [all, setAll] = useState<ExperienciasResponse[]>([]);

	useEffect(() => {
		const loadExperiencias = async () => {
			try {
				const data = await experienciaService.getExperiencias();
				setExperiencias(data);
				setAll(data);
			} catch (error) {
				console.error("Error cargando experiencias:", error);
			}
		};
		loadExperiencias();

	}, []);

	const handlePressExperiencia = (experiencia: ExperienciasResponse) => {
		if (isLogged) {
			navigation.navigate("Details", { experiencia });
		} else {
			navigation.navigate("Login");
		}
	};

	// FiLtrar
	const buttonFilter = (categoria: string) => {
		const newSelected = selectedCat === categoria ? null : categoria;
		setSelectedCat(newSelected);

		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		const filtered = all.filter((exp) => {
			const matchCat = newSelected
				? exp.categoria.toUpperCase() === newSelected.toUpperCase()
				: true;
			const matchText = exp.titulo
				.toLowerCase()
				.includes(searchText.toLowerCase());
			return matchCat && matchText;
		});
		setExperiencias(filtered);
	};

	const wordsFilter = (texto: string) => {
		setSearchText(texto);

		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		const filter = all.filter((exp) => {
			const matchCat = selectedCat
				? exp.categoria.toUpperCase() === selectedCat.toUpperCase()
				: true;
			return (
				matchCat &&
				exp.titulo.toLowerCase().includes(texto.toLowerCase())
			);
		});
		setExperiencias(filter);
	};

	// Cargar fotos
	const renderItem = ({ item }: { item: ExperienciasResponse }) => (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.card}
			onPress={() => handlePressExperiencia(item)}
		>
			<Image source={{ uri: url }} style={styles.image} />
			<View style={styles.categoryBadge}>
				<Text style={styles.categoryText}>
					{item.categoria
						.replace("_", " ")
						.toLowerCase()
						.replace(/\b\w/g, (l) => l.toUpperCase())}
				</Text>
			</View>
			{isAdminUser && (
				<View style={styles.adminBadge}>
					<TouchableOpacity style={[styles.adminIcon, styles.editIcon]}>
						<Ionicons name="pencil-sharp" size={20} color="white" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.adminIcon, styles.deleteIcon]}>
						<Ionicons name="trash-bin-sharp" size={20} color="white" />
					</TouchableOpacity>
				</View>
			)}
			<Text style={styles.cardTitle}>{item.titulo}</Text>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headerPanel}>
				<Text style={styles.title}>Explorar</Text>
				<Ionicons
					style={{ marginRight: 15 }}
					name={"search-sharp"}
					size={30}
					color={"orange"}
				/>
			</View>

			<FlatList
				data={experiencias}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				numColumns={width > 600 ? 2 : 1}
				columnWrapperStyle={
					width > 600
						? { justifyContent: "space-between" }
						: undefined
				}
				contentContainerStyle={{ paddingBottom: 40 }}
				ListHeaderComponent={
					<Filters
						searchText={searchText}
						setSearchText={setSearchText}
						selectedCat={selectedCat}
						setSelectedCat={setSelectedCat}
						categories={categories}
						onFilterByText={wordsFilter}
						onFilterByCategory={buttonFilter}
					/>
				}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	// Generales
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 10,
		paddingBottom: "30%",
	},
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
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#FF6B00",
		marginLeft: 20,
	},
	// Card
	card: {
		flex: 1,
		margin: 10,
		borderRadius: 15,
		overflow: "hidden",
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 5,
		elevation: 4,
	},
	image: {
		width: "100%",
		height: 180,
		resizeMode: "cover",
	},
	categoryBadge: {
		position: "absolute",
		top: 10,
		left: 10,
		backgroundColor: "white",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
	},
	categoryText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 12,
	},
	cardTitle: {
		padding: 10,
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
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
		backgroundColor: "#007bff", // azul
	},
	deleteIcon: {
		backgroundColor: "#ff4d4f", // rojo
	},
});

export default SearchScreen;
