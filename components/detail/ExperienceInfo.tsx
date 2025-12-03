import { ExperienciaDetailResponse } from "@/services/experienceService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import GalleryFaltist from "./GalleryFlatlist";

interface ExperienceCardProps {
    detail: ExperienciaDetailResponse;
}

const ExperienceDetail = ({ detail }: ExperienceCardProps) => {

    return (
        <View>
            <Image source={{ uri: detail.imagenPortadaUrl }} style={styles.galleryImage} />

            <View style={styles.sectionTitleRow}>
                <Ionicons name="images" size={20} color="grey" />
                <Text style={styles.sectionTitle}>Galería</Text>
            </View>

            <GalleryFaltist galeriaImagenes={detail.galeriaImagenes} />

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
    container: {
        padding: 20,
        backgroundColor: "#F9F9F9",
    },
    galleryImage: {
        width: "100%",
        height: 320,
        borderRadius: 20,
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222",
        marginLeft: 12,
        letterSpacing: 0.3,
    },
    aboutSection: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 20,
        marginTop: 25,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
    },
    aboutTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    aboutText: {
        fontSize: 16,
        color: "#555555",
        lineHeight: 24,
        marginTop: 10,
        letterSpacing: 0.2,
    },
    commentsTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 10,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginLeft: 10,
        letterSpacing: 0.3,
    },
    separator: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 20,
        borderRadius: 1,
    },
});

export default ExperienceDetail;