import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = ({ navigation }: { navigation: any }) => {
    
    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>
                            PANTALLA DE BÚSQUEDA
                        </Text>
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
    
    export default SearchScreen;
    