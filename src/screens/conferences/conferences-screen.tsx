import { conferencesQuery } from "@/api/conferences";
import { ConferenceCard } from "@/components/conference-card";
import PressButton from "@/components/press-button";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function ConferencesScreen() {
  const router = useRouter();
  const { data: conferences, isLoading } = useQuery(conferencesQuery);

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: () => (
              <PressButton
                style={styles.actionButton}
                onPress={() => router.push("/(app)/conferences/new")}
              >
                <Text style={styles.actionText}>Novo</Text>
              </PressButton>
            ),
          }}
        />
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ThemedText>Loading...</ThemedText>
          </View>
        </View>
      </>
    );
  }

  if (!conferences || conferences.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: () => (
              <PressButton
                style={styles.actionButton}
                onPress={() => router.push("/(app)/conferences/new")}
              >
                <Text style={styles.actionText}>Novo</Text>
              </PressButton>
            ),
          }}
        />
        <View style={styles.container}>
          <View style={styles.emptyContainer}>
            <ThemedText>No conferences found</ThemedText>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressButton
              style={styles.actionButton}
              onPress={() => router.push("/conferences/new")}
            >
              <Text style={styles.actionText}>Novo</Text>
            </PressButton>
          ),
        }}
      />
      <View style={styles.container}>
        <FlashList
          style={styles.list}
          data={conferences}
          renderItem={({ item }) => (
            <ConferenceCard
              conference={item}
              onPress={() =>
                router.push(`/(app)/conferences/${item.id}/picking`)
              }
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </>
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
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  actionText: {
    fontSize: 16,
    color: theme.colors.iconForeground,
    fontWeight: "600",
  },
}));
