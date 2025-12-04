import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/common/HeaderItem";
import LoadingScreen from "@/components/common/Loading";

import PassportFlatlist from "@/components/passport/PassportFlatlist";
import { useLoadPassport } from "@/hooks/useLoadPassport";


const PassportScreen = () => {
    const navigation = useNavigation<any>();
    const { loadingPassport } = useLoadPassport();

    if (loadingPassport) return <LoadingScreen />;

    return (
        <SafeAreaView style={styles.container}>
            <Header title={"Pasaporte Personal"} icon="card-outline" icon2="chevron-back"
                onPress={() => navigation.goBack()} isSecondIcon={true} />
                
            <PassportFlatlist />
        </SafeAreaView >
    );
};

export default PassportScreen;

const styles = StyleSheet.create({
    container: {    
        flex: 1,
    },
});
