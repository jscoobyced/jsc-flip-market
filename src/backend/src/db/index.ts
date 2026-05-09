import { Pool, type QueryResult, type QueryResultRow } from 'pg';

import { config } from '../config/env';

export interface DatabaseClient {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
  end?: () => Promise<void>;
}

let database: DatabaseClient | null = null;

export const createDatabase = (): DatabaseClient => new Pool({ connectionString: config.databaseUrl });

export const setDatabase = (client: DatabaseClient): void => {
  database = client;
};

export const getDatabase = (): DatabaseClient => {
  if (!database) {
    database = createDatabase();
  }

  return database;
};

export const query = <T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) =>
  getDatabase().query<T>(text, params);
