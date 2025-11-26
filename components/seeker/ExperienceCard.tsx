import { ExperienciasResponse } from "@/services/experienceService";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const url =
    "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

interface ExperienceCardProps {
    experiencia: ExperienciasResponse;
    onPress: (experiencia: ExperienciasResponse) => void;
}

const ExperienceCard = ({ experiencia, onPress }: ExperienceCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => onPress(experiencia)}
        >
            <Image source={{ uri: url }} style={styles.image} />
            <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                    {experiencia.categoria
                        .replace("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
            </View>
            <Text style={styles.cardTitle}>{experiencia.titulo}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 10,
        borderRadius: 15,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
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
});

export default ExperienceCard;
