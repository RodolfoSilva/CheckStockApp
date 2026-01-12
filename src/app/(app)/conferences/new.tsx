import { useCreateConference } from "@/api/conferences";
import { placesQuery } from "@/api/places";
import Button from "@/components/button";
import Place from "@/db/models/place";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { z } from "zod";

const conferenceSchema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  place_id: z.string().min(1, "Local é obrigatório"),
});

type ConferenceFormData = z.infer<typeof conferenceSchema>;

export default function NewConferenceScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { data: places = [], isLoading: isLoadingPlaces } =
    useQuery(placesQuery);
  const createConferenceMutation = useCreateConference();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showPlacePicker, setShowPlacePicker] = useState(false);

  // Debug: log places to verify they're being loaded
  console.log("Places loaded:", places.length, places);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ConferenceFormData>({
    resolver: zodResolver(conferenceSchema),
    defaultValues: {
      name: "",
      place_id: "",
    },
  });

  const placeId = watch("place_id");

  const onSubmit = async (data: ConferenceFormData) => {
    try {
      const conference = await createConferenceMutation.mutateAsync({
        name: data.name,
        place_id: data.place_id,
      });
      router.replace(`/(app)/conferences/${conference.id}/picking`);
    } catch (error) {
      console.error("Error creating conference:", error);
    }
  };

  const selectedPlaceData = places.find((p) => p.id === placeId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Título da Conferência</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Digite o título da conferência"
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
          <Text style={styles.label}>Local</Text>
          <View style={styles.pickerWrapper}>
            <Controller
              control={control}
              name="place_id"
              render={({ field: { onChange } }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.pickerInput,
                      errors.place_id && styles.inputError,
                    ]}
                    onPress={() => setShowPlacePicker(!showPlacePicker)}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        !selectedPlaceData && styles.pickerPlaceholder,
                      ]}
                    >
                      {selectedPlaceData
                        ? selectedPlaceData.name
                        : "Selecione um local"}
                    </Text>
                    <Text style={styles.pickerArrow}>▼</Text>
                  </TouchableOpacity>
                  {showPlacePicker && (
                    <View style={styles.pickerListContainer}>
                      {isLoadingPlaces ? (
                        <View style={styles.pickerItem}>
                          <Text style={styles.pickerItemText}>
                            Carregando...
                          </Text>
                        </View>
                      ) : places.length === 0 ? (
                        <View style={styles.pickerItem}>
                          <Text style={styles.pickerItemText}>
                            Nenhum local disponível
                          </Text>
                        </View>
                      ) : (
                        <FlashList
                          data={places}
                          renderItem={({ item: place }) => (
                            <TouchableOpacity
                              style={styles.pickerItem}
                              onPress={() => {
                                onChange(place.id);
                                setSelectedPlace(place);
                                setShowPlacePicker(false);
                              }}
                            >
                              <Text style={styles.pickerItemText}>
                                {place.name}
                              </Text>
                              {place.id === placeId && (
                                <Text style={styles.pickerItemCheck}>✓</Text>
                              )}
                            </TouchableOpacity>
                          )}
                          keyExtractor={(place) => place.id}
                          estimatedItemSize={50}
                          nestedScrollEnabled
                        />
                      )}
                    </View>
                  )}
                  {errors.place_id && (
                    <Text style={styles.errorText}>
                      {errors.place_id.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>
        </View>

        <Button
          title="Criar Conferência"
          onPress={handleSubmit(onSubmit)}
          disabled={createConferenceMutation.isPending}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  form: {
    gap: theme.spacing.md,
  },
  field: {
    gap: theme.spacing.sm,
  },
  pickerWrapper: {
    position: "relative",
    zIndex: 1,
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
  pickerInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  pickerPlaceholder: {
    color: theme.colors.textTertiary,
  },
  pickerArrow: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  pickerListContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.xs,
    maxHeight: 300,
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    minHeight: 50,
  },
  pickerItemText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  pickerItemCheck: {
    fontSize: 16,
    color: theme.colors.iconForeground,
    fontWeight: "bold",
  },
}));
