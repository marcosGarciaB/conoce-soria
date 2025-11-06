import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { authService } from "../services/authService";

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
                    { text: 'Ir a Login', onPress: () => navigation.navigate('LoginScreen') }
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
            <Button
                title={isLoading ? 'Registrando...' : 'Registrarse'}
                onPress={handleRegister}
                disabled={isLoading}
            />
            <Button
                title="¿Ya tienes cuenta? Inicia Sesión"
                onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
