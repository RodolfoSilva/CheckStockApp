import { Text, View } from "react-native";

import { NoCameraDeviceError } from "@/components/no-camera-device";
import { PermissionsPage } from "@/components/permissions-page";
import { useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

const audioSource = require("../../assets/beep.mp3");

export default function LocationScreen() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();
  const router = useRouter();
  const location = useRef<string | undefined>(undefined);
  const player = useAudioPlayer(audioSource);

  const codeScanner = useCodeScanner({
    codeTypes: ["code-128", "itf", "qr"],
    onCodeScanned: (codes) => {
      const value = codes[0].value;
      if (location.current === value) return;
      player.seekTo(0);
      player.play();
      location.current = value;
      router.replace(`/(app)/item?location=${value}`);
    },
  });

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <Text>Hello</Text>
      </View>

      <Camera
        style={{ flex: 1 }}
        device={device}
        codeScanner={codeScanner}
        isActive={true}
      />
    </SafeAreaView>
  );
}
