import { placesQuery } from "@/api/places";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import SearchBar from "@/components/search-bar";
import PlaceCard from "./components/place-card";

export default function PlacesScreen() {
  const { data: places, isLoading } = useQuery(placesQuery);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    if (!searchQuery.trim()) return places;

    const query = searchQuery.toLowerCase().trim();
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.code.toLowerCase().includes(query)
    );
  }, [places, searchQuery]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name, SKU, or barcode..."
      />

      {filteredPlaces.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? "No places found" : "No places available"}
          </Text>
        </View>
      ) : (
        <FlashList
          data={filteredPlaces}
          renderItem={({ item }) => <PlaceCard place={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
}));
