import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Cria a resposta inicial
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Cria o cliente Supabase para gerenciar os cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // A mágica acontece aqui: sincroniza cookies da Request com a Response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          
          supabaseResponse = NextResponse.next({
            request,
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Importante: Atualiza o token se estiver expirado
  await supabase.auth.getUser()

  return supabaseResponse
}