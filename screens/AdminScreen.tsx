import CategoryItem from '@/components/admin/CategoryItem';
import UserItem from '@/components/admin/UserItem';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, UserCredentials } from '@/services/adminService';
import { ExperienciaDetailResponse, experienciaService } from '@/services/experienceService';

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const AdminScreen = ({ navigation }: { navigation: any }) => {
    const [showExperiencias, setShowExperiencias] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [experiencias, setExperiencias] = useState<ExperienciaDetailResponse[]>([]);
    const [users, setUsers] = useState<UserCredentials[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        const loadExperiencias = async () => {
            try {
                const resumen = await experienciaService.getExperiencias();
                const detalles = await Promise.all(
                    resumen.map((exp) => experienciaService.getExperiencia(exp.id))
                );

                setExperiencias(detalles);
            } catch (error) {
                console.error("Error cargando las experiencias:", error);
            }
        };

        const loadUsers = async () => {
            if (!token) return;
            try {
                const allUsers = await adminService.getAllUsers(token);
                setUsers(allUsers);
            } catch (error) {
                console.error("Error cargando los usuarios:", error);
            }
        };

        loadUsers();
        loadExperiencias();
    }, []);

    const handleToggleExperiencias = () => {
        setShowExperiencias(!showExperiencias);
    };

    const handleToggleUsers = () => {
        setShowUsers(!showUsers);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPanel}>
                <Text style={styles.title}>Experiencias Soria</Text>

                <TouchableOpacity style={styles.smallButton}>
                    <Ionicons
                        name={"accessibility-outline"}
                        size={30}
                        color={"grey"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.adminCard}>
                <Text style={styles.adminTitle}>Panel de Administración</Text>

                <TouchableOpacity style={styles.optionButton} onPress={handleToggleUsers}>
                    <Ionicons name="people-outline" size={20} color="#333" />
                    <Text style={styles.optionText}>Gestionar usuarios</Text>
                    <Ionicons
                        name={showUsers ? "chevron-down-outline" : "chevron-forward-outline"}
                        size={20}
                        color="#999"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleToggleExperiencias}>
                    <Ionicons name="briefcase-outline" size={20} color="#333" />
                    <Text style={styles.optionText}>Gestionar experiencias</Text>
                    <Ionicons
                        name={showExperiencias ? "chevron-down-outline" : "chevron-forward-outline"}
                        size={20}
                        color="#999"
                    />
                </TouchableOpacity>
            </View>

            {showExperiencias && (
                <CategoryItem experiencias={experiencias} />
            )}

            {showUsers && (
                <UserItem
                    users={users}
                    token={token!}
                    onDelete={async (email) => {
                        try {
                            await adminService.deleteUser(email, token!);
                            setUsers(prev => prev.filter(u => u.email !== email));
                        } catch (error) {
                            console.error("Error eliminando usuario", error);
                        }
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    // Cabecera
    headerPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        height: 60,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FF6B00",
        marginLeft: 20,
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
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
    adminCard: {
        marginTop: 40,
        backgroundColor: "white",
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderColor: "#ffc8a0ff",
        borderWidth: 2
    },
    adminTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        alignSelf: "center",
        letterSpacing: 0.5,
    },
    optionButton: {
        backgroundColor: "#F7F7F7",
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E6E6E6",
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
        fontWeight: "500",
    },
});

export default AdminScreen;
