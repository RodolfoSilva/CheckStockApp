import { Model } from "@nozbe/watermelondb";
import { date, field, relation, text } from "@nozbe/watermelondb/decorators";
import Asset from "./asset";
import Conference from "./conference";
import ConferenceItem from "./conference-item";

export default class ConferencePicking extends Model {
  static table = "conference_pickings";

  @relation("conferences", "conference_id") conference!: Conference;
  @relation("assets", "asset_id") asset!: Asset;
  @relation("conference_items", "conference_item_id")
  conferenceItem?: ConferenceItem;
  @field("quantity") quantity!: number;
  @text("barcode") barcode!: string;
  @text("picking_mode") pickingMode!: "individual" | "quantity";
  @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}

