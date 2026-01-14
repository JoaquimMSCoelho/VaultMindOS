# Conteúdo da Tela de Login
$loginPageContent = @"
import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0B0F19] px-4'>
      <div className='max-w-md w-full space-y-8 bg-[#151B2B] p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden'>
        
        {/* Glow Effect */}
        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600'></div>

        <div className='text-center'>
          <h2 className='text-3xl font-bold text-white tracking-tight'>
            VaultMind<span className='text-cyan-400'>OS</span>
          </h2>
          <p className='mt-2 text-sm text-slate-400'>Acesse seu terminal de controle.</p>
        </div>

        {/* Mensagens de Erro/Sucesso */}
        {searchParams?.error && (
            <div className='bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm text-center'>
                {searchParams.error}
            </div>
        )}

        <form className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='sr-only'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='appearance-none relative block w-full px-3 py-3 border border-white/10 placeholder-slate-500 text-white bg-[#0B0F19] rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors'
                placeholder='Endereço de Email'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>Senha</label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none relative block w-full px-3 py-3 border border-white/10 placeholder-slate-500 text-white bg-[#0B0F19] rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors'
                placeholder='Senha de Acesso'
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              formAction={login}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all'
            >
              Entrar
            </button>
            <button
              formAction={signup}
              className='group relative w-full flex justify-center py-3 px-4 border border-white/10 text-sm font-medium rounded-md text-white bg-transparent hover:border-cyan-500/50 hover:text-cyan-400 focus:outline-none transition-all'
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
"@

# Escrever o arquivo
Set-Content -Path "src\app\login\page.tsx" -Value $loginPageContent -Encoding UTF8
Write-Host "Tela de Login criada com sucesso!" -ForegroundColor Green