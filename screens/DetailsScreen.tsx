import Header from "@/components/common/HeaderItem";
import AddComment from "@/components/detail/AddComment";
import ComentarioItem from "@/components/detail/CommentItem";
import ExperienceDetail from "@/components/detail/ExperienceInfo";
import { useAuth } from "@/contexts/AuthContext";
import { RootStackParamList } from "@/navigation/AppNavigator";
import {
	ComentariosResponse,
	comentariosService,
} from "@/services/commentService";
import {
	ExperienciaDetailResponse,
	experienciaService,
} from "@/services/experienceService";

import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	UIManager,
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type DetailsRoute = RouteProp<RootStackParamList, "Details">;

type FormData = {
    comentario: string;
};

const DetailsScreen = ({ navigation, route }: { navigation: any; route: DetailsRoute }) => {
    const { experiencia } = route.params;

    const [detalle, setDetalle] = useState<ExperienciaDetailResponse | null>(null);
    const [comentarios, setComentarios] = useState<ComentariosResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    const flatListRef = useRef<ScrollView>(null);

    // Cargar detalles
    useEffect(() => {
        const loadExperiencia = async () => {
            try {
                const data = await experienciaService.getExperiencia(experiencia.id);
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
            console.error("Error eliminando comentario:", error);
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
            console.error("Error actualizando comentario:", error);
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
                <ExperienceDetail detail={detalle} />

                <View>
                    {comentarios.map((comentario) => (
                        <ComentarioItem
                            key={comentario.id}
                            comentario={comentario}
                            onDelete={(id) => handleDelete(id)}
                            onUpdate={(id, newText) => handleUpdate(id, newText)}
                        />
                    ))}
                </View>
            </ScrollView>

            <AddComment
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
            />

            <TouchableOpacity
                style={styles.inputButton}
                onPress={() => navigation.navigate("QrScanner")}
            >
                <Ionicons
                    name="qr-code"
                    size={30}
                    color="white"
                    style={{ marginRight: 10 }}
                />
                <Text style={styles.buttonText}>Registrar experiencia</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        padding: 5,
    },
    inputButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "orange",
        height: 50,
        borderRadius: 30,
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 19,
        color: "white",
        fontWeight: "bold",
    },
});

export default DetailsScreen;
