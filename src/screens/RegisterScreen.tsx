import React, { useState } from "react";
import { View, TextInput,TouchableOpacity, Button, Alert, StyleSheet, Text } from "react-native";
import { authService } from "../services/authService";
import Toolbar from "../components/common/Toolbar";

const RegisterScreen = ({ navigation }: { navigation: any }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Por favor, completa todos los campos para registrarte.");
            return;
        }

        setIsLoading(true);

        try {
            await authService.register({ name, email, password });

            Alert.alert(
                '¡Registro Exitoso!',
                'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
                [
                    { text: 'Ir al inicio', onPress: () => navigation.navigate('Inicio') }
                ]
            );
        } catch (error) {
            console.error("Error en registro:", error);
            Alert.alert("Error", "No se pudo registrar la cuenta. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
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

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Registrando...' : 'Registrarse'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>¿Ya tienes cuenta? Inicia Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                <Text style={styles.link}>Volver al inicio</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF4E6',
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

export default RegisterScreen;
