export enum SchoolType {
  PRIMARY = 'primary',
  HIGH = 'high'
}

export enum ShiftType {
  ONE = 'one',
  TWO = 'two'
}

export enum ScheduleType {
  SAME = 'same',
  DIFFERENT = 'different'
}

export interface Subject {
  id: string;
  name: string;
  weeklyHours: number;
  teacherId: string;
  classroomId?: string;
  category: 'natural' | 'social' | 'language' | 'art' | 'sport';
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
}

export interface Classroom {
  id: string;
  number: string;
  capacity?: number;
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  subjects: Subject[];
}

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  shiftType: ShiftType;
  scheduleType: ScheduleType;
  classes: Class[];
  teachers: Teacher[];
  classrooms: Classroom[];
}

export interface ScheduleEntry {
  id?: string; // Optional - from database
  day: number;
  hour: number;
  classId: string;
  subjectId: string;
  teacherId: string;
  classroomId?: string;
}

export interface Schedule {
  id: string;
  schoolId: string;
  entries: ScheduleEntry[];
}

export interface ScheduleView {
  type: 'classes' | 'teachers' | 'classrooms';
  schedule: Schedule;
}
