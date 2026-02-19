--
-- PostgreSQL database dump
--

\restrict K3MUv0CZfVBaBRa48bhBmCJ5pOVEYPIpeuAINy5hEwbS92n2WvqesaJKTdudR6z

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

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, name, created_at, updated_at) VALUES ('29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'demo@lifecanvas.com', 'Demo User', '2026-01-19 11:18:34.599086', '2026-01-19 11:18:34.599086');


--
-- Data for Name: calendar_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.calendar_events (id, user_id, title, description, start_date, end_date, all_day, type, color, created_at, updated_at) VALUES ('46659a2b-4c20-49f2-b533-07b978206620', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'sdfsdf', 'sdfsdf', '2026-01-19 21:00:00', '2026-01-19 21:00:00', false, 'personal', NULL, '2026-01-19 18:30:14.946541', '2026-01-19 18:30:14.946541');
INSERT INTO public.calendar_events (id, user_id, title, description, start_date, end_date, all_day, type, color, created_at, updated_at) VALUES ('cf7540bb-bba0-4a4f-b9dc-bc64e6a678cd', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'sdfsdf', 'sdfs', '2026-01-18 21:00:00', '2026-01-18 21:00:00', false, 'personal', NULL, '2026-01-19 18:30:17.616427', '2026-01-19 18:30:17.616427');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (id, user_id, name, icon, color, description, image_url, created_at) VALUES ('1aa4ec49-9396-482a-99a9-b4d04482b09a', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'Atleta', 'Dumbbell', 'athlete', NULL, NULL, '2026-01-19 17:10:18.272794');
INSERT INTO public.roles (id, user_id, name, icon, color, description, image_url, created_at) VALUES ('f202534f-be1c-4fb4-9958-f8dc6edd73fa', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'Emprendedor', 'Briefcase', 'entrepreneur', NULL, NULL, '2026-01-19 17:10:29.399883');
INSERT INTO public.roles (id, user_id, name, icon, color, description, image_url, created_at) VALUES ('6a9825ae-0337-4594-ae82-af7e4ff71496', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'Programador', 'Users', 'student', NULL, NULL, '2026-01-19 17:10:42.89291');
INSERT INTO public.roles (id, user_id, name, icon, color, description, image_url, created_at) VALUES ('94500985-e554-4b9a-8bad-694722dec192', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'Lic.Administrador', 'Users', 'creative', NULL, NULL, '2026-01-19 17:10:53.906738');


--
-- Data for Name: daily_stones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.daily_stones (id, user_id, date, title, role_id, completed, note) VALUES ('7f84986f-e2e9-4059-bc48-1e463e3db922', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '2026-01-18', 'zxc', NULL, false, '');
INSERT INTO public.daily_stones (id, user_id, date, title, role_id, completed, note) VALUES ('defbc7e8-47b9-40ff-95dd-7d3f339e93a2', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '2026-01-19', 'dfsf', NULL, false, '');
INSERT INTO public.daily_stones (id, user_id, date, title, role_id, completed, note) VALUES ('eabd465a-74a7-4af7-820c-1692d785d619', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '2026-01-20', 'Organizar todo', NULL, false, '');


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.goals (id, user_id, role_id, title, description, quarter, semester, target_date, status, created_at, updated_at) VALUES ('11542179-6cc1-4fcc-b1ed-47e1456cc493', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'f202534f-be1c-4fb4-9958-f8dc6edd73fa', 'Generar un ecosistema productivo que sustente los estudios y la estabilidad familiar para  julio de 2026.', NULL, 2, 1, NULL, 'pending', '2026-01-19 17:26:00.606666', '2026-01-19 17:26:00.606666');
INSERT INTO public.goals (id, user_id, role_id, title, description, quarter, semester, target_date, status, created_at, updated_at) VALUES ('160913db-b9fa-4dab-b582-f2bb82a52608', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '94500985-e554-4b9a-8bad-694722dec192', 'Completar todos los requisitos de cursada y prácticas para quedar a un paso de la Tesis para fines de diciembre 2026', NULL, 4, 2, NULL, 'pending', '2026-01-19 17:26:56.047591', '2026-01-19 17:26:56.047591');
INSERT INTO public.goals (id, user_id, role_id, title, description, quarter, semester, target_date, status, created_at, updated_at) VALUES ('c4a8c622-ec7e-4691-b8af-842ca9846d39', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '1aa4ec49-9396-482a-99a9-b4d04482b09a', 'Lograr al 100% las marcas que me proponga para fin de año 2026', NULL, 4, 2, NULL, 'pending', '2026-01-19 17:28:26.004133', '2026-01-19 17:28:26.004133');
INSERT INTO public.goals (id, user_id, role_id, title, description, quarter, semester, target_date, status, created_at, updated_at) VALUES ('7e471139-679d-4a10-8ed8-1cae5a7ade23', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '6a9825ae-0337-4594-ae82-af7e4ff71496', 'Finalizar el 100% de la Tecnicatura para julio de 2026.', NULL, 2, 1, NULL, 'pending', '2026-01-19 17:26:19.719371', '2026-01-20 09:51:20.139915');


--
-- Data for Name: deviations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: fitness_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fitness_activities (id, user_id, type, date, duration, calories, distance, notes, created_at) VALUES ('646e4e15-13e4-466f-beb4-2fb7d1acc23d', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'workout', '2026-01-18', 2, NULL, NULL, 'asdas', '2026-01-19 18:41:34.621682');
INSERT INTO public.fitness_activities (id, user_id, type, date, duration, calories, distance, notes, created_at) VALUES ('3202a5a5-b9c2-4e25-857f-f52e1d490e25', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'workout', '2026-01-18', 15, NULL, 2.5, 'Estructura: intervals
- 20x: 10/20 (trote/caminata)
-Vuelta con trote', '2026-01-19 21:27:50.740319');


--
-- Data for Name: fitness_routines; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fitness_routines (id, user_id, name, type, structure_type, content, created_at, rounds) VALUES ('1c1380bb-4e9e-46d5-b296-243d14673e18', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', 'INTERVALO AEROBICO (SEMANA 1)', 'cardio', 'intervals', '[{"rest": "20", "sets": "20", "work": "10", "exercise": "trote/caminata"}]', '2026-01-19 19:26:57.885124', NULL);


--
-- Data for Name: habits; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.habits (id, user_id, role_id, name, frequency, custom_days, created_at) VALUES ('8ccc1b2e-acb6-4d9a-801a-20d0189c9e91', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '1aa4ec49-9396-482a-99a9-b4d04482b09a', 'Realizar 3 actividades NEAT por día', 'daily', '{}', '2026-01-19 17:28:47.575473');
INSERT INTO public.habits (id, user_id, role_id, name, frequency, custom_days, created_at) VALUES ('e0ef7d86-531f-4e05-9d56-702e74c0cb76', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '1aa4ec49-9396-482a-99a9-b4d04482b09a', 'Entrenar 3 veces por semana', 'daily', '{}', '2026-01-19 17:29:07.208094');
INSERT INTO public.habits (id, user_id, role_id, name, frequency, custom_days, created_at) VALUES ('64101ec8-5ec1-4eed-82c4-e6a84a35ee88', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '6a9825ae-0337-4594-ae82-af7e4ff71496', 'Dedicarle 1hs por día a la creación del software', 'daily', '{}', '2026-01-19 17:30:13.580404');
INSERT INTO public.habits (id, user_id, role_id, name, frequency, custom_days, created_at) VALUES ('1a8893d5-8282-49b8-88ca-a6e11e73ba35', '29ef8642-b55f-4cab-ae38-a6d83dce29a9', '94500985-e554-4b9a-8bad-694722dec192', 'sdad', 'daily', '{}', '2026-01-19 17:51:04.081209');


--
-- Data for Name: habit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('f49b3410-bcbe-4a49-b8b8-7e9f3b2dfb78', '8ccc1b2e-acb6-4d9a-801a-20d0189c9e91', '2026-01-18', 'completed', '');
INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('c168853c-33b0-441c-900c-9592db5d043f', '64101ec8-5ec1-4eed-82c4-e6a84a35ee88', '2026-01-18', 'completed', '');
INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('d75dbb03-fd9d-476e-8396-8169eba64f2e', 'e0ef7d86-531f-4e05-9d56-702e74c0cb76', '2026-01-18', 'completed', '');
INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('1fe98320-9eea-4fb9-bd29-b1764d55c75e', '1a8893d5-8282-49b8-88ca-a6e11e73ba35', '2026-01-18', 'completed', '');
INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('86d85a77-f99d-45c1-857f-615df81cb7ef', '64101ec8-5ec1-4eed-82c4-e6a84a35ee88', '2026-01-19', 'day_off', '');
INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('2e8f97ae-a31c-423f-91c1-396480c2378c', 'e0ef7d86-531f-4e05-9d56-702e74c0cb76', '2026-01-19', 'day_off', '');
INSERT INTO public.habit_logs (id, habit_id, date, status, note) VALUES ('de14b04f-b359-4ea7-9330-b7dcf1c7ccac', '1a8893d5-8282-49b8-88ca-a6e11e73ba35', '2026-01-19', 'day_off', '');


--
-- Data for Name: note_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: note_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: note_tags_notes_note; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.projects (id, goal_id, name, description, due_date, statuses, created_at, updated_at) VALUES ('0ec25d0b-af3b-44cf-a02e-70224f16072b', 'c4a8c622-ec7e-4691-b8af-842ca9846d39', 'ghg', NULL, NULL, '{"Por hacer","En progreso","En revisión",Completada}', '2026-01-19 17:44:49.273772', '2026-01-19 17:44:49.273772');


--
-- Data for Name: project_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.project_activities (id, project_id, title, status, sort_order, due_date, role_id, created_at) VALUES ('60b848ff-3310-4495-9b95-078e6a384940', '0ec25d0b-af3b-44cf-a02e-70224f16072b', 'xcz', 'Por hacer', 0, NULL, NULL, '2026-01-19 17:44:56.19717');


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sub_goals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

\unrestrict K3MUv0CZfVBaBRa48bhBmCJ5pOVEYPIpeuAINy5hEwbS92n2WvqesaJKTdudR6z

