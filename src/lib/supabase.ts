import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shgkywxxdujeqdfbrlkx.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZ2t5d3h4ZHVqZXFkZmJybGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkzNDUxMywiZXhwIjoyMDg5NTEwNTEzfQ.hk-tXszVL47xbR_psPITnkA6Yp87htKddce-s1kJQgc'

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
