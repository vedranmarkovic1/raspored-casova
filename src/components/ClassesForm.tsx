import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Class, Subject, Teacher, Classroom } from '../types';

interface ClassesFormProps {
  schoolType: 'primary' | 'high';
  onSubmit: (data: { classes: Class[]; teachers: Teacher[]; classrooms: Classroom[] }) => void;
  onBack: () => void;
}

export const ClassesForm: React.FC<ClassesFormProps> = ({ schoolType, onSubmit, onBack }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [currentClass, setCurrentClass] = useState('');
  const [currentGrade, setCurrentGrade] = useState(1);

  const [currentSubject, setCurrentSubject] = useState('');
  const [currentSubjectHours, setCurrentSubjectHours] = useState(1);
  const [currentSubjectCategory, setCurrentSubjectCategory] = useState<'natural' | 'social' | 'language' | 'art' | 'sport'>('natural');
  const [currentTeacher, setCurrentTeacher] = useState('');
  const [currentClassroom, setCurrentClassroom] = useState('');

  const [currentTeacherName, setCurrentTeacherName] = useState('');
  const [currentClassroomNumber, setCurrentClassroomNumber] = useState('');

  const addClass = () => {
    if (!currentClass.trim()) {
      alert('Молимо унесите назив одељења');
      return;
    }

    const newClass: Class = {
      id: `class_${Date.now()}`,
      name: currentClass,
      grade: currentGrade,
      subjects: []
    };

    setClasses([...classes, newClass]);
    setCurrentClass('');
    setCurrentGrade(1);
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const addSubjectToClass = (classId: string) => {
    if (!currentSubject.trim() || !currentTeacher.trim()) {
      alert('Молимо унесите предмет и наставника');
      return;
    }

    // Add teacher if not exists
    let teacher = teachers.find(t => t.name === currentTeacher);
    if (!teacher) {
      teacher = {
        id: `teacher_${Date.now()}`,
        name: currentTeacher,
        subjects: [currentSubject]
      };
      setTeachers([...teachers, teacher]);
    } else if (!teacher.subjects.includes(currentSubject)) {
      teacher.subjects.push(currentSubject);
    }

    // Add classroom if provided
    let classroomId: string | undefined;
    if (currentClassroom.trim()) {
      let classroom = classrooms.find(c => c.number === currentClassroom);
      if (!classroom) {
        classroom = {
          id: `classroom_${Date.now()}`,
          number: currentClassroom
        };
        setClassrooms([...classrooms, classroom]);
      }
      classroomId = classroom.id;
    }

    const newSubject: Subject = {
      id: `subject_${Date.now()}`,
      name: currentSubject,
      weeklyHours: currentSubjectHours,
      teacherId: teacher.id,
      classroomId,
      category: currentSubjectCategory
    };

    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, subjects: [...c.subjects, newSubject] }
        : c
    ));

    setCurrentSubject('');
    setCurrentSubjectHours(1);
    setCurrentSubjectCategory('natural');
    setCurrentTeacher('');
    setCurrentClassroom('');
  };

  const removeSubjectFromClass = (classId: string, subjectId: string) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, subjects: c.subjects.filter(s => s.id !== subjectId) }
        : c
    ));
  };

  const handleSubmit = () => {
    if (classes.length === 0) {
      alert('Молимо додајте барем једно одељење');
      return;
    }

    const hasEmptySubjects = classes.some(c => c.subjects.length === 0);
    if (hasEmptySubjects) {
      alert('Сва одељења морају имати барем један предмет');
      return;
    }

    onSubmit({ classes, teachers, classrooms });
  };

  const maxGrade = schoolType === 'primary' ? 8 : 4;

  return (
    <div className="school-card max-w-full mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Одељења и предмети</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Add Class Section */}
        <div className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Додај одељење</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назив одељења
              </label>
              <input
                type="text"
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value)}
                className="form-input"
                placeholder="нпр. 5-1, III-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Разред
              </label>
              <select
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="form-input"
              >
                {Array.from({ length: maxGrade }, (_, i) => i + 1).map(grade => (
                  <option key={grade} value={grade}>{grade}. разред</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={addClass}
            className="btn-primary w-full md:w-auto px-8 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Додај одељење
          </button>
        </div>

        {/* Summary Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Преглед</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">Одељења ({classes.length})</h4>
              <div className="mt-2 space-y-1 text-sm text-blue-800 max-h-32 overflow-y-auto">
                {classes.map(classInfo => (
                  <div key={classInfo.id}>
                    {classInfo.name} - {classInfo.subjects.length} предмета
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Наставници ({teachers.length})</h4>
              <div className="mt-2 space-y-1 text-sm text-green-800 max-h-32 overflow-y-auto">
                {teachers.map(teacher => (
                  <div key={teacher.id}>
                    {teacher.name} - {teacher.subjects.join(', ')}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900">Кабинети ({classrooms.length})</h4>
              <div className="mt-2 space-y-1 text-sm text-purple-800 max-h-32 overflow-y-auto">
                {classrooms.map(classroom => (
                  <div key={classroom.id}>
                    {classroom.number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes List Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Одељења и предмети</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map(classInfo => (
            <div key={classInfo.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">{classInfo.name} ({classInfo.grade}. разред)</span>
                <button
                  onClick={() => removeClass(classInfo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              {/* Add Subject to Class */}
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="form-input text-sm"
                  placeholder="Предмет"
                />
                
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={currentSubjectHours}
                    onChange={(e) => setCurrentSubjectHours(Number(e.target.value))}
                    className="form-input text-sm flex-1"
                    placeholder="Часова недељно"
                  />
                  
                  <select
                    value={currentSubjectCategory}
                    onChange={(e) => setCurrentSubjectCategory(e.target.value as any)}
                    className="form-input text-sm flex-1"
                  >
                    <option value="natural">Природни</option>
                    <option value="social">Друштвени</option>
                    <option value="language">Језици</option>
                    <option value="art">Уметност</option>
                    <option value="sport">Спорт</option>
                  </select>
                </div>
                
                <input
                  type="text"
                  value={currentTeacher}
                  onChange={(e) => setCurrentTeacher(e.target.value)}
                  className="form-input text-sm"
                  placeholder="Наставник"
                />
                
                <input
                  type="text"
                  value={currentClassroom}
                  onChange={(e) => setCurrentClassroom(e.target.value)}
                  className="form-input text-sm"
                  placeholder="Кабинет (опционо)"
                />
                
                <button
                  onClick={() => addSubjectToClass(classInfo.id)}
                  className="btn-secondary w-full text-sm"
                >
                  Додај предмет
                </button>
              </div>

              {/* Subjects List */}
              <div className="space-y-1">
                {classInfo.subjects.map(subject => {
                  const teacher = teachers.find(t => t.id === subject.teacherId);
                  const classroom = classrooms.find(c => c.id === subject.classroomId);
                  
                  return (
                    <div key={subject.id} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                      <span>
                        {subject.name} ({subject.weeklyHours}h) - {teacher?.name}
                        {classroom && ` - ${classroom.number}`}
                      </span>
                      <button
                        onClick={() => removeSubjectFromClass(classInfo.id, subject.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="btn-secondary flex-1"
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary flex-1"
        >
          Генериши распоред
        </button>
      </div>
    </div>
  );
};
