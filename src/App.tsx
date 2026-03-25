import React, { useState, useEffect } from 'react';
import { SchoolForm } from './components/SchoolForm';
import { ClassesForm } from './components/ClassesForm';
import { ScheduleViewComponent } from './components/ScheduleView';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { PublicHomePage } from './components/PublicHomePage';
import { Header } from './components/Header';
import { ScheduleGenerator } from './utils/scheduleGenerator';
import { authService } from './services/authService';
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

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    if (user.role === 'coordinator') {
      setCurrentStep('coordinator');
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

  const handleClassesSubmit = (data: {
    classes: Class[];
    teachers: Teacher[];
    classrooms: Classroom[];
  }) => {
    if (!schoolInfo) return;

    setSchoolData(data);

    // Create complete school object
    const school: School = {
      id: `school_${Date.now()}`,
      ...schoolInfo,
      ...data
    };

    // Generate schedule
    const generator = new ScheduleGenerator(school);
    const generatedSchedule = generator.generateSchedule();
    setSchedule(generatedSchedule);
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

  const handlePublicSchoolSelect = (school: any) => {
    // For public users, we'll show the schedule in read-only mode
    // This would need to be implemented with actual data from the database
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
