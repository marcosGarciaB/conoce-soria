
import React from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import ProfileAvatar from "./ProfilePhoto";

interface UserChipsProps {
    nombre: string;
    email: string;
    puntos: string;
    fotoPerfil: string;
    userRank?: number | null;
    editPhoto?: boolean;
}

const UserChips = ({ nombre, email, puntos, fotoPerfil, userRank, editPhoto }: UserChipsProps) => {

    return (
        <View style={styles.currentUserCard}>
            <ProfileAvatar foto={fotoPerfil} size={100}/>

            <Text style={styles.profileName}>{nombre}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <Text style={styles.chip}>Puntos: {puntos} </Text>
            {userRank && userRank <= 10 && (
                <View style={styles.userRankBadge}>
                    <Text style={styles.userRankText}>#{userRank}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    // Perfil
    profileName: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#333",
        marginTop: 5,
    },
    profileEmail: {
        fontSize: 16,
        color: "grey",
        marginBottom: 10,
    },
    chip: {
        backgroundColor: "#ffe6d5",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        color: "#FF6B00",
        fontWeight: "bold",
    },
    currentUserCard: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "25%",
        minHeight: 210,
        backgroundColor: "#fff",
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        position: "relative",
    },
    userRankBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#ffd9beff",
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    userRankText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 60,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    profileImage: {
        width: "100%",
        height: "100%",
    },
});

export default UserChips;
