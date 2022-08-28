CREATE DATABASE IF NOT EXISTS pressure_note_db;

USE pressure_note_db;

-- CREATE TABLE IF NOT EXISTS gmail_users (
--   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   name TEXT NOT NULL,
--   mail TEXT NOT NULL,
--   image TEXT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS exam_users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS papers (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paper_details (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pid INT NOT NULL,
  uid INT NOT NULL,
  title TEXT NOT NULL,
  paper_width INT NOT NULL,
  paper_height INT NOT NULL,
  paper_image TEXT NOT NULL,
  paper_json TEXT NOT NULL,
  pressure_list TEXT NOT NULL,
  background_image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS strokes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  pid INT NOT NULL,
  pdid INT NOT NULL,
  detail TEXT NOT NULL,
  avg_pressure FLOAT NOT NULL,
  pressure_list TEXT NOT NULL,
  time FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  pdid INT NOT NULL,
  stroke_data TEXT NOT NULL,
  url LONGTEXT NOT NULL,
  pressure_list TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS use_pressure_undo (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  pid INT NOT NULL,
  pdid INT NOT NULL,
  pressure FLOAT NOT NULL,
  count INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);