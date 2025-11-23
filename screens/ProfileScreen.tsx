import React, { useEffect, useState } from 'react';
import { StyleSheet} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { authService, UserCredentials } from "../services/authService";

import { SafeAreaView } from 'react-native-safe-area-context';
import Logged from '../components/profile/Logged';
import UnLogged from '../components/profile/UnLogged';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
    const { token, logout } = useAuth();
    const [user, setUser] = useState<UserCredentials>();

    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;

            try {
                const data = await authService.getUserData(token);
                setUser(data);
            } catch (error) {
                console.error('Error cargando el usuario:', error);
            }
        }
        loadUser();
    }, [token]);

    if (!user) return <UnLogged navigation={navigation}/>;

    return (
    <SafeAreaView style={styles.container}>
        { token && user ? (
            <Logged token={token} user={user} onPress={logout}/>
        ) : (
            <UnLogged navigation={navigation}/>
        )}
    </SafeAreaView>
);

};

const styles = StyleSheet.create({
    // Contenedores generales
    container: {
        flex: 1,
        backgroundColor: '#fff8f8ff',
    },
});

export default ProfileScreen;
