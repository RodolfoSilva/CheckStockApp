import { database } from "@/db";
import Conference from "@/db/models/conference";
import { Q } from "@nozbe/watermelondb";
import { queryOptions } from "@tanstack/react-query";

export async function getConferences() {
  const conferences = await database
    .get<Conference>("conferences")
    .query()
    .fetch();
  return conferences;
}

export async function getConference(id: string) {
  const conference = await database
    .get<Conference>("conferences")
    .query(Q.where("id", id))
    .fetch();
  return conference;
}

export const conferencesQuery = queryOptions({
  queryKey: ["conferences"],
  queryFn: getConferences,
});

export const conferenceQuery = (id: string) =>
  queryOptions({
    queryKey: ["conference", id],
    queryFn: () => getConference(id),
  });
