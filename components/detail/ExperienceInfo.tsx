import { ExperienciaDetailResponse } from "@/services/experienceService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const url =
    "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

interface ExperienceCardProps {
    detail: ExperienciaDetailResponse;
}

const ExperienceDetail = ({ detail }: ExperienceCardProps) => {
    return (
        <View>
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
                <Text style={styles.aboutText}>{detail.descripcion}</Text>
            </View>

            <View style={styles.commentsTitleRow}>
                <Ionicons name="chatbox-outline" size={20} color="grey" />
                <Text style={styles.commentsTitle}>Comentarios</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default ExperienceDetail;