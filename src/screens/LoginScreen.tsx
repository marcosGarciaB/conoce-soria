/**
 * Pantalla de Inicio de Sesión.
 */

import React, { use, useState } from "react"; // Es un HOOK (función interna de React), guarda el estado de un componente.
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";

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
        } catch (error) {
            console.error("Error en login:", error);
            Alert.alert("Error", "No se pudo iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
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
            <Button 
                title={isLoading ? 'Iniciando...' : 'Iniciar Sesión'} 
                onPress={handleLogin}  
                disabled={isLoading} 
            />

            <Button
                title="¿No tienes cuenta? Regístrate"
                onPress={() => navigation.navigate('Register')}
                color="gray"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default LoginScreen;
