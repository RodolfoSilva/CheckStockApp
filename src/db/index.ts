import { Database } from "@nozbe/watermelondb";
import { adapter } from "./adapter";
import Asset from "./models/asset";
import Place from "./models/place";

export const database = new Database({
  adapter,
  modelClasses: [Place, Asset],
});
