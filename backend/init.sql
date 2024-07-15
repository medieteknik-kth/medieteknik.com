INSERT INTO student (email, first_name, last_name, reception_name, profile_picture_url, reception_profile_picture_url, student_type, password_hash)
VALUES ('username@kth.se', 'Admin', 'Admin', null, null, null, 'MEDIETEKNIK', '');

INSERT INTO language (language_code, language_name)
VALUES ('sv-SE', 'Swedish'), ('en-GB', 'English');

INSERT INTO committee_category 
(email)
VALUES
('styrelsen@medieteknik.com'),
(null),
(null),
(null);

INSERT INTO committee
(email, logo_url, committee_category_id)
VALUES
('styrelsen@medieteknik.com', null, 1),
('val@medieteknik.com', null, 1),
('studienämnden@medieteknik.com', null, 2),
('internationella@medieteknik.com', null, 2),
('nlg@medieteknik.com', null, 3),
('kommunikator@medieteknik.com', null, 3),
('branschdag@medieteknik.com', null, 3),
('qulturnamnden@medieteknik.com', null, 4),
('metadorerna@medieteknik.com', null, 4),
('metaspexet@medieteknik.com', null, 4),
('spexmasteriet@medieteknik.com', null, 4),
('festmasteriet@medieteknik.com', null, 4),
('kbm@medieteknik.com', null, 4),
('idrottsnamnden@medieteknik.com', null, 4),
('masterkock@medieteknik.com', null, 4),
('sanglederiet@medieteknik.com', null, 4),
('filmnamnden@medieteknik.com', null, 4);

INSERT INTO author (author_type, entity_id, resources)
VALUES
('STUDENT', 1,    ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 1,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 2,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 3,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 4,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 5,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 6,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 7,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 8,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 9,  ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 10, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 11, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 12, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 13, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 14, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 15, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 16, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']),
('COMMITTEE', 17, ARRAY['NEWS', 'EVENT', 'DOCUMENT', 'ALBUM']);

INSERT INTO resource (route, is_public)
VALUES
('chapter', true);

INSERT INTO committee_translation (committee_id, title, description, language_code)
VALUES 
(1, 'Styrelsen', 'Temporary Description', 'sv-SE'),
(2, 'Valberedningen', 'Temporary Description', 'sv-SE'),
(3, 'Studienämnden', 'Temporary Description', 'sv-SE'),
(4, 'Internationella', 'Temporary Description', 'sv-SE'),
(5, 'Näringslivsgruppen', 'Temporary Description', 'sv-SE'),
(6, 'Kommunikationsnämnden', 'Temporary Description', 'sv-SE'),
(7, 'Medias Branchdag', 'Temporary Description', 'sv-SE'),
(8, 'Qulturnämnden', 'Temporary Description', 'sv-SE'),
(9, 'METAdorerna', 'Temporary Description', 'sv-SE'),
(10, 'METAspexet', 'Temporary Description', 'sv-SE'),
(11, 'Spexmästeriet', 'Temporary Description', 'sv-SE'),
(12, 'Festmästeriet', 'Temporary Description', 'sv-SE'),
(13, 'Medias Klubbmästeri', 'Temporary Description', 'sv-SE'),
(14, 'Idrottsnämnden', 'Temporary Description', 'sv-SE'),
(15, 'Matlaget', 'Temporary Description', 'sv-SE'),
(16, 'Sånglederiet', 'Temporary Description', 'sv-SE'),
(17, 'Filmnämnden', 'Temporary Description', 'sv-SE');

INSERT INTO committee_category_translation (committee_category_id, title, language_code)
VALUES 
(1, 'Administrative', 'sv-SE'),
(2, 'Utbildning', 'sv-SE'),
(3, 'Näringsliv och Kommunikation', 'sv-SE'),
(4, 'Studiesocialt', 'sv-SE'),
(1, 'Administrative', 'en-GB'),
(2, 'Education', 'en-GB'),
(3, 'Business and Communcation', 'en-GB'),
(4, 'Social Studies', 'en-GB');

INSERT INTO student_permission (student_id, role, permissions)
VALUES
(1, 'ADMIN', ARRAY['STUDENT_EDIT_PERMISSIONS', 'STUDENT_ADD', 'STUDENT_DELETE', 'STUDENT_EDIT', 'STUDENT_VIEW', 'COMMITTEE_EDIT_PERMISSIONS', 'COMMITTEE_ADD', 'COMMITTEE_DELETE', 'COMMITTEE_EDIT', 'COMMITTEE_ADD_MEMBER', 'COMMITTEE_REMOVE_MEMBER', 'COMMITTEE_EDIT_MEMBER', 'COMMITTEE_POSITION_EDIT_PERMISSIONS', 'COMMITTEE_POSITION_ADD', 'COMMITTEE_POSITION_DELETE', 'COMMITTEE_POSITION_EDIT', 'ITEMS_EDIT', 'ITEMS_VIEW', 'ITEMS_DELETE', 'CALENDAR_PRIVATE' , 'CALENDAR_CREATE', 'CALENDAR_DELETE', 'CALENDAR_EDIT']);
