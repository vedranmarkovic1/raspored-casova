import React, { useState } from 'react';
import { School, SchoolType, ShiftType, ScheduleType } from '../types';

interface SchoolFormProps {
  onSubmit: (school: Omit<School, 'id' | 'classes' | 'teachers' | 'classrooms'>) => void;
}

export const SchoolForm: React.FC<SchoolFormProps> = ({ onSubmit }) => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolType, setSchoolType] = useState<SchoolType>(SchoolType.PRIMARY);
  const [shiftType, setShiftType] = useState<ShiftType>(ShiftType.ONE);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(ScheduleType.SAME);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schoolName.trim()) {
      window.alert('Молимо унесите име школе');
      return;
    }

    onSubmit({
      name: schoolName,
      type: schoolType,
      shiftType: shiftType,
      scheduleType: scheduleType
    });
  };

  return (
    <div className="school-card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Подаци о школи</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Име школе
          </label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="form-input"
            placeholder="Унесите име школе"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип школе
          </label>
          <select
            value={schoolType}
            onChange={(e) => setSchoolType(e.target.value as SchoolType)}
            className="form-input"
          >
            <option value={SchoolType.PRIMARY}>Основна школа</option>
            <option value={SchoolType.HIGH}>Средња школа</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Број смене
          </label>
          <select
            value={shiftType}
            onChange={(e) => setShiftType(e.target.value as ShiftType)}
            className="form-input"
          >
            <option value={ShiftType.ONE}>Једна смена</option>
            <option value={ShiftType.TWO}>Две смене</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Врста часова
          </label>
          <select
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
            className="form-input"
          >
            <option value={ScheduleType.SAME}>Исти часови за све</option>
            <option value={ScheduleType.DIFFERENT}>Различити часови по сменама</option>
          </select>
        </div>
      </div>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Даље
        </button>
      </form>
    </div>
  );
};
