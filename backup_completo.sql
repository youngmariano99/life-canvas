--
-- PostgreSQL database dump
--

\restrict iZDnRo4yEFKsDlPdcMDvUJdYpUMWYbeiyyRmgTv1F5Z8s5CaL5KAxziwiPU7mKm

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.habit_logs DROP CONSTRAINT IF EXISTS "FK_f3f2d75f039fcdf30df838abdf2";
ALTER TABLE IF EXISTS ONLY public.project_activities DROP CONSTRAINT IF EXISTS "FK_da57aaa2cda866acedacc09867f";
ALTER TABLE IF EXISTS ONLY public.note_tags DROP CONSTRAINT IF EXISTS "FK_bffb961e5cd19ef47e9a4ae19c5";
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS "FK_a969861629af37cd1c7f4ff3e6b";
ALTER TABLE IF EXISTS ONLY public.sub_goals DROP CONSTRAINT IF EXISTS "FK_98721c678cef99de7d93ba3c1aa";
ALTER TABLE IF EXISTS ONLY public.note_tags_notes_note DROP CONSTRAINT IF EXISTS "FK_93570f0a3bba9a17c650c93e3f7";
ALTER TABLE IF EXISTS ONLY public.notes DROP CONSTRAINT IF EXISTS "FK_8aa719f42b3c8b23c2d29f799c0";
ALTER TABLE IF EXISTS ONLY public.goals DROP CONSTRAINT IF EXISTS "FK_88b78010581f2d293699d064441";
ALTER TABLE IF EXISTS ONLY public.calendar_events DROP CONSTRAINT IF EXISTS "FK_7f9a3d7f6217b99b6b2431887df";
ALTER TABLE IF EXISTS ONLY public.notes DROP CONSTRAINT IF EXISTS "FK_7708dcb62ff332f0eaf9f0743a7";
ALTER TABLE IF EXISTS ONLY public.note_folders DROP CONSTRAINT IF EXISTS "FK_6860665fdce2890dc09b4995049";
ALTER TABLE IF EXISTS ONLY public.habits DROP CONSTRAINT IF EXISTS "FK_652ea1f27d16800eca4259546a1";
ALTER TABLE IF EXISTS ONLY public.deviations DROP CONSTRAINT IF EXISTS "FK_63d633b0eeff4b8566e91042617";
ALTER TABLE IF EXISTS ONLY public.note_folders DROP CONSTRAINT IF EXISTS "FK_567994121091683b9f55ee9e538";
ALTER TABLE IF EXISTS ONLY public.daily_stones DROP CONSTRAINT IF EXISTS "FK_553c0ab9d494c151088ba4f02e7";
ALTER TABLE IF EXISTS ONLY public.habits DROP CONSTRAINT IF EXISTS "FK_5353fbb536ec3154d5d3bf7e51f";
ALTER TABLE IF EXISTS ONLY public.fitness_routines DROP CONSTRAINT IF EXISTS "FK_4f69ecfd6feadff2423fb9677b5";
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS "FK_4a99044c4dfc22f83a3a75f5cb3";
ALTER TABLE IF EXISTS ONLY public.note_tags_notes_note DROP CONSTRAINT IF EXISTS "FK_3ed93d0db691ee24cf2e504df23";
ALTER TABLE IF EXISTS ONLY public.daily_stones DROP CONSTRAINT IF EXISTS "FK_3993cc317fcc122379933cfaf8f";
ALTER TABLE IF EXISTS ONLY public.fitness_activities DROP CONSTRAINT IF EXISTS "FK_2daf016d53168211058cb7c6014";
ALTER TABLE IF EXISTS ONLY public.project_activities DROP CONSTRAINT IF EXISTS "FK_28d3e131cdc53c373b887207027";
ALTER TABLE IF EXISTS ONLY public.goals DROP CONSTRAINT IF EXISTS "FK_22cd4b8b6b403ce3814b58265a3";
ALTER TABLE IF EXISTS ONLY public.deviations DROP CONSTRAINT IF EXISTS "FK_1b53b90c3ca98732b6e1a691964";
ALTER TABLE IF EXISTS ONLY public.resources DROP CONSTRAINT IF EXISTS "FK_1609d7d65be85ad9ffb1923f6f9";
DROP INDEX IF EXISTS public."IDX_93570f0a3bba9a17c650c93e3f";
DROP INDEX IF EXISTS public."IDX_3ed93d0db691ee24cf2e504df2";
ALTER TABLE IF EXISTS ONLY public.daily_stones DROP CONSTRAINT IF EXISTS "UQ_9800c787ba210e325d8ab02cf71";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3";
ALTER TABLE IF EXISTS ONLY public.habit_logs DROP CONSTRAINT IF EXISTS "UQ_0cc1b37af1973391d8bc2566df0";
ALTER TABLE IF EXISTS ONLY public.fitness_routines DROP CONSTRAINT IF EXISTS "PK_fcecfc6ac3a319ea8a980ded436";
ALTER TABLE IF EXISTS ONLY public.calendar_events DROP CONSTRAINT IF EXISTS "PK_faf5391d232322a87cdd1c6f30c";
ALTER TABLE IF EXISTS ONLY public.project_activities DROP CONSTRAINT IF EXISTS "PK_f322a4f9aed232d8868d54ec30c";
ALTER TABLE IF EXISTS ONLY public.note_tags DROP CONSTRAINT IF EXISTS "PK_ca61a805f00b069d6a9ec15b56b";
ALTER TABLE IF EXISTS ONLY public.deviations DROP CONSTRAINT IF EXISTS "PK_c893e73cef70784922b7becff60";
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS "PK_c1433d71a4838793a49dcad46ab";
ALTER TABLE IF EXISTS ONLY public.habits DROP CONSTRAINT IF EXISTS "PK_b3ec33c2d7af69d09fcf4af7e39";
ALTER TABLE IF EXISTS ONLY public.notes DROP CONSTRAINT IF EXISTS "PK_af6206538ea96c4e77e9f400c3d";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.daily_stones DROP CONSTRAINT IF EXISTS "PK_8bc04e825338504cffe9636a532";
ALTER TABLE IF EXISTS ONLY public.habit_logs DROP CONSTRAINT IF EXISTS "PK_683b23b199ac5c9c1f06e0e7c9e";
ALTER TABLE IF EXISTS ONLY public.resources DROP CONSTRAINT IF EXISTS "PK_632484ab9dff41bba94f9b7c85e";
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS "PK_6271df0a7aed1d6c0691ce6ac50";
ALTER TABLE IF EXISTS ONLY public.sub_goals DROP CONSTRAINT IF EXISTS "PK_3842a8ff61fb6255bc0d0188f9d";
ALTER TABLE IF EXISTS ONLY public.note_tags_notes_note DROP CONSTRAINT IF EXISTS "PK_32d20d5dbfdf57f9cee5550a776";
ALTER TABLE IF EXISTS ONLY public.note_folders DROP CONSTRAINT IF EXISTS "PK_2719f464503fdbae9ccd1c97a0a";
ALTER TABLE IF EXISTS ONLY public.goals DROP CONSTRAINT IF EXISTS "PK_26e17b251afab35580dff769223";
ALTER TABLE IF EXISTS ONLY public.fitness_activities DROP CONSTRAINT IF EXISTS "PK_11cc1660bdad570875fcbc7e7d6";
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.sub_goals;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.resources;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.project_activities;
DROP TABLE IF EXISTS public.notes;
DROP TABLE IF EXISTS public.note_tags_notes_note;
DROP TABLE IF EXISTS public.note_tags;
DROP TABLE IF EXISTS public.note_folders;
DROP TABLE IF EXISTS public.habits;
DROP TABLE IF EXISTS public.habit_logs;
DROP TABLE IF EXISTS public.goals;
DROP TABLE IF EXISTS public.fitness_routines;
DROP TABLE IF EXISTS public.fitness_activities;
DROP TABLE IF EXISTS public.deviations;
DROP TABLE IF EXISTS public.daily_stones;
DROP TABLE IF EXISTS public.calendar_events;
DROP EXTENSION IF EXISTS "uuid-ossp";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calendar_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description character varying,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    all_day boolean DEFAULT false NOT NULL,
    type character varying(50),
    color character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: daily_stones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_stones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    title character varying(255) NOT NULL,
    role_id uuid,
    completed boolean DEFAULT false,
    note text
);


--
-- Name: deviations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deviations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    goal_id uuid,
    title character varying(255) NOT NULL,
    reason character varying(255),
    correction character varying(255),
    date date NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: fitness_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fitness_activities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(255) NOT NULL,
    date date NOT NULL,
    duration integer,
    calories integer,
    distance double precision,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: fitness_routines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fitness_routines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    structure_type character varying(50) NOT NULL,
    content jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    rounds character varying
);


--
-- Name: goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.goals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description character varying,
    quarter smallint,
    semester smallint,
    target_date date,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: habit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    habit_id uuid NOT NULL,
    date date NOT NULL,
    status character varying(20) DEFAULT 'completed'::character varying,
    note text
);


--
-- Name: habits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habits (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid,
    name character varying(255) NOT NULL,
    frequency character varying(20) DEFAULT 'daily'::character varying,
    custom_days smallint[] DEFAULT '{}'::smallint[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: note_folders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_folders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    parent_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: note_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(50) NOT NULL,
    color character varying(20) DEFAULT '#808080'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: note_tags_notes_note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note_tags_notes_note (
    "noteId" uuid NOT NULL,
    "noteTagId" uuid NOT NULL
);


--
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    folder_id uuid,
    title character varying(255) NOT NULL,
    content text,
    "isFavorite" boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    type character varying(50) DEFAULT 'note'::character varying NOT NULL
);


--
-- Name: project_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_activities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    status character varying(100) DEFAULT 'Por hacer'::character varying,
    sort_order integer DEFAULT 0,
    due_date date,
    role_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    goal_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying,
    due_date date,
    statuses text[] DEFAULT '{"Por hacer","En progreso","En revisión",Completada}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    goal_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying(255) NOT NULL,
    quantity_have numeric DEFAULT '0'::numeric NOT NULL,
    quantity_needed numeric DEFAULT '0'::numeric NOT NULL,
    unit character varying(50)
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    icon character varying(50) DEFAULT 'circle'::character varying,
    color character varying(50) DEFAULT 'student'::character varying,
    description character varying,
    image_url character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: sub_goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_goals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    goal_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    name character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: calendar_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.calendar_events (id, user_id, title, description, start_date, end_date, all_day, type, color, created_at, updated_at) FROM stdin;
46659a2b-4c20-49f2-b533-07b978206620	29ef8642-b55f-4cab-ae38-a6d83dce29a9	sdfsdf	sdfsdf	2026-01-19 21:00:00	2026-01-19 21:00:00	f	personal	\N	2026-01-19 18:30:14.946541	2026-01-19 18:30:14.946541
cf7540bb-bba0-4a4f-b9dc-bc64e6a678cd	29ef8642-b55f-4cab-ae38-a6d83dce29a9	sdfsdf	sdfs	2026-01-18 21:00:00	2026-01-18 21:00:00	f	personal	\N	2026-01-19 18:30:17.616427	2026-01-19 18:30:17.616427
\.


--
-- Data for Name: daily_stones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_stones (id, user_id, date, title, role_id, completed, note) FROM stdin;
7f84986f-e2e9-4059-bc48-1e463e3db922	29ef8642-b55f-4cab-ae38-a6d83dce29a9	2026-01-18	zxc	\N	f	
defbc7e8-47b9-40ff-95dd-7d3f339e93a2	29ef8642-b55f-4cab-ae38-a6d83dce29a9	2026-01-19	dfsf	\N	f	
eabd465a-74a7-4af7-820c-1692d785d619	29ef8642-b55f-4cab-ae38-a6d83dce29a9	2026-01-20	Organizar todo	\N	f	
\.


--
-- Data for Name: deviations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deviations (id, user_id, goal_id, title, reason, correction, date, created_at) FROM stdin;
\.


--
-- Data for Name: fitness_activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fitness_activities (id, user_id, type, date, duration, calories, distance, notes, created_at) FROM stdin;
646e4e15-13e4-466f-beb4-2fb7d1acc23d	29ef8642-b55f-4cab-ae38-a6d83dce29a9	workout	2026-01-18	2	\N	\N	asdas	2026-01-19 18:41:34.621682
3202a5a5-b9c2-4e25-857f-f52e1d490e25	29ef8642-b55f-4cab-ae38-a6d83dce29a9	workout	2026-01-18	15	\N	2.5	Estructura: intervals\n- 20x: 10/20 (trote/caminata)\n-Vuelta con trote	2026-01-19 21:27:50.740319
\.


--
-- Data for Name: fitness_routines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fitness_routines (id, user_id, name, type, structure_type, content, created_at, rounds) FROM stdin;
1c1380bb-4e9e-46d5-b296-243d14673e18	29ef8642-b55f-4cab-ae38-a6d83dce29a9	INTERVALO AEROBICO (SEMANA 1)	cardio	intervals	[{"rest": "20", "sets": "20", "work": "10", "exercise": "trote/caminata"}]	2026-01-19 19:26:57.885124	\N
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.goals (id, user_id, role_id, title, description, quarter, semester, target_date, status, created_at, updated_at) FROM stdin;
11542179-6cc1-4fcc-b1ed-47e1456cc493	29ef8642-b55f-4cab-ae38-a6d83dce29a9	f202534f-be1c-4fb4-9958-f8dc6edd73fa	Generar un ecosistema productivo que sustente los estudios y la estabilidad familiar para  julio de 2026.	\N	2	1	\N	pending	2026-01-19 17:26:00.606666	2026-01-19 17:26:00.606666
160913db-b9fa-4dab-b582-f2bb82a52608	29ef8642-b55f-4cab-ae38-a6d83dce29a9	94500985-e554-4b9a-8bad-694722dec192	Completar todos los requisitos de cursada y prácticas para quedar a un paso de la Tesis para fines de diciembre 2026	\N	4	2	\N	pending	2026-01-19 17:26:56.047591	2026-01-19 17:26:56.047591
c4a8c622-ec7e-4691-b8af-842ca9846d39	29ef8642-b55f-4cab-ae38-a6d83dce29a9	1aa4ec49-9396-482a-99a9-b4d04482b09a	Lograr al 100% las marcas que me proponga para fin de año 2026	\N	4	2	\N	pending	2026-01-19 17:28:26.004133	2026-01-19 17:28:26.004133
7e471139-679d-4a10-8ed8-1cae5a7ade23	29ef8642-b55f-4cab-ae38-a6d83dce29a9	6a9825ae-0337-4594-ae82-af7e4ff71496	Finalizar el 100% de la Tecnicatura para julio de 2026.	\N	2	1	\N	pending	2026-01-19 17:26:19.719371	2026-01-20 09:51:20.139915
\.


--
-- Data for Name: habit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.habit_logs (id, habit_id, date, status, note) FROM stdin;
f49b3410-bcbe-4a49-b8b8-7e9f3b2dfb78	8ccc1b2e-acb6-4d9a-801a-20d0189c9e91	2026-01-18	completed	
c168853c-33b0-441c-900c-9592db5d043f	64101ec8-5ec1-4eed-82c4-e6a84a35ee88	2026-01-18	completed	
d75dbb03-fd9d-476e-8396-8169eba64f2e	e0ef7d86-531f-4e05-9d56-702e74c0cb76	2026-01-18	completed	
1fe98320-9eea-4fb9-bd29-b1764d55c75e	1a8893d5-8282-49b8-88ca-a6e11e73ba35	2026-01-18	completed	
86d85a77-f99d-45c1-857f-615df81cb7ef	64101ec8-5ec1-4eed-82c4-e6a84a35ee88	2026-01-19	day_off	
2e8f97ae-a31c-423f-91c1-396480c2378c	e0ef7d86-531f-4e05-9d56-702e74c0cb76	2026-01-19	day_off	
de14b04f-b359-4ea7-9330-b7dcf1c7ccac	1a8893d5-8282-49b8-88ca-a6e11e73ba35	2026-01-19	day_off	
\.


--
-- Data for Name: habits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.habits (id, user_id, role_id, name, frequency, custom_days, created_at) FROM stdin;
8ccc1b2e-acb6-4d9a-801a-20d0189c9e91	29ef8642-b55f-4cab-ae38-a6d83dce29a9	1aa4ec49-9396-482a-99a9-b4d04482b09a	Realizar 3 actividades NEAT por día	daily	{}	2026-01-19 17:28:47.575473
e0ef7d86-531f-4e05-9d56-702e74c0cb76	29ef8642-b55f-4cab-ae38-a6d83dce29a9	1aa4ec49-9396-482a-99a9-b4d04482b09a	Entrenar 3 veces por semana	daily	{}	2026-01-19 17:29:07.208094
64101ec8-5ec1-4eed-82c4-e6a84a35ee88	29ef8642-b55f-4cab-ae38-a6d83dce29a9	6a9825ae-0337-4594-ae82-af7e4ff71496	Dedicarle 1hs por día a la creación del software	daily	{}	2026-01-19 17:30:13.580404
1a8893d5-8282-49b8-88ca-a6e11e73ba35	29ef8642-b55f-4cab-ae38-a6d83dce29a9	94500985-e554-4b9a-8bad-694722dec192	sdad	daily	{}	2026-01-19 17:51:04.081209
\.


--
-- Data for Name: note_folders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.note_folders (id, user_id, name, parent_id, created_at) FROM stdin;
\.


--
-- Data for Name: note_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.note_tags (id, user_id, name, color, created_at) FROM stdin;
\.


--
-- Data for Name: note_tags_notes_note; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.note_tags_notes_note ("noteId", "noteTagId") FROM stdin;
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notes (id, user_id, folder_id, title, content, "isFavorite", created_at, updated_at, type) FROM stdin;
\.


--
-- Data for Name: project_activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_activities (id, project_id, title, status, sort_order, due_date, role_id, created_at) FROM stdin;
60b848ff-3310-4495-9b95-078e6a384940	0ec25d0b-af3b-44cf-a02e-70224f16072b	xcz	Por hacer	0	\N	\N	2026-01-19 17:44:56.19717
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, goal_id, name, description, due_date, statuses, created_at, updated_at) FROM stdin;
0ec25d0b-af3b-44cf-a02e-70224f16072b	c4a8c622-ec7e-4691-b8af-842ca9846d39	ghg	\N	\N	{"Por hacer","En progreso","En revisión",Completada}	2026-01-19 17:44:49.273772	2026-01-19 17:44:49.273772
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, goal_id, created_at, name, quantity_have, quantity_needed, unit) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, user_id, name, icon, color, description, image_url, created_at) FROM stdin;
1aa4ec49-9396-482a-99a9-b4d04482b09a	29ef8642-b55f-4cab-ae38-a6d83dce29a9	Atleta	Dumbbell	athlete	\N	\N	2026-01-19 17:10:18.272794
f202534f-be1c-4fb4-9958-f8dc6edd73fa	29ef8642-b55f-4cab-ae38-a6d83dce29a9	Emprendedor	Briefcase	entrepreneur	\N	\N	2026-01-19 17:10:29.399883
6a9825ae-0337-4594-ae82-af7e4ff71496	29ef8642-b55f-4cab-ae38-a6d83dce29a9	Programador	Users	student	\N	\N	2026-01-19 17:10:42.89291
94500985-e554-4b9a-8bad-694722dec192	29ef8642-b55f-4cab-ae38-a6d83dce29a9	Lic.Administrador	Users	creative	\N	\N	2026-01-19 17:10:53.906738
\.


--
-- Data for Name: sub_goals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_goals (id, goal_id, title, completed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, name, created_at, updated_at) FROM stdin;
29ef8642-b55f-4cab-ae38-a6d83dce29a9	demo@lifecanvas.com	Demo User	2026-01-19 11:18:34.599086	2026-01-19 11:18:34.599086
\.


--
-- Name: fitness_activities PK_11cc1660bdad570875fcbc7e7d6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitness_activities
    ADD CONSTRAINT "PK_11cc1660bdad570875fcbc7e7d6" PRIMARY KEY (id);


--
-- Name: goals PK_26e17b251afab35580dff769223; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY (id);


--
-- Name: note_folders PK_2719f464503fdbae9ccd1c97a0a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_folders
    ADD CONSTRAINT "PK_2719f464503fdbae9ccd1c97a0a" PRIMARY KEY (id);


--
-- Name: note_tags_notes_note PK_32d20d5dbfdf57f9cee5550a776; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_tags_notes_note
    ADD CONSTRAINT "PK_32d20d5dbfdf57f9cee5550a776" PRIMARY KEY ("noteId", "noteTagId");


--
-- Name: sub_goals PK_3842a8ff61fb6255bc0d0188f9d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_goals
    ADD CONSTRAINT "PK_3842a8ff61fb6255bc0d0188f9d" PRIMARY KEY (id);


--
-- Name: projects PK_6271df0a7aed1d6c0691ce6ac50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY (id);


--
-- Name: resources PK_632484ab9dff41bba94f9b7c85e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY (id);


--
-- Name: habit_logs PK_683b23b199ac5c9c1f06e0e7c9e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT "PK_683b23b199ac5c9c1f06e0e7c9e" PRIMARY KEY (id);


--
-- Name: daily_stones PK_8bc04e825338504cffe9636a532; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_stones
    ADD CONSTRAINT "PK_8bc04e825338504cffe9636a532" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: notes PK_af6206538ea96c4e77e9f400c3d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY (id);


--
-- Name: habits PK_b3ec33c2d7af69d09fcf4af7e39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT "PK_b3ec33c2d7af69d09fcf4af7e39" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: deviations PK_c893e73cef70784922b7becff60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deviations
    ADD CONSTRAINT "PK_c893e73cef70784922b7becff60" PRIMARY KEY (id);


--
-- Name: note_tags PK_ca61a805f00b069d6a9ec15b56b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT "PK_ca61a805f00b069d6a9ec15b56b" PRIMARY KEY (id);


--
-- Name: project_activities PK_f322a4f9aed232d8868d54ec30c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_activities
    ADD CONSTRAINT "PK_f322a4f9aed232d8868d54ec30c" PRIMARY KEY (id);


--
-- Name: calendar_events PK_faf5391d232322a87cdd1c6f30c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT "PK_faf5391d232322a87cdd1c6f30c" PRIMARY KEY (id);


--
-- Name: fitness_routines PK_fcecfc6ac3a319ea8a980ded436; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitness_routines
    ADD CONSTRAINT "PK_fcecfc6ac3a319ea8a980ded436" PRIMARY KEY (id);


--
-- Name: habit_logs UQ_0cc1b37af1973391d8bc2566df0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT "UQ_0cc1b37af1973391d8bc2566df0" UNIQUE (habit_id, date);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: daily_stones UQ_9800c787ba210e325d8ab02cf71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_stones
    ADD CONSTRAINT "UQ_9800c787ba210e325d8ab02cf71" UNIQUE (user_id, date);


--
-- Name: IDX_3ed93d0db691ee24cf2e504df2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_3ed93d0db691ee24cf2e504df2" ON public.note_tags_notes_note USING btree ("noteId");


--
-- Name: IDX_93570f0a3bba9a17c650c93e3f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_93570f0a3bba9a17c650c93e3f" ON public.note_tags_notes_note USING btree ("noteTagId");


--
-- Name: resources FK_1609d7d65be85ad9ffb1923f6f9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT "FK_1609d7d65be85ad9ffb1923f6f9" FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE;


--
-- Name: deviations FK_1b53b90c3ca98732b6e1a691964; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deviations
    ADD CONSTRAINT "FK_1b53b90c3ca98732b6e1a691964" FOREIGN KEY (goal_id) REFERENCES public.goals(id);


--
-- Name: goals FK_22cd4b8b6b403ce3814b58265a3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT "FK_22cd4b8b6b403ce3814b58265a3" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: project_activities FK_28d3e131cdc53c373b887207027; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_activities
    ADD CONSTRAINT "FK_28d3e131cdc53c373b887207027" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: fitness_activities FK_2daf016d53168211058cb7c6014; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitness_activities
    ADD CONSTRAINT "FK_2daf016d53168211058cb7c6014" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_stones FK_3993cc317fcc122379933cfaf8f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_stones
    ADD CONSTRAINT "FK_3993cc317fcc122379933cfaf8f" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: note_tags_notes_note FK_3ed93d0db691ee24cf2e504df23; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_tags_notes_note
    ADD CONSTRAINT "FK_3ed93d0db691ee24cf2e504df23" FOREIGN KEY ("noteId") REFERENCES public.notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects FK_4a99044c4dfc22f83a3a75f5cb3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "FK_4a99044c4dfc22f83a3a75f5cb3" FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE;


--
-- Name: fitness_routines FK_4f69ecfd6feadff2423fb9677b5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitness_routines
    ADD CONSTRAINT "FK_4f69ecfd6feadff2423fb9677b5" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: habits FK_5353fbb536ec3154d5d3bf7e51f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT "FK_5353fbb536ec3154d5d3bf7e51f" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: daily_stones FK_553c0ab9d494c151088ba4f02e7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_stones
    ADD CONSTRAINT "FK_553c0ab9d494c151088ba4f02e7" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: note_folders FK_567994121091683b9f55ee9e538; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_folders
    ADD CONSTRAINT "FK_567994121091683b9f55ee9e538" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: deviations FK_63d633b0eeff4b8566e91042617; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deviations
    ADD CONSTRAINT "FK_63d633b0eeff4b8566e91042617" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: habits FK_652ea1f27d16800eca4259546a1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT "FK_652ea1f27d16800eca4259546a1" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: note_folders FK_6860665fdce2890dc09b4995049; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_folders
    ADD CONSTRAINT "FK_6860665fdce2890dc09b4995049" FOREIGN KEY (parent_id) REFERENCES public.note_folders(id) ON DELETE CASCADE;


--
-- Name: notes FK_7708dcb62ff332f0eaf9f0743a7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: calendar_events FK_7f9a3d7f6217b99b6b2431887df; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT "FK_7f9a3d7f6217b99b6b2431887df" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: goals FK_88b78010581f2d293699d064441; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT "FK_88b78010581f2d293699d064441" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notes FK_8aa719f42b3c8b23c2d29f799c0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "FK_8aa719f42b3c8b23c2d29f799c0" FOREIGN KEY (folder_id) REFERENCES public.note_folders(id) ON DELETE SET NULL;


--
-- Name: note_tags_notes_note FK_93570f0a3bba9a17c650c93e3f7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_tags_notes_note
    ADD CONSTRAINT "FK_93570f0a3bba9a17c650c93e3f7" FOREIGN KEY ("noteTagId") REFERENCES public.note_tags(id);


--
-- Name: sub_goals FK_98721c678cef99de7d93ba3c1aa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_goals
    ADD CONSTRAINT "FK_98721c678cef99de7d93ba3c1aa" FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE;


--
-- Name: roles FK_a969861629af37cd1c7f4ff3e6b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "FK_a969861629af37cd1c7f4ff3e6b" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: note_tags FK_bffb961e5cd19ef47e9a4ae19c5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note_tags
    ADD CONSTRAINT "FK_bffb961e5cd19ef47e9a4ae19c5" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_activities FK_da57aaa2cda866acedacc09867f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_activities
    ADD CONSTRAINT "FK_da57aaa2cda866acedacc09867f" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: habit_logs FK_f3f2d75f039fcdf30df838abdf2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT "FK_f3f2d75f039fcdf30df838abdf2" FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iZDnRo4yEFKsDlPdcMDvUJdYpUMWYbeiyyRmgTv1F5Z8s5CaL5KAxziwiPU7mKm

