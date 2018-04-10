DROP DATABASE IF EXISTS microharmonic;
CREATE DATABASE microharmonic;

\connect microharmonic;

CREATE TABLE compositions (
  id integer PRIMARY KEY,
  short_id text UNIQUE NOT NULL,
  title text,
  json_value jsonb NOT NULL
);
