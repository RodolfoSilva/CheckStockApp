import { conferencesQuery } from "@/api/conferences";
import { ConferenceCard } from "@/components/conference-card";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function ConferencesScreen() {
  const { data: conferences, isLoading } = useQuery(conferencesQuery);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </View>
    );
  }

  if (!conferences || conferences.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText>No conferences found</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        style={styles.list}
        data={conferences}
        renderItem={({ item }) => <ConferenceCard conference={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    flex: 1,
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
