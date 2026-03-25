import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Schedule = Database['public']['Tables']['schedules']
type ScheduleInsert = Schedule['Insert']
type ScheduleUpdate = Schedule['Update']

export const scheduleService = {
  // Get all schedules for a school
  async getAll(schoolId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        classes (*),
        subjects (*),
        teachers (*),
        classrooms (*)
      `)
      .eq('school_id', schoolId)
      .order('day', { ascending: true })
      .order('hour', { ascending: true })

    if (error) throw error
    return data
  },

  // Get schedule by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        classes (*),
        subjects (*),
        teachers (*),
        classrooms (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new schedule entry
  async create(scheduleData: ScheduleInsert) {
    const { data, error } = await supabase
      .from('schedules')
      .insert([scheduleData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update schedule entry
  async update(id: string, updates: ScheduleUpdate) {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete schedule entry
  async delete(id: string) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Delete all schedules for a school
  async deleteBySchool(schoolId: string) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('school_id', schoolId)

    if (error) throw error
  },

  // Create multiple schedule entries
  async createMany(scheduleData: ScheduleInsert[]) {
    const { data, error } = await supabase
      .from('schedules')
      .insert(scheduleData)
      .select()

    if (error) throw error
    return data
  },

  // Get schedule for specific class
  async getByClass(schoolId: string, classId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        subjects (*),
        teachers (*),
        classrooms (*)
      `)
      .eq('school_id', schoolId)
      .eq('class_id', classId)
      .order('day', { ascending: true })
      .order('hour', { ascending: true })

    if (error) throw error
    return data
  },

  // Get schedule for specific teacher
  async getByTeacher(schoolId: string, teacherId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        classes (*),
        subjects (*),
        classrooms (*)
      `)
      .eq('school_id', schoolId)
      .eq('teacher_id', teacherId)
      .order('day', { ascending: true })
      .order('hour', { ascending: true })

    if (error) throw error
    return data
  },

  // Get schedule for specific classroom
  async getByClassroom(schoolId: string, classroomId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        classes (*),
        subjects (*),
        teachers (*)
      `)
      .eq('school_id', schoolId)
      .eq('classroom_id', classroomId)
      .order('day', { ascending: true })
      .order('hour', { ascending: true })

    if (error) throw error
    return data
  }
}
