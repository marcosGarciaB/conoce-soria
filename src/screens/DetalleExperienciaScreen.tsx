import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image,
    Dimensions, ScrollView, LayoutAnimation, Platform, UIManager, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";


const url = 'data:image/jpeg;base64,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';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}



const DetailsScreen = ({ navigation }: { navigation: any }) => {


    console.log("DESCRIPCION DE LA EXPERIENCIA", "experiencia.descripcion");


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.headerPanel}>
                <Text style={styles.title}>Detalles de la experiencia</Text>
                <Ionicons name={"map"} size={30} color={"orange"} />
            </View>

            <View style={styles.gallerySection}>
                <Ionicons name="images" size={20} color="grey" />
                <Text style={styles.sectionTitle}>Galería</Text>
                <Image source={{ uri: url }} style={styles.galleryImage} />
            </View>

            <View style={styles.aboutSection}>
                <Ionicons name="book-outline" size={20} color="grey" />
                <Text style={styles.sectionTitle}>Sobre esta experiencia</Text>
                <Text style={styles.aboutText}>{"experiencia.descripcion"}</Text>
            </View>

            <View style={styles.commentsSection}>
                <Ionicons name="chatbox-outline" size={20} color="grey" />
                <Text style={styles.commentsTitle}>Comentarios</Text>
            </View>

            <View style={styles.addComment}>
                <Ionicons name="pencil" size={20} color="grey" />
                <Text style={styles.addCommentText}>Añadir comentario</Text>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    // CONTENEDOR GENERAL
    container: {
        flex: 1,
        backgroundColor: "#F8F5F2",
        paddingHorizontal: 20,
        paddingTop: 15,
    },

    // --- HEADER (NO LO TOCO) ---

    headerPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        height: 60,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B00'
    },
    // TÍTULO DE SECCIÓN
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
        marginTop: 20,
    },

    // TEXTO GENERAL
    text: {
        fontSize: 16,
        color: "#555",
        lineHeight: 22,
        marginBottom: 6,
    },

    // SECCIÓN: DATOS PRINCIPALES
    mainInfoContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 15,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },

    mainTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1C1C1C",
        marginBottom: 5,
    },

    categoryBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#FFE4CC",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 5,
    },

    categoryText: {
        color: "#FF6B00",
        fontWeight: "600",
        fontSize: 13,
    },

    // GALERÍA
    gallerySection: {
        marginTop: 25,
    },

    galleryImage: {
        width: "100%",
        height: 240,
        borderRadius: 15,
        marginTop: 10,
    },

    // SOBRE LA EXPERIENCIA
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

    aboutText: {
        fontSize: 15,
        color: "#555",
        lineHeight: 22,
        marginTop: 5,
    },

    // COMENTARIOS
    commentsSection: {
        marginTop: 25,
    },

    commentsTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },

    // AÑADIR COMENTARIO
    addComment: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 15,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
    },

    addCommentText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#444",
        fontWeight: "500",
    },
});


export default DetailsScreen;
