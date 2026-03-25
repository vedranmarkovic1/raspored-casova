-- Sample data for Шеста београдска гимназија

-- Insert school (only if it doesn't exist)
INSERT INTO "public"."schools" ("id", "name", "type", "shift_type", "schedule_type", "is_active", "created_at", "updated_at") 
VALUES ('a427359c-5b65-4596-906e-a0554d10521c', 'Шеста београдска гимназија', 'high', 'two', 'same', true, '2026-03-25 11:23:18.835606+00', '2026-03-25 11:23:18.835606+00')
ON CONFLICT (id) DO NOTHING;

-- Insert classes for high school (4 grades)
INSERT INTO "public"."classes" ("id", "school_id", "name", "grade", "created_at", "updated_at") VALUES
('class-1-1', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-1', 1, NOW(), NOW()),
('class-1-2', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-2', 1, NOW(), NOW()),
('class-1-3', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-3', 1, NOW(), NOW()),
('class-1-4', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-4', 1, NOW(), NOW()),
('class-2-1', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-1', 2, NOW(), NOW()),
('class-2-2', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-2', 2, NOW(), NOW()),
('class-2-3', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-3', 2, NOW(), NOW()),
('class-2-4', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-4', 2, NOW(), NOW()),
('class-3-1', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-1', 3, NOW(), NOW()),
('class-3-2', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-2', 3, NOW(), NOW()),
('class-3-3', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-3', 3, NOW(), NOW()),
('class-3-4', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-4', 3, NOW(), NOW()),
('class-4-1', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-1', 4, NOW(), NOW()),
('class-4-2', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-2', 4, NOW(), NOW()),
('class-4-3', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-3', 4, NOW(), NOW()),
('class-4-4', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-4', 4, NOW(), NOW());

-- Insert teachers
INSERT INTO "public"."teachers" ("id", "school_id", "name", "created_at", "updated_at") VALUES
('teacher-1', 'a427359c-5b65-4596-906e-a0554d10521c', 'Драган Петровић', NOW(), NOW()),
('teacher-2', 'a427359c-5b65-4596-906e-a0554d10521c', 'Марина Јовановић', NOW(), NOW()),
('teacher-3', 'a427359c-5b65-4596-906e-a0554d10521c', 'Никола Марковић', NOW(), NOW()),
('teacher-4', 'a427359c-5b65-4596-906e-a0554d10521c', 'Ана Симић', NOW(), NOW()),
('teacher-5', 'a427359c-5b65-4596-906e-a0554d10521c', 'Милош Тадић', NOW(), NOW()),
('teacher-6', 'a427359c-5b65-4596-906e-a0554d10521c', 'Јелена Станковић', NOW(), NOW()),
('teacher-7', 'a427359c-5b65-4596-906e-a0554d10521c', 'Иван Ђорђевић', NOW(), NOW()),
('teacher-8', 'a427359c-5b65-4596-906e-a0554d10521c', 'Снежана Николић', NOW(), NOW()),
('teacher-9', 'a427359c-5b65-4596-906e-a0554d10521c', 'Горан Радовановић', NOW(), NOW()),
('teacher-10', 'a427359c-5b65-4596-906e-a0554d10521c', 'Маја Пантић', NOW(), NOW()),
('teacher-11', 'a427359c-5b65-4596-906e-a0554d10521c', 'Дејан Антић', NOW(), NOW()),
('teacher-12', 'a427359c-5b65-4596-906e-a0554d10521c', 'Тамара Васић', NOW(), NOW()),
('teacher-13', 'a427359c-5b65-4596-906e-a0554d10521c', 'Бобан Стевановић', NOW(), NOW()),
('teacher-14', 'a427359c-5b65-4596-906e-a0554d10521c', 'Ивана Милић', NOW(), NOW()),
('teacher-15', 'a427359c-5b65-4596-906e-a0554d10521c', 'Зоран Јокић', NOW(), NOW());

-- Insert classrooms
INSERT INTO "public"."classrooms" ("id", "school_id", "number", "capacity", "created_at", "updated_at") VALUES
('classroom-1', 'a427359c-5b65-4596-906e-a0554d10521c', '101', 30, NOW(), NOW()),
('classroom-2', 'a427359c-5b65-4596-906e-a0554d10521c', '102', 30, NOW(), NOW()),
('classroom-3', 'a427359c-5b65-4596-906e-a0554d10521c', '103', 30, NOW(), NOW()),
('classroom-4', 'a427359c-5b65-4596-906e-a0554d10521c', '104', 30, NOW(), NOW()),
('classroom-5', 'a427359c-5b65-4596-906e-a0554d10521c', '105', 30, NOW(), NOW()),
('classroom-6', 'a427359c-5b65-4596-906e-a0554d10521c', '106', 30, NOW(), NOW()),
('classroom-7', 'a427359c-5b65-4596-906e-a0554d10521c', '107', 30, NOW(), NOW()),
('classroom-8', 'a427359c-5b65-4596-906e-a0554d10521c', '108', 30, NOW(), NOW()),
('classroom-9', 'a427359c-5b65-4596-906e-a0554d10521c', '109', 30, NOW(), NOW()),
('classroom-10', 'a427359c-5b65-4596-906e-a0554d10521c', '110', 30, NOW(), NOW()),
('classroom-11', 'a427359c-5b65-4596-906e-a0554d10521c', '201', 30, NOW(), NOW()),
('classroom-12', 'a427359c-5b65-4596-906e-a0554d10521c', '202', 30, NOW(), NOW()),
('classroom-13', 'a427359c-5b65-4596-906e-a0554d10521c', '203', 30, NOW(), NOW()),
('classroom-14', 'a427359c-5b65-4596-906e-a0554d10521c', '204', 30, NOW(), NOW()),
('classroom-15', 'a427359c-5b65-4596-906e-a0554d10521c', '205', 30, NOW(), NOW()),
('classroom-16', 'a427359c-5b65-4596-906e-a0554d10521c', '206', 30, NOW(), NOW()),
('classroom-17', 'a427359c-5b65-4596-906e-a0554d10521c', '207', 30, NOW(), NOW()),
('classroom-18', 'a427359c-5b65-4596-906e-a0554d10521c', '208', 30, NOW(), NOW()),
('classroom-19', 'a427359c-5b65-4596-906e-a0554d10521c', '209', 30, NOW(), NOW()),
('classroom-20', 'a427359c-5b65-4596-906e-a0554d10521c', '210', 30, NOW(), NOW());

-- Insert subjects for all classes
INSERT INTO "public"."subjects" ("id", "class_id", "teacher_id", "classroom_id", "name", "weekly_hours", "category", "created_at", "updated_at") VALUES
-- I razred
('subj-1-1-1', 'class-1-1', 'teacher-1', 'classroom-1', 'Српски језик', 4, 'language', NOW(), NOW()),
('subj-1-1-2', 'class-1-1', 'teacher-2', 'classroom-1', 'Математика', 4, 'natural', NOW(), NOW()),
('subj-1-1-3', 'class-1-1', 'teacher-3', 'classroom-2', 'Физика', 2, 'natural', NOW(), NOW()),
('subj-1-1-4', 'class-1-1', 'teacher-4', 'classroom-3', 'Хемија', 2, 'natural', NOW(), NOW()),
('subj-1-1-5', 'class-1-1', 'teacher-5', 'classroom-4', 'Биологија', 2, 'natural', NOW(), NOW()),
('subj-1-1-6', 'class-1-1', 'teacher-6', 'classroom-5', 'Историја', 2, 'social', NOW(), NOW()),
('subj-1-1-7', 'class-1-1', 'teacher-7', 'classroom-6', 'Географија', 2, 'social', NOW(), NOW()),
('subj-1-1-8', 'class-1-1', 'teacher-8', 'classroom-7', 'Енглески језик', 3, 'language', NOW(), NOW()),
('subj-1-1-9', 'class-1-1', 'teacher-9', 'classroom-8', 'Физичко', 2, 'sport', NOW(), NOW()),
('subj-1-1-10', 'class-1-1', 'teacher-10', 'classroom-9', 'Музичко', 1, 'art', NOW(), NOW()),

('subj-1-2-1', 'class-1-2', 'teacher-1', 'classroom-2', 'Српски језик', 4, 'language', NOW(), NOW()),
('subj-1-2-2', 'class-1-2', 'teacher-2', 'classroom-2', 'Математика', 4, 'natural', NOW(), NOW()),
('subj-1-2-3', 'class-1-2', 'teacher-3', 'classroom-3', 'Физика', 2, 'natural', NOW(), NOW()),
('subj-1-2-4', 'class-1-2', 'teacher-4', 'classroom-4', 'Хемија', 2, 'natural', NOW(), NOW()),
('subj-1-2-5', 'class-1-2', 'teacher-5', 'classroom-5', 'Биологија', 2, 'natural', NOW(), NOW()),
('subj-1-2-6', 'class-1-2', 'teacher-6', 'classroom-6', 'Историја', 2, 'social', NOW(), NOW()),
('subj-1-2-7', 'class-1-2', 'teacher-7', 'classroom-7', 'Географија', 2, 'social', NOW(), NOW()),
('subj-1-2-8', 'class-1-2', 'teacher-8', 'classroom-8', 'Енглески језик', 3, 'language', NOW(), NOW()),
('subj-1-2-9', 'class-1-2', 'teacher-9', 'classroom-9', 'Физичко', 2, 'sport', NOW(), NOW()),
('subj-1-2-10', 'class-1-2', 'teacher-10', 'classroom-10', 'Музичко', 1, 'art', NOW(), NOW()),

-- II razred
('subj-2-1-1', 'class-2-1', 'teacher-11', 'classroom-11', 'Српски језик', 4, 'language', NOW(), NOW()),
('subj-2-1-2', 'class-2-1', 'teacher-12', 'classroom-11', 'Математика', 4, 'natural', NOW(), NOW()),
('subj-2-1-3', 'class-2-1', 'teacher-13', 'classroom-12', 'Физика', 3, 'natural', NOW(), NOW()),
('subj-2-1-4', 'class-2-1', 'teacher-14', 'classroom-13', 'Хемија', 2, 'natural', NOW(), NOW()),
('subj-2-1-5', 'class-2-1', 'teacher-15', 'classroom-14', 'Биологија', 2, 'natural', NOW(), NOW()),
('subj-2-1-6', 'class-2-1', 'teacher-1', 'classroom-15', 'Историја', 2, 'social', NOW(), NOW()),
('subj-2-1-7', 'class-2-1', 'teacher-2', 'classroom-16', 'Географија', 2, 'social', NOW(), NOW()),
('subj-2-1-8', 'class-2-1', 'teacher-3', 'classroom-17', 'Енглески језик', 3, 'language', NOW(), NOW()),
('subj-2-1-9', 'class-2-1', 'teacher-4', 'classroom-18', 'Физичко', 2, 'sport', NOW(), NOW()),
('subj-2-1-10', 'class-2-1', 'teacher-5', 'classroom-19', 'Музичко', 1, 'art', NOW(), NOW()),

-- III razred
('subj-3-1-1', 'class-3-1', 'teacher-6', 'classroom-1', 'Српски језик', 4, 'language', NOW(), NOW()),
('subj-3-1-2', 'class-3-1', 'teacher-7', 'classroom-1', 'Математика', 4, 'natural', NOW(), NOW()),
('subj-3-1-3', 'class-3-1', 'teacher-8', 'classroom-2', 'Физика', 3, 'natural', NOW(), NOW()),
('subj-3-1-4', 'class-3-1', 'teacher-9', 'classroom-3', 'Хемија', 2, 'natural', NOW(), NOW()),
('subj-3-1-5', 'class-3-1', 'teacher-10', 'classroom-4', 'Биологија', 2, 'natural', NOW(), NOW()),
('subj-3-1-6', 'class-3-1', 'teacher-11', 'classroom-5', 'Историја', 2, 'social', NOW(), NOW()),
('subj-3-1-7', 'class-3-1', 'teacher-12', 'classroom-6', 'Географија', 2, 'social', NOW(), NOW()),
('subj-3-1-8', 'class-3-1', 'teacher-13', 'classroom-7', 'Енглески језик', 3, 'language', NOW(), NOW()),
('subj-3-1-9', 'class-3-1', 'teacher-14', 'classroom-8', 'Физичко', 2, 'sport', NOW(), NOW()),
('subj-3-1-10', 'class-3-1', 'teacher-15', 'classroom-9', 'Музичко', 1, 'art', NOW(), NOW()),

-- IV razred
('subj-4-1-1', 'class-4-1', 'teacher-1', 'classroom-10', 'Српски језик', 4, 'language', NOW(), NOW()),
('subj-4-1-2', 'class-4-1', 'teacher-2', 'classroom-10', 'Математика', 4, 'natural', NOW(), NOW()),
('subj-4-1-3', 'class-4-1', 'teacher-3', 'classroom-11', 'Физика', 3, 'natural', NOW(), NOW()),
('subj-4-1-4', 'class-4-1', 'teacher-4', 'classroom-12', 'Хемија', 2, 'natural', NOW(), NOW()),
('subj-4-1-5', 'class-4-1', 'teacher-5', 'classroom-13', 'Биологија', 2, 'natural', NOW(), NOW()),
('subj-4-1-6', 'class-4-1', 'teacher-6', 'classroom-14', 'Историја', 2, 'social', NOW(), NOW()),
('subj-4-1-7', 'class-4-1', 'teacher-7', 'classroom-15', 'Географија', 2, 'social', NOW(), NOW()),
('subj-4-1-8', 'class-4-1', 'teacher-8', 'classroom-16', 'Енглески језик', 3, 'language', NOW(), NOW()),
('subj-4-1-9', 'class-4-1', 'teacher-9', 'classroom-17', 'Физичко', 2, 'sport', NOW(), NOW()),
('subj-4-1-10', 'class-4-1', 'teacher-10', 'classroom-18', 'Музичко', 1, 'art', NOW(), NOW());

-- Create user for the school (only if it doesn't exist)
INSERT INTO "public"."users" ("id", "username", "password_hash", "role", "school_id", "is_active", "created_at", "updated_at")
VALUES ('user-sesta-gimnazija', 'sesta.gimnazija', crypt('sesta123', gen_salt('bf')), 'school', 'a427359c-5b65-4596-906e-a0554d10521c', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
