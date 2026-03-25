import React, { useState, useEffect } from 'react'
import { School, Users, Calendar, Search } from 'lucide-react'
import { schoolService } from '../services/schoolService'
import { scheduleService } from '../services/scheduleService'

interface PublicHomePageProps {
  searchQuery: string
  onSelectSchool: (school: any) => void
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({ 
  searchQuery, 
  onSelectSchool 
}) => {
  const [schools, setSchools] = useState<any[]>([])
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState<any>(null)
  const [schoolSchedules, setSchoolSchedules] = useState<any[]>([])

  useEffect(() => {
    loadSchools()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSchools(filtered)
    } else {
      setFilteredSchools(schools)
    }
  }, [searchQuery, schools])

  const loadSchools = async () => {
    try {
      const data = await schoolService.getAll()
      setSchools(data)
      setFilteredSchools(data)
    } catch (error) {
      console.error('Грешка при учитавању школа:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSchoolSelect = async (school: any) => {
    setSelectedSchool(school)
    try {
      const schedules = await scheduleService.getAll(school.id)
      setSchoolSchedules(schedules)
    } catch (error) {
      console.error('Грешка при учитавању распореда:', error)
      setSchoolSchedules([])
    }
  }

  const handleViewSchedule = (school: any) => {
    onSelectSchool(school)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Добродошли на систем за распоред часова
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Пронађите вашу школу и погледајте распоред часова. Ако сте администратор школе,
          пријавите се да управљате распоредом.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <School className="text-primary-600 mr-3" size={32} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              <p className="text-gray-600">Регистрованих школа</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Users className="text-green-600 mr-3" size={32} />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {schools.reduce((acc, school) => acc + (school.type === 'primary' ? 8 : 4), 0)}
              </p>
              <p className="text-gray-600">Укупно разреда</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Calendar className="text-purple-600 mr-3" size={32} />
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-gray-600">Радних дана</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow cursor-pointer ${
              selectedSchool?.id === school.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => handleSchoolSelect(school)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  school.type === 'primary' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {school.type === 'primary' ? 'Основна' : 'Средња'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>Смене: {school.shift_type === 'one' ? 'Једна' : 'Две'}</p>
                <p>Часови: {school.schedule_type === 'same' ? 'Исти' : 'Различити'}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewSchedule(school)
                }}
                className="mt-4 w-full btn-primary text-sm"
              >
                Погледај распоред
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSchools.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нема резултата претраге
          </h3>
          <p className="text-gray-600">
            Покушајте са другим појмовима за претрагу.
          </p>
        </div>
      )}

      {/* Selected School Schedule Preview */}
      {selectedSchool && schoolSchedules.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Распоред за {selectedSchool.name}
          </h3>
          <div className="text-sm text-gray-600">
            <p>Укупно часова: {schoolSchedules.length}</p>
            <p>Активних одељења: {[...new Set(schoolSchedules.map(s => s.class_id))].length}</p>
          </div>
          <button
            onClick={() => handleViewSchedule(selectedSchool)}
            className="mt-4 btn-primary"
          >
            Погледај детаљан распоред
          </button>
        </div>
      )}
    </div>
  )
}
