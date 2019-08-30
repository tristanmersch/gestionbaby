CREATE DATABASE babyfoot
WITH
OWNER = postgres
ENCODING = 'UTF8'
LC_COLLATE = 'French_France.1252'
LC_CTYPE = 'French_France.1252'
TABLESPACE = pg_default
CONNECTION LIMIT = -1;

CREATE SCHEMA babyfoot
AUTHORIZATION postgres;

CREATE TABLE babyfoot.joueur
(
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
  "dateCreation" date NOT NULL,
  nom character varying(50) COLLATE pg_catalog."default" NOT NULL,
  CONSTRAINT utilisateur_pkey PRIMARY KEY (id)
)
WITH (
  OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE babyfoot.joueur
OWNER to postgres;

CREATE TABLE babyfoot.partie
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "dateCreation" date,
    "dateDebut" date NOT NULL,
    statut character varying(100) COLLATE pg_catalog."default" NOT NULL DEFAULT 'A JOUER'::character varying,
    "dateSuppression" date,
    mode integer NOT NULL DEFAULT 1,
    "dateFin" date,
    score1 integer,
    score2 integer,
    CONSTRAINT partie_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE babyfoot.partie
OWNER to postgres;

CREATE TABLE babyfoot."PartieParUtilisateur"
(
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
  "idPartie" integer NOT NULL,
  "idJoueur" integer NOT NULL,
  CONSTRAINT "PartieParUtilisateur_pkey" PRIMARY KEY (id),
  CONSTRAINT "idJoueur_fk" FOREIGN KEY ("idJoueur")
  REFERENCES babyfoot.joueur (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION,
  CONSTRAINT "id_Partie_fk" FOREIGN KEY ("idPartie")
  REFERENCES babyfoot.partie (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION
)
WITH (
  OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE babyfoot."PartieParUtilisateur"
OWNER to postgres;