import React from "react";
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useModalAnimation } from "../animations/modalAnimation";

interface InfoModalProps {
    visible: boolean;
    title: string;
    content: { title: string; description: string[] }[];
    onClose: () => void;
}

const InfoModal = ({ visible, title, content, onClose }: InfoModalProps) => {
    const { scale, opacity } = useModalAnimation(visible);

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalBackground}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale }],
                            opacity: opacity,
                        },
                    ]}
                >
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {content.map((section, i) => (
                            <View key={i} style={styles.section}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                {section.description.map((line, idx) => (
                                    <Text key={idx} style={styles.sectionText}>
                                        • {line}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 28,
        paddingVertical: 30,
        paddingHorizontal: 25,
        maxHeight: "85%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 15,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 25,
        color: "#1C1C1C",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "700",
        marginBottom: 10,
        color: "#4B7BE5",
    },
    sectionText: {
        fontSize: 16,
        color: "#444",
        lineHeight: 26,
        marginBottom: 6,
    },
    closeButton: {
        marginTop: 25,
        backgroundColor: "#4B7BE5",
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#4B7BE5",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    closeButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 17,
        letterSpacing: 0.3,
    },

});

export default InfoModal;
