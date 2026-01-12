import Button from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function EmptyInProgressConferences() {
  const router = useRouter();

  const handleCreateConference = () => {
    router.push("/(tabs)/conferences");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="calendar" size={64} color="#9BA1A6" />
      </View>
      <ThemedText style={styles.title}>Nenhuma conferência em andamento</ThemedText>
      <ThemedText style={styles.subtitle}>
        Comece uma nova conferência para começar a trabalhar
      </ThemedText>
      <Button
        title="Nova Conferência"
        onPress={handleCreateConference}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
    lineHeight: 24,
  },
}));

