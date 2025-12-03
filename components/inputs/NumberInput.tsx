import useShakeAnimation from "@/components/animations/shakeAnimation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
    Animated,
    StyleSheet,
    TextInput,
    View
} from "react-native";
import showErrorToast from "../utils/showErrorToast";

interface FormData {
    puntosOtorgados: string;
}

interface NumberInputProps {
    control: Control<any>;
    errors: FieldErrors<FormData>;
}

const NumberInput: React.FC<NumberInputProps> = ({
    control,
    errors,
}) => {
    const { shakeAnim, shake } = useShakeAnimation();
    const [inputValue, setInputValue] = useState("");

    return (
        <View style={styles.formContainer}>
            <Controller
                control={control}
                name="puntosOtorgados"
                rules={{
                    required: "Debes poner una puntuación",
                    pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números"
                    }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Animated.View
                        style={[
                            styles.inputWrapper,
                            { transform: [{ translateX: shakeAnim }] },
                            errors.puntosOtorgados && styles.inputError
                        ]}
                    >
                        <Ionicons
                            name="analytics-outline"
                            size={22}
                            color="#ffbf8bff"
                            style={{ marginRight: 10 }}
                        />

                        <TextInput
                            style={[styles.inputWithIcon, { height: 80 }]}
                            placeholder="Puntuación"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={value?.toString() ?? ""}
                            onChangeText={(text) => {
                                const parsed = parseInt(text, 10);
                                onChange(isNaN(parsed) ? "" : parsed);
                            }}
                            onBlur={() => {
                                onBlur();

                                if (errors.puntosOtorgados) {
                                    shake();
                                    showErrorToast(
                                        "Error en la puntuación",
                                        errors.puntosOtorgados.message!
                                    );
                                }
                            }}
                        />
                    </Animated.View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    // General
    formContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 1
    },
    // Input
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        fontSize: 16,
        backgroundColor: "white",
        borderColor: "#ffbf8bff",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    inputWithIcon: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        height: 80,
    },
    iconLeft: {
        marginRight: 8,
    },
    // Error
    inputError: {
        borderColor: "red",
        backgroundColor: "#ffe6e6",
    },
});

export default NumberInput;
