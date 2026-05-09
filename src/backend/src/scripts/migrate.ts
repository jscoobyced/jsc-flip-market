import { migrateDatabase } from '../db/migrate';

const run = async (): Promise<void> => {
  await migrateDatabase();
  console.log('Database migration complete.');
};

run().catch((error) => {
  console.error('Database migration failed.', error);
  process.exit(1);
});
