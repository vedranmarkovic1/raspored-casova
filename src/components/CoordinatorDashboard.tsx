import React, { useState, useEffect } from 'react'
import { Plus, Eye, Trash2, Users, School } from 'lucide-react'
import { schoolService } from '../services/schoolService'
import { authService } from '../services/authService'

interface CoordinatorDashboardProps {
  onLogout: () => void
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({ onLogout }) => {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newSchool, setNewSchool] = useState({
    name: '',
    type: 'primary' as 'primary' | 'high',
    shift_type: 'one' as 'one' | 'two',
    schedule_type: 'same' as 'same' | 'different'
  })

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    schoolId: ''
  })

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    try {
      const data = await schoolService.getAll()
      setSchools(data)
    } catch (error) {
      console.error('Грешка при учитавању школа:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchool = async () => {
    if (!newSchool.name.trim()) {
      window.alert('Молимо унесите име школе')
      return
    }

    try {
      const school = await schoolService.create(newSchool)
      setSchools(prev => [school, ...prev])
      setNewSchool({
        name: '',
        type: 'primary',
        shift_type: 'one',
        schedule_type: 'same'
      })
      setShowCreateForm(false)
      window.alert('Школа је успешно креирана!')
    } catch (error) {
      window.alert('Грешка при креирању школе: ' + (error as Error).message)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.schoolId) {
      window.alert('Молимо попуните сва поља')
      return
    }

    try {
      await authService.createSchoolUser({
        username: newUser.username,
        password: newUser.password,
        schoolId: newUser.schoolId
      })
      setNewUser({ username: '', password: '', schoolId: '' })
      window.alert('Корисник је успешно креиран!')
    } catch (error) {
      window.alert('Грешка при креирању корисника: ' + (error as Error).message)
    }
  }

  const handleDeleteSchool = async (schoolId: string) => {
    if (!window.confirm('Да ли сте сигурни да желите да обришете ову школу?')) {
      return
    }

    try {
      await schoolService.delete(schoolId)
      setSchools(prev => prev.filter(s => s.id !== schoolId))
      window.alert('Школа је обрисана!')
    } catch (error) {
      window.alert('Грешка при брисању школе: ' + (error as Error).message)
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Контролни панел координатора</h1>
          <p className="text-gray-600 mt-2">Управљајте школама и корисничким налозима</p>
        </div>
        <button
          onClick={onLogout}
          className="btn-secondary"
        >
          Одјава
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <School className="text-primary-600 mr-3" size={32} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              <p className="text-gray-600">Активних школа</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Users className="text-green-600 mr-3" size={32} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              <p className="text-gray-600">Корисничких налога</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schools Management */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Школе</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Нова школа
              </button>
            </div>
          </div>

          <div className="p-6">
            {showCreateForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-4">Креирај нову школу</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newSchool.name}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="Име школе"
                  />
                  <select
                    value={newSchool.type}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, type: e.target.value as any }))}
                    className="form-input"
                  >
                    <option value="primary">Основна школа</option>
                    <option value="high">Средња школа</option>
                  </select>
                  <select
                    value={newSchool.shift_type}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, shift_type: e.target.value as any }))}
                    className="form-input"
                  >
                    <option value="one">Једна смена</option>
                    <option value="two">Две смене</option>
                  </select>
                  <select
                    value={newSchool.schedule_type}
                    onChange={(e) => setNewSchool(prev => ({ ...prev, schedule_type: e.target.value as any }))}
                    className="form-input"
                  >
                    <option value="same">Исти часови</option>
                    <option value="different">Различити часови</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateSchool}
                      className="btn-primary flex-1"
                    >
                      Креирај
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Откажи
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {schools.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{school.name}</h4>
                    <p className="text-sm text-gray-600">
                      {school.type === 'primary' ? 'Основна' : 'Средња'} • 
                      {school.shift_type === 'one' ? ' Једна' : ' Две'} смене
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSchool(school)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSchool(school.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Креирај корисника</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Школа
                </label>
                <select
                  value={newUser.schoolId}
                  onChange={(e) => setNewUser(prev => ({ ...prev, schoolId: e.target.value }))}
                  className="form-input"
                >
                  <option value="">Изаберите школу</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Корисничко име
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  className="form-input"
                  placeholder="Корисничко име"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Лозинка
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input"
                  placeholder="Лозинка"
                />
              </div>

              <button
                onClick={handleCreateUser}
                disabled={!newUser.schoolId || !newUser.username.trim() || !newUser.password.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Креирај корисника
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Информације</h4>
              <p className="text-sm text-blue-800">
                Креирани корисник ће моћи да се пријави са задатим подацима и да управља распоредом за изабрану школу.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
