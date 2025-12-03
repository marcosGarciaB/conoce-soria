import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/common/HeaderItem";
import LoadingScreen from "@/components/common/Loading";
import TitleHeader from "@/components/common/TitleHeader";
import HeaderCard from "@/components/passport/HeaderCard";
import PassportFlatlist from "@/components/passport/PassportFlatlist";
import { useLoadPassport } from "@/hooks/useLoadPassport";


const PassportScreen = () => {
    const navigation = useNavigation<any>();
    const { loadingPassport } = useLoadPassport();

    if (loadingPassport) return <LoadingScreen />;

    return (
        <SafeAreaView style={styles.container}>
            <Header title={"Pasaporte Personal"} icon="card-outline" icon2="chevron-back-circle"
                onPress={() => navigation.goBack()} isSecondIcon={true} />

            <HeaderCard />
            <TitleHeader title="Historial de experiencias" />
            <PassportFlatlist />
        </SafeAreaView >
    );
};

export default PassportScreen;

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        backgroundColor: "#FAFAFA",
        padding: 5,
    },
});