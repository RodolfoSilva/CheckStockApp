import { placesQuery } from "@/api/places";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

export default function HomeScreen() {
  const { data: places } = useQuery(placesQuery);

  if (!places) return <ThemedText>Loading...</ThemedText>;
  if (places.length === 0) return <ThemedText>No places found</ThemedText>;

  return (
    <FlashList
      data={places}
      renderItem={({ item }) => <ThemedText>{item.name}</ThemedText>}
    />
  );
}
