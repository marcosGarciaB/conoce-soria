import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useModalAnimation } from "../animations/modalAnimation";

interface ModalSuccessProps {
    title: string;
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const ModalSuccess = ({ title, message, isVisible, onClose }: ModalSuccessProps) => {
    const { scale, opacity } = useModalAnimation(isVisible);

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        transform: [{ scale }],
                        opacity: opacity,
                    },
                ]}
            >
                <View style={styles.card}>

                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={70} color="#4CAF50" />
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    card: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 28,
        paddingVertical: 30,
        paddingHorizontal: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 15,
    },
    iconContainer: {
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 25,
        lineHeight: 22,
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default ModalSuccess;
