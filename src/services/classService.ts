import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Class = Database['public']['Tables']['classes']
type ClassInsert = Class['Insert']
type ClassUpdate = Class['Update']

type Subject = Database['public']['Tables']['subjects']
type SubjectInsert = Subject['Insert']
type SubjectUpdate = Subject['Update']

export const classService = {
  // Classes CRUD
  async getAll(schoolId: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('school_id', schoolId)
      .order('grade', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(classData: ClassInsert) {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: ClassUpdate) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Subjects CRUD
  async getSubjectsByClass(classId: string) {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        teachers (*),
        classrooms (*)
      `)
      .eq('class_id', classId)

    if (error) throw error
    return data
  },

  async createSubject(subjectData: SubjectInsert) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subjectData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSubject(id: string, updates: SubjectUpdate) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSubject(id: string) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get class with subjects and teachers
  async getWithSubjects(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        subjects (
          *,
          teachers (*),
          classrooms (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}
