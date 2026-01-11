import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import useBeep from "@/hooks/use-beep";
import { throttleCodeScanner } from "@/utils/throttle-code-scanner";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

const itemScanner = throttleCodeScanner(3, 3000);

export default function ItemScreen() {
  const { location } = useLocalSearchParams();
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const [codes, setCodes] = useState<string[]>([]);

  const beep = useBeep();
  useEffect(() => {
    return itemScanner.addListener(async (code) => {
      const codeValue = code.value;
      if (!codeValue) return;
      beep();
      console.log("Reading", code.type, code.value);

      setCodes((prev) =>
        [codeValue, ...prev]
          .filter(Boolean)
          .filter((code, index, self) => self.indexOf(code) === index)
      );

      try {
        const response = await fetch(
          "https://n8n.apps.infleet.com.br/webhook/0e288f35-e10a-4730-8c31-2a4ee33165ad",
          {
            method: "POST",
            body: JSON.stringify({
              location: location,
              code: codeValue,
            }),
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });
  }, [location, beep]);

  const codeScanner = useCodeScanner({
    codeTypes: ["code-128", "upc-a", "ean-13", "qr"],
    onCodeScanned: (codes) => codes.forEach(itemScanner.process),
  });

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <Text>LOCAL: {location}</Text>
      </View>
      <Camera
        style={{ flex: 1 }}
        device={device}
        codeScanner={codeScanner}
        isActive={true}
      />
      <FlashList
        style={styles.list}
        data={codes}
        renderItem={({ item }) => <Text>ITEM: {item}</Text>}
        keyExtractor={(item, index) => `${item}-${index}`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
  },
}));
