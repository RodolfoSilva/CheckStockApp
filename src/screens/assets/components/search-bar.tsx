import Feather from "@expo/vector-icons/Feather";
import { TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
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
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
}));

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInput}>
        <Feather name="search" size={20} color={theme.colors.icon} />
        <TextInput
          style={styles.searchText}
          placeholder="Search by name, SKU, or barcode..."
          placeholderTextColor={theme.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
