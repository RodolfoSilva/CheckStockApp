import { Database } from "@nozbe/watermelondb";
import { adapter } from "./adapter";
import Asset from "./models/asset";
import Conference from "./models/conference";
import ConferenceItem from "./models/conference-item";
import ConferencePicking from "./models/conference-picking";
import Place from "./models/place";

export const database = new Database({
  adapter,
  modelClasses: [Place, Asset, Conference, ConferenceItem, ConferencePicking],
});
