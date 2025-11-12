import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ToolbarProps = {
    title: string;
    onBack?: () => void;
};

const Toolbar = ({ title, onBack }: ToolbarProps) => {
    return (
        <View style={styles.container}>
            {onBack && (
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.back}>◀</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: '#FF6B00',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        elevation: 3, // sombra
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    back: {
        color: 'white',
        fontSize: 24,
    },
});

export default Toolbar;
