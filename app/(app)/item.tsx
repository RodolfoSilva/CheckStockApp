import { FlatList, Text, View } from "react-native";

import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import { useAudioPlayer } from "expo-audio";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

const audioSource = require("../../assets/beep.mp3");

export default function ItemScreen() {
  const { location } = useLocalSearchParams();
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const player = useAudioPlayer(audioSource);
  const [codes, setCodes] = useState<string[]>([]);
  const cleanLastCode = useRef<number | undefined>(undefined);
  const lastCode = useRef<string | undefined>(undefined);

  const codeScanner = useCodeScanner({
    codeTypes: ["code-128", "upc-a", "ean-13", "qr"],
    onCodeScanned: (codes) => {
      const value = codes[0].value;
      if (lastCode.current === value) return;
      lastCode.current = value;
      if (cleanLastCode.current) clearTimeout(cleanLastCode.current);
      cleanLastCode.current = setTimeout(() => {
        lastCode.current = undefined;
      }, 3_000);
      player.seekTo(0);
      player.play();

      setCodes((prev) =>
        [...codes.map((code) => code.value ?? ""), ...prev]
          .filter(Boolean)
          .filter((code, index, self) => self.indexOf(code) === index)
      );

      codes.forEach(async (code) => {
        try {
          const response = await fetch(
            "https://n8n.apps.infleet.com.br/webhook/0e288f35-e10a-4730-8c31-2a4ee33165ad",
            {
              method: "POST",
              body: JSON.stringify({
                location: location,
                code: codes[0].value,
              }),
            }
          );
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      });
    },
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
      <FlatList
        style={{ flex: 1 }}
        data={codes}
        renderItem={({ item }) => <Text>ITEM: {item}</Text>}
      />
    </SafeAreaView>
  );
}
