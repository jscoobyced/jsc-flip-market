import { resetDatabase } from "../db/migrate";
import { seedSampleData } from "./seed";

const run = async (): Promise<void> => {
  await resetDatabase();
  await seedSampleData();
  console.log("Database migration complete.");
};

run().catch((error) => {
  console.error("Database migration failed.", error);
  process.exit(1);
});
