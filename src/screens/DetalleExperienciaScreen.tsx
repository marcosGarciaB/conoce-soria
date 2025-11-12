import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useExperiencias } from '../contexts/ExperienciaContext';

export const ExperienciaScreen = () => {
    const { experiencias, loadExperiencias } = useExperiencias();

    useEffect(() => {
        loadExperiencias();
    }, []);

    return (
        <View>
            <FlatList
                data={experiencias}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.titulo}</Text>
                        <Text>{item.descripcion}</Text>
                    </View>
                )}
            />
        </View>
    );
};
