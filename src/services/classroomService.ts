import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Classroom = Database['public']['Tables']['classrooms']
type ClassroomInsert = Classroom['Insert']
type ClassroomUpdate = Classroom['Update']

export const classroomService = {
  // Get all classrooms for a school
  async getAll(schoolId: string) {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('school_id', schoolId)
      .order('number', { ascending: true })

    if (error) throw error
    return data
  },

  // Get classroom by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new classroom
  async create(classroomData: ClassroomInsert) {
    const { data, error } = await supabase
      .from('classrooms')
      .insert([classroomData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update classroom
  async update(id: string, updates: ClassroomUpdate) {
    const { data, error } = await supabase
      .from('classrooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete classroom
  async delete(id: string) {
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get or create classroom by number
  async getOrCreate(schoolId: string, number: string, capacity?: number) {
    // First try to find existing classroom
    const { data: existingClassroom } = await supabase
      .from('classrooms')
      .select('*')
      .eq('school_id', schoolId)
      .eq('number', number)
      .single()

    if (existingClassroom) {
      return existingClassroom
    }

    // Create new classroom if not found
    return await this.create({
      school_id: schoolId,
      number,
      capacity
    })
  }
}
