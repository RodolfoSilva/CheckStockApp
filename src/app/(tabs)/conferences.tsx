import { conferencesQuery } from "@/api/conferences";
import { ConferenceCard } from "@/components/conference-card";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function ConferencesScreen() {
  const { data: conferences, isLoading } = useQuery(conferencesQuery);

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!conferences || conferences.length === 0) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText>No conferences found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlashList
        data={conferences}
        renderItem={({ item }) => <ConferenceCard conference={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}
