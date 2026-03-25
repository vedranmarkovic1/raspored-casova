import React, { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { authService, LoginCredentials } from '../services/authService'

interface LoginFormProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Молимо попуните сва поља')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await authService.login(credentials)
      onLogin(user)
      onClose()
      setCredentials({ username: '', password: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при пријави')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Пријава</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Корисничко име
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={handleInputChange('username')}
              className="form-input"
              placeholder="Унесите корисничко име"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Лозинка
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleInputChange('password')}
                className="form-input pr-10"
                placeholder="Унесите лозинку"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Пријава у току...' : 'Пријава'}
          </button>
        </form>

        <div className="px-6 pb-6">
          <div className="text-sm text-gray-600 text-center">
            <p>Координатор: vedran.markovic</p>
            <p>Школе: Користите податке добијене од координатора</p>
          </div>
        </div>
      </div>
    </div>
  )
}
