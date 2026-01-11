import { placesQuery } from "@/api/places";
import PressButton from "@/components/press-button";
import SearchBar from "@/components/search-bar";
import Place from "@/db/models/place";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import NewPlaceForm from "./components/new-place-form";
import PlaceCard from "./components/place-card";

export default function PlacesScreen() {
  const { data: places = [], isLoading } = useQuery(placesQuery);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPlace, setEditingPlace] = useState<Place | undefined>(
    undefined
  );

  const query = searchQuery.toLowerCase().trim();
  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(query) ||
      place.code.toLowerCase().includes(query)
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressButton
              style={styles.actionButton}
              onPress={async () => {
                setEditingPlace(undefined);
                await TrueSheet.present("new-place-sheet");
              }}
            >
              <Text style={styles.actionText}>Novo</Text>
            </PressButton>
          ),
        }}
      />

      <TrueSheet name="new-place-sheet" detents={["auto"]} dismissible>
        <NewPlaceForm
          place={editingPlace}
          onSuccess={async () => {
            setEditingPlace(undefined);
            await TrueSheet.dismiss("new-place-sheet");
          }}
        />
      </TrueSheet>

      <View style={styles.container}>
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
            style={styles.list}
            data={filteredPlaces}
            renderItem={({ item }) => (
              <PlaceCard
                place={item}
                onPress={async () => {
                  setEditingPlace(item);
                  await TrueSheet.present("new-place-sheet");
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  actionText: {
    fontSize: 16,
    color: theme.colors.iconForeground,
    fontWeight: "600",
  },
}));
