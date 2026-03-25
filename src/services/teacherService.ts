import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Teacher = Database['public']['Tables']['teachers']
type TeacherInsert = Teacher['Insert']
type TeacherUpdate = Teacher['Update']

export const teacherService = {
  // Get all teachers for a school
  async getAll(schoolId: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', schoolId)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // Get teacher by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new teacher
  async create(teacherData: TeacherInsert) {
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacherData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update teacher
  async update(id: string, updates: TeacherUpdate) {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete teacher
  async delete(id: string) {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get teacher with subjects
  async getWithSubjects(id: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        subjects (
          *,
          classes (*),
          classrooms (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Get or create teacher by name
  async getOrCreate(schoolId: string, name: string) {
    // First try to find existing teacher
    const { data: existingTeacher } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', schoolId)
      .eq('name', name)
      .single()

    if (existingTeacher) {
      return existingTeacher
    }

    // Create new teacher if not found
    return await this.create({
      school_id: schoolId,
      name
    })
  }
}
