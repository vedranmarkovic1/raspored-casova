import { School, Schedule, ScheduleEntry, Subject, Class } from '../types';

const DAYS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak'];
const MAX_HOURS_PER_DAY = 7;

interface ScheduleConstraints {
  maxHoursPerDay: number;
  maxSameCategoryPerDay: number;
  teacherAvailability: Map<string, boolean[][]>;
}

export class ScheduleGenerator {
  private school: School;
  private constraints: ScheduleConstraints;

  constructor(school: School) {
    this.school = school;
    this.constraints = {
      maxHoursPerDay: MAX_HOURS_PER_DAY,
      maxSameCategoryPerDay: 3,
      teacherAvailability: this.initializeTeacherAvailability()
    };
  }

  private initializeTeacherAvailability(): Map<string, boolean[][]> {
    const availability = new Map<string, boolean[][]>();
    
    this.school.teachers.forEach(teacher => {
      const teacherSchedule = Array(DAYS.length).fill(null).map(() => 
        Array(MAX_HOURS_PER_DAY).fill(true)
      );
      availability.set(teacher.id, teacherSchedule);
    });

    return availability;
  }

  public generateSchedule(): Schedule {
    const entries: ScheduleEntry[] = [];
    const classSchedules = new Map<string, ScheduleEntry[][]>();

    // Initialize schedules for each class
    this.school.classes.forEach(classInfo => {
      classSchedules.set(classInfo.id, Array(DAYS.length).fill(null).map(() => 
        Array(MAX_HOURS_PER_DAY).fill(null)
      ));
    });

    // Generate schedule for each class
    this.school.classes.forEach(classInfo => {
      this.generateClassSchedule(classInfo, classSchedules.get(classInfo.id)!);
    });

    // Collect all entries
    classSchedules.forEach((schedule, classId) => {
      schedule.forEach((day, dayIndex) => {
        day.forEach((entry, hourIndex) => {
          if (entry) {
            entries.push(entry);
          }
        });
      });
    });

    return {
      id: `schedule_${Date.now()}`,
      schoolId: this.school.id,
      entries
    };
  }

  private generateClassSchedule(classInfo: Class, schedule: ScheduleEntry[][]): void {
    const subjects = [...classInfo.subjects];
    const subjectQueue = this.createSubjectQueue(subjects);

    // Sort subjects by priority (natural sciences first, then social, etc.)
    subjectQueue.sort((a, b) => {
      const priorityOrder = { 'natural': 0, 'social': 1, 'language': 2, 'art': 3, 'sport': 4 };
      return priorityOrder[a.category] - priorityOrder[b.category];
    });

    for (const subject of subjectQueue) {
      this.placeSubjectInSchedule(subject, classInfo, schedule);
    }
  }

  private createSubjectQueue(subjects: Subject[]): Subject[] {
    const queue: Subject[] = [];
    
    subjects.forEach(subject => {
      for (let i = 0; i < subject.weeklyHours; i++) {
        queue.push({ ...subject });
      }
    });

    return queue;
  }

  private placeSubjectInSchedule(subject: Subject, classInfo: Class, schedule: ScheduleEntry[][]): void {
    const possibleSlots: { day: number; hour: number; score: number }[] = [];

    // Find all possible slots
    for (let day = 0; day < DAYS.length; day++) {
      for (let hour = 0; hour < MAX_HOURS_PER_DAY; hour++) {
        if (this.canPlaceSubject(subject, classInfo.id, day, hour, schedule)) {
          const score = this.calculateSlotScore(subject, classInfo.id, day, hour, schedule);
          possibleSlots.push({ day, hour, score });
        }
      }
    }

    // Sort by score (lower is better)
    possibleSlots.sort((a, b) => a.score - b.score);

    // Place in the best available slot
    if (possibleSlots.length > 0) {
      const bestSlot = possibleSlots[0];
      schedule[bestSlot.day][bestSlot.hour] = {
        day: bestSlot.day,
        hour: bestSlot.hour,
        classId: classInfo.id,
        subjectId: subject.id,
        teacherId: subject.teacherId,
        classroomId: subject.classroomId
      };
    }
  }

  private canPlaceSubject(subject: Subject, classId: string, day: number, hour: number, schedule: ScheduleEntry[][]): boolean {
    // Check if slot is empty
    if (schedule[day][hour] !== null) {
      return false;
    }

    // Check teacher availability
    const teacherAvailability = this.constraints.teacherAvailability.get(subject.teacherId);
    if (!teacherAvailability || !teacherAvailability[day][hour]) {
      return false;
    }

    // Check if teacher already has this class at this time
    const teacherEntries = this.school.classes.flatMap(c => 
      schedule.flatMap(d => d.filter(e => e?.teacherId === subject.teacherId))
    );
    const hasConflict = teacherEntries.some(entry => 
      entry && entry.day === day && entry.hour === hour
    );
    if (hasConflict) {
      return false;
    }

    // Check category constraints
    const dayEntries = schedule[day].filter(e => e !== null);
    const sameCategoryCount = dayEntries.filter(e => {
      const eSubject = this.findSubject(e!.subjectId);
      return eSubject?.category === subject.category;
    }).length;

    if (sameCategoryCount >= this.constraints.maxSameCategoryPerDay) {
      return false;
    }

    return true;
  }

  private calculateSlotScore(subject: Subject, classId: string, day: number, hour: number, schedule: ScheduleEntry[][]): number {
    let score = 0;

    // Prefer earlier hours for difficult subjects
    if (subject.category === 'natural' || subject.category === 'social') {
      score += hour * 2;
    } else {
      score += hour;
    }

    // Prefer balanced distribution across days
    const dayEntries = schedule[day].filter(e => e !== null).length;
    score += dayEntries * 3;

    // Avoid gaps in schedule
    if (hour > 0 && schedule[day][hour - 1] === null) {
      score += 5;
    }
    if (hour < MAX_HOURS_PER_DAY - 1 && schedule[day][hour + 1] === null) {
      score += 5;
    }

    return score;
  }

  private findSubject(subjectId: string): Subject | undefined {
    for (const classInfo of this.school.classes) {
      const subject = classInfo.subjects.find(s => s.id === subjectId);
      if (subject) return subject;
    }
    return undefined;
  }
}
