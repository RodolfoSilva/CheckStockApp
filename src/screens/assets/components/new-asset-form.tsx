import { useCreateAsset, useUpdateAsset } from "@/api/assets";
import Button from "@/components/button";
import Asset from "@/db/models/asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { z } from "zod";

const assetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  code: z.string().min(1, "Código é obrigatório"),
});

type AssetFormData = z.infer<typeof assetSchema>;

type Props = {
  asset?: Asset;
  onSuccess: () => void;
};

export default function NewAssetForm(props: Props) {
  const { asset, onSuccess } = props;
  const { theme } = useUnistyles();

  const createAssetMutation = useCreateAsset();
  const updateAssetMutation = useUpdateAsset();

  const isEditing = !!asset;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: asset?.name || "",
      code: asset?.code || "",
    },
  });

  const onSubmit = async (data: AssetFormData) => {
    try {
      if (isEditing) {
        await updateAssetMutation.mutateAsync({
          id: asset.id,
          ...data,
        });
      } else {
        await createAssetMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} asset:`,
        error
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? "Editar Item" : "Novo Item"}
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
                  placeholder="Digite o nome do item"
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
                  placeholder="Digite o código do item"
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
            createAssetMutation.isPending || updateAssetMutation.isPending
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

