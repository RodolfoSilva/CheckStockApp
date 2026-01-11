import { conferencesQuery } from "@/api/conferences";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

export default function ConferencesScreen() {
  const { data: conferences } = useQuery(conferencesQuery);

  if (!conferences) return <ThemedText>Loading...</ThemedText>;
  if (conferences.length === 0)
    return <ThemedText>No conferences found</ThemedText>;

  return (
    <FlashList
      data={conferences}
      renderItem={({ item }) => <ThemedText>{item.name}</ThemedText>}
    />
  );
}
