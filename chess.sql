\echo 'Delete and recreate chess db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE chess;
CREATE DATABASE chess;
\connect chess

\i chess-schema.sql
\i chess-seed.sql

\echo 'Delete and recreate chess_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE chess_test;
CREATE DATABASE chess_test;
\connect chess_test

\i chess-schema.sql
