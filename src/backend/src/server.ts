import { createApp } from './app';
import { config } from './config/env';
import { migrateDatabase } from './db/migrate';
import { ensureUploadDir } from './middleware/upload';

const start = async (): Promise<void> => {
  ensureUploadDir();

  if (config.autoMigrate) {
    await migrateDatabase();
  }

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Backend listening on port ${config.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
