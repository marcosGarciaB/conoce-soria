import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa email y contraseña para poder iniciar sesión.");
            return;
        }

        setIsLoading(true);

        try {
            await login({ email, password });
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

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
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
        backgroundColor: '#FFEDD5',
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
        maxWidth: 400,          
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF6B00',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 50,
        borderColor: '#FFA45C',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#FF6B00',
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
});


export default LoginScreen;
