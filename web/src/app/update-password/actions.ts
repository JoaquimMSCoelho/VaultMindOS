'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const supabase = await createClient()

  if (password !== confirmPassword) {
    return redirect('/update-password?error=Senhas não conferem')
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return redirect('/update-password?error=Erro ao atualizar senha')
  }

  return redirect('/dashboard')
}
