# Conteúdo do server.ts
$serverContent = @"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar se for chamado de um Server Component
          }
        },
      },
    }
  )
}
"@

# Escrever o arquivo
Set-Content -Path "src\utils\supabase\server.ts" -Value $serverContent -Encoding UTF8
Write-Host "Arquivo server.ts criado com sucesso!" -ForegroundColor Green