import { useAuth } from "@/contexts/AuthContext";
import { passportService } from "@/services/passportService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QrScannerScreen = () => {
  const { token } = useAuth();
  const navigation = useNavigation<any>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    // data = contenido del QR (por ejemplo: "EXP:123" o un token)
    try {
      if (!token) throw new Error("Token no disponible");

      // Ejemplo: llamamos al servicio para registrar la experiencia
      // Ajusta el método y parámetros según tu passportService
      await passportService.registerFromQr(token, data);

      Alert.alert("Registrado", "Experiencia registrada correctamente.", [
        { text: "Ok", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      console.error("Error registrando desde QR:", err);
      Alert.alert("Error", err?.message ?? "No se ha podido registrar.");
      setScanned(false); // permitir reintento
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No se ha concedido acceso a la cámara.</Text>
        <TouchableOpacity onPress={() => BarCodeScanner.requestPermissionsAsync()}>
          <Text style={{ color: "#FF6B00", marginTop: 12 }}>Pedir permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Escanear QR</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scanMarker} />
      </View>

      <View style={styles.footer}>
        <Text style={{ color: "#555" }}>
          Apunta la cámara al código QR para registrar la experiencia.
        </Text>
        {scanned && (
          <TouchableOpacity style={styles.retryBtn} onPress={() => setScanned(false)}>
            <Text style={{ color: "white" }}>Volver a intentar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default QrScannerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    height: 66,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#FF6B00" },
  scannerContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  scanMarker: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  retryBtn: {
    marginTop: 12,
    backgroundColor: "#FF6B00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
