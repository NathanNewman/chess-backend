CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  elo INTEGER NOT NULL
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  user_color TEXT,
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE moves (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  notation TEXT NOT NULL,
  move_order INTEGER NOT NULL
);



