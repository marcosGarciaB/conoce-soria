import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';

import Header from '@/components/common/HeaderItem';
import { useLoadUser } from '@/hooks/useLoadUser';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logged from '../components/profile/Logged';
import UnLogged from '../components/profile/UnLogged';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
    const { token, logout } = useAuth();
    const { user } = useLoadUser();

    const isLogged = !!token && !!user;

    return (
        <SafeAreaView style={styles.container}>
            <Header 
                title="Mi Cuenta" 
                icon="person"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {isLogged ? (
                    <Logged token={token} user={user} onPress={logout} />
                ) : (
                    <UnLogged navigation={navigation} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ProfileScreen;