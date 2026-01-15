'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  
  // Pega a URL atual do site (localhost ou vercel)
  const origin = (await headers()).get('origin')

  if (!email) {
    return { error: 'O e-mail é obrigatório.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    console.error(error)
    return { error: 'Não foi possível enviar o e-mail. Tente novamente.' }
  }

  return { success: true }
}
