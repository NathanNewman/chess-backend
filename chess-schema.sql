CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  image_url TEXT,
  elo INTEGER NOT NULL
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username),
  user_color TEXT,
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE moves (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  notation TEXT NOT NULL,
  move_order INTEGER NOT NULL
)
