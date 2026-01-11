import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button(props: Props) {
  const { onPress, title, disabled = false, variant = "primary" } = props;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </Pressable>
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
  pressed: {
    opacity: 0.8,
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
