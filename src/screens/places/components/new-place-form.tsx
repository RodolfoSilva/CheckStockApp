import { useCreatePlace, useUpdatePlace } from "@/api/places";
import Button from "@/components/button";
import Place from "@/db/models/place";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { z } from "zod";

const placeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  code: z.string().min(1, "Código é obrigatório"),
});

type PlaceFormData = z.infer<typeof placeSchema>;

type Props = {
  place?: Place;
  onSuccess: () => void;
};

export default function NewPlaceForm(props: Props) {
  const { place, onSuccess } = props;
  const { theme } = useUnistyles();

  const createPlaceMutation = useCreatePlace();
  const updatePlaceMutation = useUpdatePlace();

  const isEditing = !!place;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: place?.name || "",
      code: place?.code || "",
    },
  });

  const onSubmit = async (data: PlaceFormData) => {
    try {
      if (isEditing) {
        await updatePlaceMutation.mutateAsync({
          id: place.id,
          ...data,
        });
      } else {
        await createPlaceMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} place:`,
        error
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? "Editar Local" : "Novo Local"}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Digite o nome do local"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Código</Text>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.code && styles.inputError]}
                  placeholder="Digite o código do local"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.code && (
                  <Text style={styles.errorText}>{errors.code.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <Button
          title="Salvar"
          onPress={handleSubmit(onSubmit)}
          disabled={
            createPlaceMutation.isPending || updatePlaceMutation.isPending
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  form: {
    gap: theme.spacing.md,
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
