import React from 'react';
import { StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';

import { useLoadUser } from '@/hooks/useLoadUser';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logged from '../components/profile/Logged';
import UnLogged from '../components/profile/UnLogged';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
    const { token, logout } = useAuth();
    const { user } = useLoadUser();

    if (!user) return <UnLogged navigation={navigation} />;

    return (
        <SafeAreaView style={styles.container}>
            {token && user ? (
                <Logged token={token} user={user} onPress={logout} />
            ) : (
                <UnLogged navigation={navigation} />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
});

export default ProfileScreen;