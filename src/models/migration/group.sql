CREATE TABLE public."group"
(
    id integer NOT NULL DEFAULT nextval('group_id_seq'::regclass),
    "name" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT group_pkey PRIMARY KEY (id)
);
