// ButtonInformation.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonInformationProps {
    title: string;
    onPress?: () => void;
}

const ButtonInformation = ({ title, onPress }: ButtonInformationProps) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: "40%",
        backgroundColor: "#4B7BE5",
        padding: 15,
        borderRadius: 30,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
    },
});

export default ButtonInformation;
