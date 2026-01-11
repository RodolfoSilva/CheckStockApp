import { assetsQuery } from "@/api/assets";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

export default function AssetsScreen() {
  const { data: assets } = useQuery(assetsQuery);

  if (!assets) return <ThemedText>Loading...</ThemedText>;
  if (assets.length === 0) return <ThemedText>No assets found</ThemedText>;

  return (
    <FlashList
      data={assets}
      renderItem={({ item }) => <ThemedText>{item.name}</ThemedText>}
    />
  );
}
