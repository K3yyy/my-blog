'use server'

import { createSupabaseServer } from '@/lib/supabase/server'

export async function createArticleAction(formData: FormData) {
    const supabase = await createSupabaseServer()

    const title = formData.get('title') as string
    const slugRaw = formData.get('slug') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const date = formData.get('date') as string || new Date().toISOString().split('T')[0]
    const image_url = formData.get('image_url') as string || null

    const slug = slugRaw || title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    const { error } = await supabase.from('articles').insert({
        title,
        slug,
        description,
        category,
        date,
        image_url,
        published: false, // start as draft
        // No author_id needed now (or set to null / fixed value)
    })

    if (error) {
        throw new Error(error.message)
    }

    return { success: true, slug }
}