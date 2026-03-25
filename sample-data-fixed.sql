-- Sample data for Шеста београдска гимназија

-- Insert school (only if it doesn't exist)
INSERT INTO "public"."schools" ("id", "name", "type", "shift_type", "schedule_type", "is_active", "created_at", "updated_at") 
VALUES ('a427359c-5b65-4596-906e-a0554d10521c', 'Шеста београдска гимназија', 'high', 'two', 'same', true, '2026-03-25 11:23:18.835606+00', '2026-03-25 11:23:18.835606+00')
ON CONFLICT (id) DO NOTHING;

-- Insert classes for high school (4 grades) - using proper UUIDs
INSERT INTO "public"."classes" ("id", "school_id", "name", "grade", "created_at", "updated_at") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-1', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-2', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-3', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'a427359c-5b65-4596-906e-a0554d10521c', 'I-4', 1, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-1', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-2', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-3', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'a427359c-5b65-4596-906e-a0554d10521c', 'II-4', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-1', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-2', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-3', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'a427359c-5b65-4596-906e-a0554d10521c', 'III-4', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-1', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-2', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-3', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440016', 'a427359c-5b65-4596-906e-a0554d10521c', 'IV-4', 4, NOW(), NOW());

-- Insert teachers - using proper UUIDs
INSERT INTO "public"."teachers" ("id", "school_id", "name", "created_at", "updated_at") VALUES
('660e8400-e29b-41d4-a716-446655440001', 'a427359c-5b65-4596-906e-a0554d10521c', 'Драган Петровић', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'a427359c-5b65-4596-906e-a0554d10521c', 'Марина Јовановић', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'a427359c-5b65-4596-906e-a0554d10521c', 'Никола Марковић', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'a427359c-5b65-4596-906e-a0554d10521c', 'Ана Симић', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'a427359c-5b65-4596-906e-a0554d10521c', 'Милош Тадић', NOW(), NOW());

-- Insert classrooms - using proper UUIDs
INSERT INTO "public"."classrooms" ("id", "school_id", "number", "capacity", "created_at", "updated_at") VALUES
('770e8400-e29b-41d4-a716-446655440001', 'a427359c-5b65-4596-906e-a0554d10521c', '101', 30, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'a427359c-5b65-4596-906e-a0554d10521c', '102', 30, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003', 'a427359c-5b65-4596-906e-a0554d10521c', '103', 30, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440004', 'a427359c-5b65-4596-906e-a0554d10521c', '104', 30, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440005', 'a427359c-5b65-4596-906e-a0554d10521c', '105', 30, NOW(), NOW());

-- Insert subjects for first class only (for testing)
INSERT INTO "public"."subjects" ("id", "class_id", "teacher_id", "classroom_id", "name", "weekly_hours", "category", "created_at", "updated_at") VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Српски језик', 4, 'language', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Математика', 4, 'natural', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'Физика', 2, 'natural', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'Хемија', 2, 'natural', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440004', 'Биологија', 2, 'natural', NOW(), NOW());

-- Create user for the school (only if it doesn't exist)
INSERT INTO "public"."users" ("id", "username", "password_hash", "role", "school_id", "is_active", "created_at", "updated_at")
VALUES ('990e8400-e29b-41d4-a716-446655440001', 'sesta.gimnazija', crypt('sesta123', gen_salt('bf')), 'school', 'a427359c-5b65-4596-906e-a0554d10521c', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;
