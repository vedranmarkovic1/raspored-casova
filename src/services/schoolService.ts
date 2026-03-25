import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type School = Database['public']['Tables']['schools']
type SchoolInsert = School['Insert']
type SchoolUpdate = School['Update']

export const schoolService = {
  // Get all schools
  async getAll() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get school by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new school
  async create(school: SchoolInsert) {
    const { data, error } = await supabase
      .from('schools')
      .insert([school])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update school
  async update(id: string, updates: SchoolUpdate) {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete school
  async delete(id: string) {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get school with all related data
  async getWithRelations(id: string) {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        classes (*),
        teachers (*),
        classrooms (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    
    // Load subjects separately for each class
    if (data && data.classes) {
      const classIds = data.classes.map((cls: any) => cls.id);
      if (classIds.length > 0) {
        const { data: subjects, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .in('class_id', classIds)
        
        if (!subjectsError) {
          data.subjects = subjects;
        } else {
          console.error('Error loading subjects:', subjectsError);
          data.subjects = [];
        }
      } else {
        data.subjects = [];
      }
    } else {
      data.subjects = [];
    }
    
    return data
  }
}
