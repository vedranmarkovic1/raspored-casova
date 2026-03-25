import React, { useState, useEffect } from 'react';
import { SchoolForm } from './components/SchoolForm';
import { ClassesForm } from './components/ClassesForm';
import { ScheduleViewComponent } from './components/ScheduleView';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { PublicHomePage } from './components/PublicHomePage';
import { Header } from './components/Header';
import { authService } from './services/authService';
import { scheduleService } from './services/scheduleService';
import { schoolService } from './services/schoolService';
import { School, SchoolType, ShiftType, ScheduleType, Class, Teacher, Classroom, Schedule } from './types';

type Step = 'public' | 'school-info' | 'classes-subjects' | 'schedule-view' | 'coordinator';

interface SchoolBasicInfo {
  name: string;
  type: SchoolType;
  shiftType: ShiftType;
  scheduleType: ScheduleType;
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('public');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [schoolInfo, setSchoolInfo] = useState<SchoolBasicInfo | null>(null);
  const [schoolData, setSchoolData] = useState<{
    classes: Class[];
    teachers: Teacher[];
    classrooms: Classroom[];
  } | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role === 'coordinator') {
        setCurrentStep('coordinator');
      } else {
        setCurrentStep('school-info');
      }
    }
  }, []);

  const handleLogin = async (user: any) => {
    setCurrentUser(user);
    if (user.role === 'coordinator') {
      setCurrentStep('coordinator');
    } else if (user.role === 'school' && user.school_id) {
      // For school users, load their schedule directly
      try {
        // Get school info
        const schoolData = await schoolService.getById(user.school_id);
        if (schoolData) {
          // Load school data with relations
          const fullSchoolData = await schoolService.getWithRelations(user.school_id);
          
          if (fullSchoolData) {
            // Group subjects by class_id
            const subjectsByClass: { [key: string]: any[] } = {};
            if (fullSchoolData.subjects) {
              fullSchoolData.subjects.forEach((subject: any) => {
                if (!subjectsByClass[subject.class_id]) {
                  subjectsByClass[subject.class_id] = [];
                }
                subjectsByClass[subject.class_id].push(subject);
              });
            }

            // Add subjects to classes
            const classesWithSubjects = fullSchoolData.classes?.map((cls: any) => ({
              ...cls,
              subjects: subjectsByClass[cls.id] || []
            })) || [];

            const loadedSchoolData = {
              classes: classesWithSubjects,
              teachers: fullSchoolData.teachers || [],
              classrooms: fullSchoolData.classrooms || []
            };

            // Load schedule
            const scheduleData = await scheduleService.getAll(user.school_id);
            
            let schedule: Schedule | null = null;
            if (scheduleData && scheduleData.length > 0) {
              const entries = scheduleData.map(entry => ({
                id: entry.id,
                classId: entry.class_id,
                subjectId: entry.subject_id,
                teacherId: entry.teacher_id,
                classroomId: entry.classroom_id,
                day: entry.day,
                hour: entry.hour
              }));

              schedule = {
                id: `schedule_${user.school_id}`,
                schoolId: user.school_id,
                entries: entries
              };
            } else {
              schedule = {
                id: `schedule_${user.school_id}`,
                schoolId: user.school_id,
                entries: []
              };
            }

            // Set school info and data
            setSchoolInfo({
              name: schoolData.name,
              type: schoolData.type,
              shiftType: schoolData.shift_type,
              scheduleType: schoolData.schedule_type
            });
            
            setSchoolData(loadedSchoolData);
            setSchedule(schedule);
            setCurrentStep('schedule-view');
          }
        }
      } catch (error) {
        console.error('Error loading school schedule on login:', error);
        // Fallback to school-info if there's an error
        setCurrentStep('school-info');
      }
    } else {
      setCurrentStep('school-info');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentStep('public');
    setSchoolInfo(null);
    setSchoolData(null);
    setSchedule(null);
  };

  const handleSchoolInfoSubmit = (info: SchoolBasicInfo) => {
    setSchoolInfo(info);
    setCurrentStep('classes-subjects');
  };

  const handleClassesSubmit = async (data: {
    classes: Class[];
    teachers: Teacher[];
    classrooms: Classroom[];
  }) => {
    if (!schoolInfo) return;

    setSchoolData(data);

    // Try to load schedule from database first
    try {
      // Use a fixed school ID for now - in real app this would come from the database
      const schoolId = 'a427359c-5b65-4596-906e-a0554d10521c';
      const scheduleData = await scheduleService.getAll(schoolId);
      
      if (scheduleData && scheduleData.length > 0) {
        // Transform database data to Schedule format
        const entries = scheduleData.map(entry => ({
          id: entry.id,
          classId: entry.class_id,
          subjectId: entry.subject_id,
          teacherId: entry.teacher_id,
          classroomId: entry.classroom_id,
          day: entry.day,
          hour: entry.hour
        }));

        const loadedSchedule: Schedule = {
          id: `schedule_${schoolId}`,
          schoolId: schoolId,
          entries: entries
        };

        setSchedule(loadedSchedule);
      } else {
        // No schedule in database, create empty one
        const emptySchedule: Schedule = {
          id: `schedule_${schoolId}`,
          schoolId: schoolId,
          entries: []
        };
        setSchedule(emptySchedule);
      }
    } catch (error) {
      console.error('Error loading schedule from database:', error);
      // Create empty schedule on error
      const emptySchedule: Schedule = {
        id: `schedule_${Date.now()}`,
        schoolId: 'unknown',
        entries: []
      };
      setSchedule(emptySchedule);
    }

    setCurrentStep('schedule-view');
  };

  const handleBack = () => {
    if (currentStep === 'classes-subjects') {
      setCurrentStep('school-info');
    } else if (currentStep === 'schedule-view') {
      setCurrentStep('classes-subjects');
    }
  };

  const handleNewSchedule = () => {
    setCurrentStep('school-info');
    setSchoolInfo(null);
    setSchoolData(null);
    setSchedule(null);
  };

  // Load schedule from database
  const loadScheduleFromDatabase = async (schoolId: string) => {
    try {
      const scheduleData = await scheduleService.getAll(schoolId);
      
      if (scheduleData && scheduleData.length > 0) {
        // Transform database data to Schedule format
        const entries = scheduleData.map(entry => ({
          id: entry.id,
          classId: entry.class_id,
          subjectId: entry.subject_id,
          teacherId: entry.teacher_id,
          classroomId: entry.classroom_id,
          day: entry.day,
          hour: entry.hour
        }));

        const loadedSchedule: Schedule = {
          id: `schedule_${schoolId}`,
          schoolId: schoolId,
          entries: entries
        };

        setSchedule(loadedSchedule);
        return loadedSchedule;
      } else {
        // No schedule found, create empty one
        const emptySchedule: Schedule = {
          id: `schedule_${schoolId}`,
          schoolId: schoolId,
          entries: []
        };
        setSchedule(emptySchedule);
        return emptySchedule;
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      // Create empty schedule on error
      const emptySchedule: Schedule = {
        id: `schedule_${schoolId}`,
        schoolId: schoolId,
        entries: []
      };
      setSchedule(emptySchedule);
      return emptySchedule;
    }
  };

  // Load schedule when entering schedule-view step
  useEffect(() => {
    if (currentStep === 'schedule-view' && schoolInfo && schoolData && !schedule) {
      // Use a fixed school ID for now - in real app this would come from the database
      const schoolId = 'a427359c-5b65-4596-906e-a0554d10521c';
      loadScheduleFromDatabase(schoolId);
    }
  }, [currentStep, schoolInfo, schoolData, schedule]);

  // Set edit mode for school users
  useEffect(() => {
    // This will be handled by passing autoEditMode prop instead
  }, [currentStep, currentUser]);

  // Load school data from database
  const loadSchoolDataFromDatabase = async (schoolId: string) => {
    try {
      const schoolData = await schoolService.getWithRelations(schoolId);
      
      if (schoolData) {
        // Group subjects by class_id
        const subjectsByClass: { [key: string]: any[] } = {};
        if (schoolData.subjects) {
          schoolData.subjects.forEach((subject: any) => {
            if (!subjectsByClass[subject.class_id]) {
              subjectsByClass[subject.class_id] = [];
            }
            subjectsByClass[subject.class_id].push(subject);
          });
        }

        // Add subjects to classes
        const classesWithSubjects = schoolData.classes?.map((cls: any) => ({
          ...cls,
          subjects: subjectsByClass[cls.id] || []
        })) || [];

        const loadedSchoolData = {
          classes: classesWithSubjects,
          teachers: schoolData.teachers || [],
          classrooms: schoolData.classrooms || []
        };

        setSchoolData(loadedSchoolData);
        return loadedSchoolData;
      }
    } catch (error) {
      console.error('Error loading school data:', error);
    }
    return null;
  };

  // Load all data when entering schedule-view
  useEffect(() => {
    if (currentStep === 'schedule-view' && schoolInfo && !schoolData) {
      const schoolId = 'a427359c-5b65-4596-906e-a0554d10521c';
      loadSchoolDataFromDatabase(schoolId);
    }
  }, [currentStep, schoolInfo, schoolData]);

  const handlePublicSchoolSelect = async (school: any) => {
    // For public users, load school data and show schedule
    console.log('handlePublicSchoolSelect called with school:', school);
    try {
      // Load school data with relations
      const schoolData = await schoolService.getWithRelations(school.id);
      console.log('School data loaded:', schoolData);
      
      if (schoolData) {
        // Group subjects by class_id
        const subjectsByClass: { [key: string]: any[] } = {};
        if (schoolData.subjects) {
          schoolData.subjects.forEach((subject: any) => {
            if (!subjectsByClass[subject.class_id]) {
              subjectsByClass[subject.class_id] = [];
            }
            subjectsByClass[subject.class_id].push(subject);
          });
        }

        // Add subjects to classes
        const classesWithSubjects = schoolData.classes?.map((cls: any) => ({
          ...cls,
          subjects: subjectsByClass[cls.id] || []
        })) || [];

        const loadedSchoolData = {
          classes: classesWithSubjects,
          teachers: schoolData.teachers || [],
          classrooms: schoolData.classrooms || []
        };

        console.log('Processed school data:', loadedSchoolData);

        // Load schedule
        const scheduleData = await scheduleService.getAll(school.id);
        console.log('Schedule data loaded:', scheduleData);
        
        let schedule: Schedule | null = null;
        if (scheduleData && scheduleData.length > 0) {
          const entries = scheduleData.map(entry => ({
            id: entry.id,
            classId: entry.class_id,
            subjectId: entry.subject_id,
            teacherId: entry.teacher_id,
            classroomId: entry.classroom_id,
            day: entry.day,
            hour: entry.hour
          }));

          schedule = {
            id: `schedule_${school.id}`,
            schoolId: school.id,
            entries: entries
          };
        } else {
          schedule = {
            id: `schedule_${school.id}`,
            schoolId: school.id,
            entries: []
          };
        }

        console.log('Final schedule:', schedule);

        // Set school info and data
        setSchoolInfo({
          name: school.name,
          type: school.type,
          shiftType: school.shift_type,
          scheduleType: school.schedule_type
        });
        
        setSchoolData(loadedSchoolData);
        setSchedule(schedule);
        setCurrentStep('schedule-view');
        
        console.log('Navigation to schedule-view completed');
      }
    } catch (error) {
      console.error('Error loading school schedule:', error);
    }
  };

  const handleCoordinatorViewSchool = async (school: any) => {
    // Load school data and show schedule for coordinator
    await handlePublicSchoolSelect(school);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'public':
        return (
          <PublicHomePage
            searchQuery={searchQuery}
            onSelectSchool={handlePublicSchoolSelect}
          />
        );
      
      case 'coordinator':
        return (
          <CoordinatorDashboard
            onLogout={handleLogout}
            onViewSchool={handleCoordinatorViewSchool}
          />
        );
      
      case 'school-info':
        return <SchoolForm onSubmit={handleSchoolInfoSubmit} />;
      
      case 'classes-subjects':
        return (
          <ClassesForm
            schoolType={schoolInfo?.type || 'primary'}
            onSubmit={handleClassesSubmit}
            onBack={handleBack}
          />
        );
      
      case 'schedule-view':
        if (!schoolInfo || !schoolData || !schedule) {
          return <div>Грешка: Недостају подаци</div>;
        }

        const school: School = {
          id: `school_${Date.now()}`,
          ...schoolInfo,
          ...schoolData
        };

        return (
          <ScheduleViewComponent
            school={school}
            schedule={schedule}
            onBack={handleBack}
            onNewSchedule={handleNewSchedule}
            autoEditMode={currentUser?.role === 'school'}
          />
        );
      
      default:
        return <div>Непознат корак</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        onSearch={setSearchQuery}
        onLogin={handleLogin}
        currentUser={currentUser}
      />
      
      <main>
        {renderCurrentStep()}
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm pb-8">
        <p>© 2024 Распоред часова - Сва права задржана</p>
      </footer>
    </div>
  );
}

export default App;
