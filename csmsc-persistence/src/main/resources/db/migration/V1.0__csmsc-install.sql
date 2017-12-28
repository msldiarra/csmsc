--
-- DB : csmsc postgres
-- Table creation
--

CREATE TABLE IF NOT EXISTS location (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(50) NOT NULL DEFAULT md5(random()::text),
  name VARCHAR(100) NOT NULL,
  location_type_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS location_child (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  parent_id INTEGER NOT NULL
);


--(1 for cercle, 2 for commune)
CREATE TABLE IF NOT EXISTS location_type (
  id SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS bureau (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(50) NOT NULL DEFAULT md5(random()::text),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS bureau_location (
  bureau_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL,
  UNIQUE (bureau_id, location_id)
);

CREATE TABLE IF NOT EXISTS member (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  nina VARCHAR(50) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  location_id INTEGER NOT NULL, --- VFQ
  bureau_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  login VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  enabled bit(1) NOT NULL DEFAULT '1'
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  uri varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL UNIQUE,
  mime_type varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bureau_media (
  bureau_id INTEGER NOT NULL,
  media_id INTEGER NOT NULL
);


CREATE VIEW locations AS
  SELECT l.id, l.ref, (l.name || ' (' || lt.label || ')' ) AS name, location_type_id
  FROM location AS l
    INNER JOIN location_type AS lt ON l.location_type_id = lt.id;



--
-- Constraints
--


ALTER TABLE bureau_location
  ADD CONSTRAINT fk_bureau_id_bureau_location FOREIGN KEY (bureau_id) REFERENCES bureau (id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_location_id_bureau_location FOREIGN KEY (location_id) REFERENCES location (id) ON DELETE CASCADE;


ALTER TABLE member
  ADD CONSTRAINT fk_bureau_id_member FOREIGN KEY (bureau_id) REFERENCES bureau (id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_location_id_member FOREIGN KEY (location_id) REFERENCES location (id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_role_id_member FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE;

ALTER TABLE location
  ADD CONSTRAINT fk_location_location_type FOREIGN KEY (location_type_id) REFERENCES location_type (id);

ALTER TABLE location_child
  ADD CONSTRAINT fk_location_child_parent FOREIGN KEY (parent_id) REFERENCES location (id),
  ADD CONSTRAINT fk_location_child FOREIGN KEY (child_id) REFERENCES location (id);


ALTER TABLE bureau_media
  ADD CONSTRAINT fk_bureau_media_record FOREIGN KEY (bureau_id) REFERENCES bureau (id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_bureau_media_media FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE;


