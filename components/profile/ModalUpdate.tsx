import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Control, FieldErrors } from 'react-hook-form';
import EmailInput from '../inputs/EmailInput';
import NameInput from '../inputs/NameInput';
import PasswordInput from '../inputs/PasswordInput';

interface ModalUpdateProps {
    title: string;
    isVisible: boolean;
    onSave: () => void;
    onClose: () => void;
    control: Control<any>;
    errors: FieldErrors<FormData>
}

const ModalUpdate = ({ title, isVisible, onSave, onClose, control, errors }: ModalUpdateProps) => {

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{title}</Text>

                        {title === 'Actualizar Nombre' && (
                            <NameInput control={control} errors={errors} />
                        )}

                        {title === 'Actualizar Email' && (
                            <EmailInput control={control} errors={errors} />
                        )}

                        {title === 'Actualizar Contraseña' && (
                            <PasswordInput control={control} errors={errors} />
                        )}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={onSave}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#FF6B00',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ccc'
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
});

export default ModalUpdate;