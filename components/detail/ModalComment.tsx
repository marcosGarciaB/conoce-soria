import React, { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useModalAnimation } from '../animations/modalAnimation';

interface ModalUpdateProps {
    title: string;
    isVisible: boolean;
    onSave: (texto?: string) => void;
    onClose: () => void;
    initialText?: string;
}

const ModalComment = ({ title, isVisible, onClose, onSave, initialText = '' }: ModalUpdateProps) => {
    const [text, setText] = useState(initialText);
    const { scale, opacity } = useModalAnimation(isVisible);

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.modalOverlay,
                    {
                        transform: [{ scale }],
                        opacity: opacity,
                    },
                ]}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    {title !== "Eliminar comentario" && (
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            multiline
                        />
                    )}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => title === "Eliminar comentario" ? onSave() : onSave(text)}
                        >
                            <Text style={styles.modalButtonText}>
                                {title === "Eliminar comentario" ? "Eliminar" : "Actualizar"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 10,
        textAlignVertical: 'top',
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
        marginTop: 5
    },
    cancelButton: {
        backgroundColor: '#ccc'
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
});

export default ModalComment;
