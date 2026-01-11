import { database } from "@/db";
import Place from "@/db/models/place";
import { Q } from "@nozbe/watermelondb";
import { queryOptions } from "@tanstack/react-query";

export async function getPlaces() {
  const places = await database.get<Place>("places").query().fetch();
  return places;
}

export async function getPlace(id: string) {
  const place = await database
    .get<Place>("places")
    .query(Q.where("id", id))
    .fetch();
  return place;
}

export const placesQuery = queryOptions({
  queryKey: ["places"],
  queryFn: getPlaces,
});

export const placeQuery = (id: string) =>
  queryOptions({
    queryKey: ["place", id],
    queryFn: () => getPlace(id),
  });
