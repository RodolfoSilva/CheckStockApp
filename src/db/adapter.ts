import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { Platform } from "react-native";
import schema from "./schema";
// import migrations from "./migrations";

export const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  // migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: Platform.OS === "ios",
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    console.error(error);
    // Database failed to load -- offer the user to reload the app or log out
  },
});
