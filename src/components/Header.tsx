import React, { useState } from 'react'
import { Search, LogIn, LogOut, User, Settings } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { authService } from '../services/authService'

interface HeaderProps {
  onSearch: (query: string) => void
  onLogin: (user: any) => void
  currentUser: any
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onLogin, currentUser }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleLogin = (user: any) => {
    onLogin(user)
  }

  const handleLogout = () => {
    authService.logout()
    window.location.reload()
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Распоред часова</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Претражите школе..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.username}
                    </span>
                    {currentUser.schoolName && (
                      <span className="text-xs text-gray-500">
                        ({currentUser.schoolName})
                      </span>
                    )}
                  </div>
                  
                  {currentUser.role === 'coordinator' && (
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Settings size={20} />
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Одјава</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <LogIn size={18} />
                  <span>Пријава</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginForm
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </>
  )
}
