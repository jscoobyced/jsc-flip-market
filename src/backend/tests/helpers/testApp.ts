import fs from 'fs/promises';
import path from 'path';

import { newDb } from 'pg-mem';

import { createApp } from '../../src/app';
import { config } from '../../src/config/env';
import { setDatabase } from '../../src/db';
import { migrateDatabase } from '../../src/db/migrate';

export const setupTestApp = async () => {
  const memoryDb = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = memoryDb.adapters.createPg();
  const pool = new adapter.Pool();
  setDatabase(pool);
  await migrateDatabase();
  await fs.rm(path.resolve(config.uploadPath), { recursive: true, force: true });
  await fs.mkdir(path.resolve(config.uploadPath), { recursive: true });

  return {
    app: createApp(),
    pool,
  };
};
