import { query } from "./index";

const dropStatements = [
  `DROP TABLE IF EXISTS enquiries;`,
  `DROP TABLE IF EXISTS property_images;`,
  `DROP TABLE IF EXISTS page_translations;`,
  `DROP TABLE IF EXISTS properties;`,
  `DROP TABLE IF EXISTS owner_profiles;`,
  `DROP TABLE IF EXISTS flipper_profiles;`,
  `DROP TABLE IF EXISTS users;`,
];

const createStatements = [
  `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      user_type TEXT NOT NULL CHECK (user_type IN ('FLIPPER', 'OWNER')),
      profile_picture TEXT,
      bio TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS flipper_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      specializations TEXT NOT NULL DEFAULT '[]',
      portfolio_projects INTEGER NOT NULL DEFAULT 0,
      rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS owner_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      company_name TEXT,
      tax_id TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      latitude NUMERIC(10, 7),
      longitude NUMERIC(10, 7),
      property_type TEXT NOT NULL,
      square_footage INTEGER,
      year_built INTEGER,
      property_condition TEXT NOT NULL,
      asking_price NUMERIC(12, 2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS property_images (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      flipper_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'accepted', 'rejected')),
      email_delivery_status TEXT NOT NULL DEFAULT 'not_attempted',
      email_delivery_details TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);`,
  `CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);`,
  `CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);`,
  `CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(city, state);`,
  `CREATE INDEX IF NOT EXISTS idx_enquiries_property ON enquiries(property_id);`,
  `CREATE INDEX IF NOT EXISTS idx_enquiries_flipper ON enquiries(flipper_id);`,
  `
    CREATE TABLE IF NOT EXISTS page_translations (
      id TEXT PRIMARY KEY,
      page_type TEXT NOT NULL,
      lang TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(page_type, lang, key)
    );
  `,
];

export const migrateDatabase = async (): Promise<void> => {
  for (const statement of createStatements) {
    await query(statement);
  }
};

export const resetDatabase = async (): Promise<void> => {
  for (const statement of dropStatements) {
    await query(statement);
  }

  for (const statement of createStatements) {
    await query(statement);
  }
};
