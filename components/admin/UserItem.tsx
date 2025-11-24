import { UserCredentials } from '@/services/adminService';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get("window");

interface UserItemProps {
    users: UserCredentials[];
    onDelete: (email: string) => void;
    token: string;
}

const UserItem = ({ users, onDelete, token }: UserItemProps) => {
    const url = "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

    const renderItem = ({ item }: { item: UserCredentials }) => {
        return (
            <View style={styles.userCard}>
                <View style={styles.userRow}>
                    <Image
                        source={{ uri: url }}
                        style={styles.userImage}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.nombre}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <Text style={styles.userRole}>Rol: {item.role}</Text>
                        <Text style={styles.userPoints}>Puntos: {item.puntos}</Text>
                    </View>
                </View>

                <View style={styles.userActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => console.log("Editar usuario", item.email)}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDelete(item.email)}
                    >
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.email}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                numColumns={width > 600 ? 2 : 1}
                columnWrapperStyle={
                    width > 600
                        ? { justifyContent: "space-between" }
                        : undefined
                }
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    userCard: {
        backgroundColor: "#F7F7F7",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E6E6E6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600"
    },
    userEmail: {
        fontSize: 14,
        color: "#555"
    },
    userRole: {
        fontSize: 14,
        color: "#333",
        marginTop: 4
    },
    userPoints: {
        fontSize: 14,
        color: "#333",
        marginTop: 2
    },
    userActions: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "center",
    },
    editButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: "#F44336",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
    },
});

export default UserItem;
