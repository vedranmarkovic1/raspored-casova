import React, { useState } from 'react';
import { School, Schedule, Class, Teacher, Classroom, Subject } from '../types';

interface ScheduleViewProps {
  school: School;
  schedule: Schedule;
  onBack: () => void;
  onNewSchedule: () => void;
}

const DAYS = ['Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак'];
const HOURS = Array.from({ length: 7 }, (_, i) => `${i + 1}. час`);

const getCategoryColor = (category: string) => {
  const colors = {
    'natural': 'bg-green-100 text-green-800 border-green-200',
    'social': 'bg-blue-100 text-blue-800 border-blue-200',
    'language': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'art': 'bg-purple-100 text-purple-800 border-purple-200',
    'sport': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const ScheduleViewComponent: React.FC<ScheduleViewProps> = ({ 
  school, 
  schedule, 
  onBack, 
  onNewSchedule 
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'teachers' | 'classrooms'>('classes');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);

  const findSubject = (subjectId: string): Subject | undefined => {
    for (const classInfo of school.classes) {
      const subject = classInfo.subjects.find(s => s.id === subjectId);
      if (subject) return subject;
    }
    return undefined;
  };

  const findTeacher = (teacherId: string): Teacher | undefined => {
    return school.teachers.find(t => t.id === teacherId);
  };

  const findClassroom = (classroomId: string): Classroom | undefined => {
    return school.classrooms.find(c => c.id === classroomId);
  };

  const getScheduleForClass = (classId: string) => {
    const scheduleGrid = Array(DAYS.length).fill(null).map(() => 
      Array(7).fill(null)
    );

    schedule.entries
      .filter(entry => entry.classId === classId)
      .forEach(entry => {
        scheduleGrid[entry.day][entry.hour] = entry;
      });

    return scheduleGrid;
  };

  const getScheduleForTeacher = (teacherId: string) => {
    const scheduleGrid = Array(DAYS.length).fill(null).map(() => 
      Array(7).fill(null)
    );

    schedule.entries
      .filter(entry => entry.teacherId === teacherId)
      .forEach(entry => {
        scheduleGrid[entry.day][entry.hour] = entry;
      });

    return scheduleGrid;
  };

  const getScheduleForClassroom = (classroomId: string) => {
    const scheduleGrid = Array(DAYS.length).fill(null).map(() => 
      Array(7).fill(null)
    );

    schedule.entries
      .filter(entry => entry.classroomId === classroomId)
      .forEach(entry => {
        scheduleGrid[entry.day][entry.hour] = entry;
      });

    return scheduleGrid;
  };

  const renderScheduleGrid = (grid: any[][], title: string) => {
    return (
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="min-w-full">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="w-32">Дан/Час</th>
                {HOURS.map((hour, index) => (
                  <th key={index} className="w-40 min-w-32">{hour}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <td className="font-medium bg-gray-50 w-32">{day}</td>
                  {grid[dayIndex].map((entry: any, hourIndex: number) => {
                    if (!entry) {
                      return <td key={hourIndex} className="bg-gray-50 w-40 min-w-32"></td>;
                    }

                    const subject = findSubject(entry.subjectId);
                    const classInfo = school.classes.find(c => c.id === entry.classId);
                    const teacher = findTeacher(entry.teacherId);
                    const classroom = entry.classroomId ? findClassroom(entry.classroomId) : null;

                    return (
                      <td 
                        key={hourIndex} 
                        className={`p-3 text-sm border w-40 min-w-32 ${getCategoryColor(subject?.category || '')}`}
                      >
                        <div className="font-semibold">{subject?.name}</div>
                        {activeTab === 'teachers' && classInfo && (
                          <div className="text-xs opacity-75">{classInfo.name}</div>
                        )}
                        {activeTab === 'classes' && teacher && (
                          <div className="text-xs opacity-75">{teacher.name}</div>
                        )}
                        {activeTab === 'classrooms' && classInfo && teacher && (
                          <>
                            <div className="text-xs opacity-75">{classInfo.name}</div>
                            <div className="text-xs opacity-75">{teacher.name}</div>
                          </>
                        )}
                        {classroom && (
                          <div className="text-xs opacity-75">{classroom.number}</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="school-card max-w-full mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Распоред часова - {school.name}</h2>
        <div className="flex gap-2">
          <button onClick={onBack} className="btn-secondary">
            Назад
          </button>
          <button onClick={onNewSchedule} className="btn-primary">
            Нови распоред
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'classes'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Одељења
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'teachers'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Наставници
        </button>
        <button
          onClick={() => setActiveTab('classrooms')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'classrooms'
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Кабинети
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'classes' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изаберите одељење
            </label>
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-input max-w-xs"
            >
              <option value="">Изаберите одељење</option>
              {school.classes.map(classInfo => (
                <option key={classInfo.id} value={classInfo.id}>
                  {classInfo.name}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div>
              {(() => {
                const classInfo = school.classes.find(c => c.id === selectedClass);
                const grid = getScheduleForClass(selectedClass);
                return renderScheduleGrid(grid, `Распоред за одељење ${classInfo?.name}`);
              })()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'teachers' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изаберите наставника
            </label>
            <select
              value={selectedTeacher || ''}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="form-input max-w-xs"
            >
              <option value="">Изаберите наставника</option>
              {school.teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTeacher && (
            <div>
              {(() => {
                const teacher = school.teachers.find(t => t.id === selectedTeacher);
                const grid = getScheduleForTeacher(selectedTeacher);
                return renderScheduleGrid(grid, `Распоред за наставника ${teacher?.name}`);
              })()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'classrooms' && (
        <div>
          {school.classrooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нема унетих кабинета
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изаберите кabinet
                </label>
                <select
                  value={selectedClassroom || ''}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="form-input max-w-xs"
                >
                  <option value="">Изаберите кabinet</option>
                  {school.classrooms.map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.number}
                    </option>
                  ))}
                </select>
              </div>

              {selectedClassroom && (
                <div>
                  {(() => {
                    const classroom = school.classrooms.find(c => c.id === selectedClassroom);
                    const grid = getScheduleForClassroom(selectedClassroom);
                    return renderScheduleGrid(grid, `Распоред за кabinet ${classroom?.number}`);
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
