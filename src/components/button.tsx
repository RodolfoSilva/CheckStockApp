import { Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button(props: Props) {
  const { onPress, title, disabled = false, variant = "primary" } = props;

  // Use TouchableOpacity instead of Pressable on Android to avoid double-tap issues
  // when used inside TrueSheet. TouchableOpacity has better touch event handling
  // in modal/sheet contexts on Android.
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primary: {
    backgroundColor: theme.colors.iconForeground,
  },
  secondary: {
    backgroundColor: theme.colors.searchBackground,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: theme.colors.text,
  },
}));
