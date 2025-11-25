import { NewUser, UserCredentials } from "@/services/adminService";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ModalSuccess from "../common/ModalSucces";

import EmailInput from "../common/EmailInput";
import NameInput from "../common/NameInput";
import PasswordInput from "../common/PasswordInput";
import RoleInput from "../common/RoleInput";

interface UserFormProps {
    initialData?: UserCredentials;
    onSubmit: (data: NewUser | UserCredentials) => void;
    navigation: any;
}

const UserForm = ({ initialData, onSubmit, navigation }: UserFormProps) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombre: "",
            email: "",
            password: "",
            role: "USER",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                nombre: initialData.nombre,
                email: initialData.email,
                password: initialData.password,
                role: initialData.role,
            });
        }
    }, [initialData]);

    const submitHandler = (data: any) => {
        if (initialData) {
            // Editar
            const updatedData: UserCredentials = {
                nombre: data.nombre,
                email: data.email,
                password: data.password || initialData.password,
                role: data.role,
                puntos: initialData.puntos,
                fechaCreacion: initialData.fechaCreacion,
            };
            onSubmit(updatedData);
        } else {
            // Crear
            const newData: NewUser = {
                nombre: data.nombre,
                email: data.email,
                password: data.password,
                role: data.role,
            };
            onSubmit(newData);
        }
        setShowSuccess(true);
    };

    return (
        <View style={styles.formContainer}>
            <NameInput control={control} errors={errors} />
            <EmailInput control={control} errors={errors} />
            <PasswordInput control={control} errors={errors} initialData={!!initialData} />
            <RoleInput control={control} errors={errors} />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(submitHandler)}>
                <Text style={styles.submitText}>Guardar</Text>
            </TouchableOpacity>

            <ModalSuccess
                title={initialData ? "¡Usuario actualizado!" : "¡Usuario creado!"}
                message={initialData 
                    ? "El usuario se ha actualizado correctamente." 
                    : "El usuario se ha creado correctamente."}
                isVisible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        margin: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    submitButton: {
        backgroundColor: "#ffbf8b",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
});

export default UserForm;
