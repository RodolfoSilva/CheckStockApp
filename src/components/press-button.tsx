import { Pressable, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
};

export default function PressButton(props: Props) {
  const { onPress, children, style } = props;

  return (
    <Pressable
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      onPress={onPress}
    >
      {typeof children === "string" ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    color: theme.colors.iconForeground,
    fontWeight: "600",
  },
}));
