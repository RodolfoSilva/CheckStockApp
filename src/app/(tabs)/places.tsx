import { placesQuery } from "@/api/places";
import Place from "@/db/models/place";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.searchBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchIcon: {
    color: theme.colors.icon,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    padding: 0,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: theme.colors.card,
  },
  cardContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 24,
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  pill: {
    backgroundColor: theme.colors.tagBackground,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 12,
    color: theme.colors.tagText,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textTertiary,
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  barcodeLine: {
    width: 2,
    height: 12,
    backgroundColor: theme.colors.textTertiary,
    borderRadius: 1,
  },
  barcodeNumber: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginLeft: theme.spacing.xs,
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

interface PlaceCardProps {
  place: Place;
}

function PlaceCard({ place }: PlaceCardProps) {
  // Generate a simple barcode-like number from the place code or ID
  const barcodeNumber = useMemo(() => {
    // Use the code if available, otherwise generate from ID
    const code = place.code || place.id;
    // Convert to a 4-digit number-like string
    const hash = code
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return String(hash % 10000).padStart(4, "0");
  }, [place.code, place.id]);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Feather name="package" size={24} style={styles.icon} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{place.name}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{place.code}</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.barcodeContainer}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={styles.barcodeLine} />
            ))}
            <Text style={styles.barcodeNumber}>{barcodeNumber}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function PlacesScreen() {
  const { theme } = useUnistyles();
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
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Feather name="search" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search by name, SKU, or barcode..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

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
