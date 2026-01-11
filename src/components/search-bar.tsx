import Feather from "@expo/vector-icons/Feather";
import { TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar(props: Props) {
  const { value, onChangeText, placeholder = "Search..." } = props;
  const { theme } = useUnistyles();

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInput}>
        <Feather name="search" size={20} color={theme.colors.icon} />
        <TextInput
          style={styles.searchText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

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
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    padding: 0,
  },
}));

