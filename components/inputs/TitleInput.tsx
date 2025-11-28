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
    title: string;
}

interface TitleInputProps {
    control: Control<any>;
    errors: FieldErrors<FormData>;
}

const TitleInput: React.FC<TitleInputProps> = ({ control, errors }) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState(50);

    useEffect(() => {
        if (errors.title) {
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

            Toast.show({
                type: "error",
                position: "top",
                text1: "Error en el título",
                text2: errors.title.message,
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 60,
            });
        }
    }, [errors.title]);

    return (
        <View style={styles.formContainer}>
            <Controller
                control={control}
                name="titulo"
                rules={{
                    required: "Debes poner un titulo",
                }}
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
                                    errors.title && styles.inputError,
                                ]}
                            >
                                <Ionicons
                                    name="book-outline"
                                    size={22}
                                    color="#ffbf8bff"
                                    style={{ marginRight: 10 }}
                                />

                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Título"
                                    placeholderTextColor="#999"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    multiline={true}
                                    onContentSizeChange={(e) =>
                                        setHeight(e.nativeEvent.contentSize.height)
                                    }
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
		marginBottom: 20,
	},
	// Input
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		height: 70,
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
		height: 70,
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


export default TitleInput;
