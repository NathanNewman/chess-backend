\echo 'Delete and recreate chess db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE chess;
CREATE DATABASE chess;
\connect chess

\i chess-schema.sql
\i chess-seed.sql
