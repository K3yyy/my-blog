// // services/topics.service.ts
// import { createSupabaseServerClient } from '@/lib/supabase/server'
// import type { Database } from '@/types/supabase'
//
// type TopicRow = Database['public']['Tables']['topics']['Row']
//
// export async function getAllTopics() {
//     const supabase = createSupabaseServerClient()
//
//     const { data, error } = await supabase
//         .from('topics')
//         .select('slug, title, description, icon_name')
//         .order('title')
//
//     if (error) {
//         console.error('Topics fetch error:', error)
//         throw error
//     }
//
//     return data as TopicRow[]
// }
//
// export async function getTopicBySlug(slug: string) {
//     const supabase = createSupabaseServerClient()
//
//     const { data, error } = await supabase
//         .from('topics')
//         .select('*')
//         .eq('slug', slug)
//         .single()
//
//     if (error) {
//         console.error('Topic by slug error:', error)
//         throw error
//     }
//
//     return data
// }