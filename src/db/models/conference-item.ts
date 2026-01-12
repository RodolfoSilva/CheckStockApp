import { Model } from "@nozbe/watermelondb";
import { date, relation, text } from "@nozbe/watermelondb/decorators";
import Asset from "./asset";

export default class ConferenceItem extends Model {
  static table = "conference_items";

  @text("barcode") barcode!: string;
  @relation("assets", "asset_id") asset!: Asset;
  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}

