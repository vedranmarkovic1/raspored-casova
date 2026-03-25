import { supabase } from '../lib/supabase'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  role: 'coordinator' | 'school'
  school_id?: string
  schoolName?: string
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { username, password } = credentials

    // Get user by username
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      throw new Error('Неправилно корисничко име или лозинка')
    }

    // Verify password
    const { data: passwordCheck, error: verifyError } = await supabase
      .rpc('verify_password', {
        plain_password: password,
        hashed_password: user.password_hash
      })

    if (verifyError || !passwordCheck) {
      throw new Error('Неправилно корисничко име или лозинка')
    }

    // Get school name if user is school
    let schoolName: string | undefined
    if (user.role === 'school' && user.school_id) {
      const { data: school } = await supabase
        .from('schools')
        .select('name')
        .eq('id', user.school_id)
        .single()
      
      schoolName = school?.name
    }

    // Store in localStorage
    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      school_id: user.school_id,
      schoolName
    }

    localStorage.setItem('authUser', JSON.stringify(authUser))
    return authUser
  },

  // Logout user
  logout() {
    localStorage.removeItem('authUser')
  },

  // Get current user
  getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem('authUser')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        localStorage.removeItem('authUser')
        return null
      }
    }
    return null
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  },

  // Check if user is coordinator
  isCoordinator(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'coordinator'
  },

  // Check if user is school
  isSchool(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'school'
  },

  // Create new school user
  async createSchoolUser(userData: {
    username: string
    password: string
    schoolId: string
  }): Promise<void> {
    // Hash password
    const { data: hashResult, error: hashError } = await supabase
      .rpc('hash_password', {
        plain_password: userData.password
      })

    if (hashError || !hashResult) {
      throw new Error('Грешка при хеширању лозинке')
    }

    // Create user
    const { error } = await supabase
      .from('users')
      .insert({
        username: userData.username,
        password_hash: hashResult,
        role: 'school',
        school_id: userData.schoolId
      })

    if (error) {
      if (error.code === '23505') {
        throw new Error('Корисничко име већ постоји')
      }
      throw new Error('Грешка при креирању корисника')
    }
  },

  // Update user password
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    // Hash new password
    const { data: hashResult, error: hashError } = await supabase
      .rpc('hash_password', {
        plain_password: newPassword
      })

    if (hashError || !hashResult) {
      throw new Error('Грешка при хеширању лозинке')
    }

    // Update password
    const { error } = await supabase
      .from('users')
      .update({ password_hash: hashResult })
      .eq('id', userId)

    if (error) {
      throw new Error('Грешка при ажурирању лозинке')
    }
  }
}
