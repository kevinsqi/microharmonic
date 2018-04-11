CREATE TABLE compositions (
  id SERIAL PRIMARY KEY,
  short_id TEXT UNIQUE NOT NULL,
  title TEXT,
  json_value JSONB NOT NULL
);
