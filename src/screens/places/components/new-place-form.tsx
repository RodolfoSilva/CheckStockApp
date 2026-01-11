import { useCreatePlace } from "@/api/places";
import Button from "@/components/button";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { z } from "zod";

const placeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  code: z.string().min(1, "Código é obrigatório"),
});

type Props = {
  onSuccess: () => void;
};

export default function NewPlaceForm(props: Props) {
  const { onSuccess } = props;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ name?: string; code?: string }>({});
  const { theme } = useUnistyles();

  const createPlaceMutation = useCreatePlace();

  const handleSubmit = async () => {
    setErrors({});

    const result = placeSchema.safeParse({ name, code });

    if (!result.success) {
      const fieldErrors: { name?: string; code?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "name") {
          fieldErrors.name = issue.message;
        } else if (issue.path[0] === "code") {
          fieldErrors.code = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createPlaceMutation.mutateAsync({ name, code });
      onSuccess();
    } catch (error) {
      console.error("Error creating place:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Novo Local</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Digite o nome do local"
            placeholderTextColor={theme.colors.textTertiary}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Código</Text>
          <TextInput
            style={[styles.input, errors.code && styles.inputError]}
            placeholder="Digite o código do local"
            placeholderTextColor={theme.colors.textTertiary}
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (errors.code) {
                setErrors((prev) => ({ ...prev, code: undefined }));
              }
            }}
          />
          {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
        </View>

        <Button
          title="Salvar"
          onPress={handleSubmit}
          disabled={createPlaceMutation.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  form: {
    gap: theme.spacing.lg,
  },
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.searchBackground,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
}));
