import { conferencesQuery } from "@/api/conferences";
import { ConferenceCard } from "@/components/conference-card";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import EmptyInProgressConferences from "@/components/dashboard/empty-in-progress-conferences";
import { ThemedText } from "@/components/themed-text";
import Conference from "@/db/models/conference";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

type ConferenceStatus = "not_started" | "in_progress" | "completed";

// Helper to determine status from conference data
// Reused from conference-card.tsx
function getStatus(conference: Conference): ConferenceStatus {
  const now = new Date();
  const createdAt = conference.createdAt;
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCreation < 1) return "not_started";
  if (daysSinceCreation < 3) return "in_progress";
  return "completed";
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: conferences = [], isLoading } = useQuery(conferencesQuery);

  // Filter only in-progress conferences
  const inProgressConferences = conferences.filter(
    (conf) => getStatus(conf) === "in_progress"
  );

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlashList
        data={inProgressConferences}
        renderItem={({ item }) => (
          <ConferenceCard
            conference={item}
            onPress={() => router.push(`/(app)/conferences/${item.id}/picking`)}
          />
        )}
        ListHeaderComponent={<DashboardHeader />}
        ListEmptyComponent={<EmptyInProgressConferences />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
