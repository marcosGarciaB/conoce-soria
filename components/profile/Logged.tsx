import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAdmin } from "@/hooks/useAdmin";
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';

import Toast from 'react-native-toast-message';
import { UserCredentials, authService } from "../../services/authService";
import ModalUpdate from './ModalUpdate';
import PrivacyModal from './PrivacyModal';

interface UserLogguedProps {
    user: UserCredentials;
    token: string;
    onPress: () => void;
}

const Logged = ({ token, user, onPress }: UserLogguedProps) => {
    const [currentUser, setCurrentUser] = useState<UserCredentials>(user);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalField, setModalField] = useState<'nombre' | 'email' | 'password' | null>(null);
    const [privacyVisible, setPrivacyVisible] = useState(false);
    const isAdminUser = useAdmin(token);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            nombre: currentUser.nombre,
            email: currentUser.email,
            password: '',
        }
    });

    const openModal = (field: 'nombre' | 'email' | 'password') => {
        setModalField(field);
        setModalVisible(true);

        if (field === 'nombre') setValue('nombre', currentUser.nombre);
        if (field === 'email') setValue('email', currentUser.email);
        if (field === 'password') setValue('password', '');
    };

    const saveModal = handleSubmit(async (data) => {
        if (!modalField) return;

        try {
            const updated = await authService.updateUserData(token, { [modalField]: data[modalField] });
            setCurrentUser({ ...currentUser, [modalField]: updated[modalField] });
            setModalVisible(false);
            setModalField(null);

            let campo = capitalizeFirstLetter(`${modalField}`.toString());

            if (campo === 'Password') campo = 'Contraseña';

            Toast.show({
                type: 'success',
                text1: 'Actualización exitosa',
                text2: `${campo} actualizado correctamente`,
                position: 'bottom',
                bottomOffset: 100,
                visibilityTime: 3000,
                autoHide: true,
            });
        } catch (error) {
            console.error(error);
        }
    });

    function capitalizeFirstLetter(str: string): string {
        if (!str) {
            return "";
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerPanel}>
                    <Text style={styles.title}>Mi Perfil</Text>
                    <View style={[styles.smallButton]}>
                        <Ionicons name={"information-circle-outline"} size={30} color={"grey"} />
                    </View>
                </View>

                <View style={styles.profileContainer}>
                    <Ionicons name="person-circle" size={120} color="#FF6B00" />
                    <Text style={styles.profileName}>{currentUser.nombre}</Text>
                    <Text style={styles.profileEmail}>{currentUser.email}</Text>

                    <View style={styles.infoChips}>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Puntos: {currentUser.puntos}</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        
                        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('nombre')}>
                            <Text style={styles.actionText}>Cambiar nombre</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('email')}>
                            <Text style={styles.actionText}>Cambiar correo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('password')}>
                            <Text style={styles.actionText}>Cambiar contraseña</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={() => setPrivacyVisible(true)}>
                            <Text style={styles.actionText}>Política de privacidad</Text>
                        </TouchableOpacity>

                        <PrivacyModal
                            isVisible={privacyVisible}
                            onClose={() => setPrivacyVisible(false)}
                        />

                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Cambiar tema</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF6B00' }]} onPress={onPress}>
                            <Text style={[styles.actionText, { color: 'white' }]}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <ModalUpdate
                title={
                    modalField === 'nombre' ? 'Actualizar Nombre' :
                        modalField === 'email' ? 'Actualizar Email' :
                            'Actualizar Contraseña'
                }
                isVisible={modalVisible}
                onSave={saveModal}
                onClose={() => setModalVisible(false)}
                control={control}
                errors={errors}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    // Contenedores generales
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20
    },
    scrollContent: {
        paddingHorizontal: 20,
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
        fontWeight: 'bold',
        color: '#FF6B00',
        marginLeft: 20,
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    // Botones
    actionButtons: {
        width: '100%',
        gap: 10,
    },
    actionButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Perfil
    profileContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    profileName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    profileEmail: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 20,
    },
    // Chips
    infoChips: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 30,
    },
    chip: {
        backgroundColor: '#ffe6d5',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chipText: {
        color: '#FF6B00',
        fontWeight: 'bold',
    },
    actionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    adminContainer: {
        width: '100%',
        marginBottom: 25,
        padding: 10,
        backgroundColor: '#fff4e6',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FF6B00',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },

    adminBadge: {
        alignSelf: 'center',
        backgroundColor: '#FF6B00',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: 'bold',
        marginBottom: 12,
        fontSize: 12,
        letterSpacing: 1,
    },

    adminButton: {
        backgroundColor: '#FF6B00',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
        elevation: 3,
    },

    adminButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },


});

export default Logged;