import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from "@expo/vector-icons";

type FormData = {
    email: string;
    password: string;
}

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await login({ email: data.email, password: data.password });
            navigation.navigate("MainTabs");
        } catch (error) {
            console.error("Error en login:", error);
            Alert.alert("Error", "No se pudo iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Iniciar Sesión</Text>

                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i,
                                message: "Email no válido"
                            }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail" size={20} color="#ffbf8bff" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Email"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            </View>
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "La contraseña es obligatoria",
                            minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#ffbf8bff" style={{ marginRight: 8 }} />
                                
                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Contraseña"
                                    secureTextEntry={!showPass}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                
                                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                    <Ionicons
                                        name={showPass ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#ffbf8bff"
                                    />
                                </TouchableOpacity>                            
                            </View>
                        )}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? "Iniciando..." : "Iniciar Sesión"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                        <Text style={styles.link}>Volver al inicio</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d7d7d7 ',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    formContainer: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#f8f3f3ff',
        padding: 40,
        margin: 20,
        borderColor: '#7a7978ff',
        borderWidth: 1,
        borderRadius: 10
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#d35800ff',
        textAlign: 'center',
        marginBottom: 24,
    },
    // Inputs
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ffbf8bff',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    inputWithIcon: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333'
    },
    input: {
        height: 50,
        borderColor: '#ffbf8bff',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#d35800ff',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#C1440E',
        textAlign: 'center',
        marginVertical: 4,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});


export default LoginScreen;
