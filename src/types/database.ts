// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          role: 'coordinator' | 'school'
          school_id?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          role: 'coordinator' | 'school'
          school_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          role?: 'coordinator' | 'school'
          school_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          type: 'primary' | 'high'
          shift_type: 'one' | 'two'
          schedule_type: 'same' | 'different'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'primary' | 'high'
          shift_type: 'one' | 'two'
          schedule_type: 'same' | 'different'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'primary' | 'high'
          shift_type?: 'one' | 'two'
          schedule_type?: 'same' | 'different'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          school_id: string
          name: string
          grade: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          grade: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          grade?: number
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          school_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          class_id: string
          teacher_id: string
          classroom_id?: string
          name: string
          weekly_hours: number
          category: 'natural' | 'social' | 'language' | 'art' | 'sport'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          teacher_id: string
          classroom_id?: string
          name: string
          weekly_hours: number
          category: 'natural' | 'social' | 'language' | 'art' | 'sport'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          teacher_id?: string
          classroom_id?: string
          name?: string
          weekly_hours?: number
          category?: 'natural' | 'social' | 'language' | 'art' | 'sport'
          created_at?: string
          updated_at?: string
        }
      }
      classrooms: {
        Row: {
          id: string
          school_id: string
          number: string
          capacity?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          number: string
          capacity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          number?: string
          capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          school_id: string
          day: number
          hour: number
          class_id: string
          subject_id: string
          teacher_id: string
          classroom_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          day: number
          hour: number
          class_id: string
          subject_id: string
          teacher_id: string
          classroom_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          day?: number
          hour?: number
          class_id?: string
          subject_id?: string
          teacher_id?: string
          classroom_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
