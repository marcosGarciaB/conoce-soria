import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
    Animated,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

interface FormData {
    coord: string;
}

interface CoordsInputProps {
    control: Control<any>;
    errors: FieldErrors<FormData>;
    isLat?: boolean;
}

const CoordsInput: React.FC<CoordsInputProps> = ({ control, errors, isLat }) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (errors.coord) {
            Vibration.vibrate(500);

            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: 5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: -5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: -5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            let text1 = isLat ? "Error en la latitud" : "Error en la longitud";

            Toast.show({
                type: "error",
                position: "top",
                text1,
                text2: errors.coord.message,
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 60,
            });
        }
    }, [errors.coord]);

    return (
        <View style={styles.formContainer}>
            <Controller
                control={control}
                name={isLat ? "ubicacionLat" : "ubicacionLng"}
                rules={{
                    required: isLat ? "Debes poner una latitud" : "Debes poner una longitud"
                }
                }
                render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                        <TouchableOpacity
                            onPress={() => setOpen(!open)}
                            activeOpacity={0.8}
                        >
                            <Animated.View
                                style={[
                                    styles.inputWrapper,
                                    { transform: [{ translateX: shakeAnim }] },
                                    errors.coord && styles.inputError,
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
                                    placeholder={isLat ? "Latitud" : "Longitud"}
                                    placeholderTextColor="#999"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />

                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    // General
    formContainer: {
        flex: 1,
        width: "95%",
        marginBottom: 20,
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


export default CoordsInput;
