'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Recebe dados do formulário
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Tenta logar usando o Cliente de Servidor (Gera o cookie correto para o Player)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Retorna erro para exibir na tela (opcional: redirecionar com erro)
    return { error: error.message }
  }

  // Se der certo, revalida e manda pro Portal
  revalidatePath('/', 'layout')
  redirect('/portal')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Tenta criar conta
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Se der certo, revalida e manda pro Portal (ou avisa pra confirmar email)
  revalidatePath('/', 'layout')
  redirect('/portal')
}