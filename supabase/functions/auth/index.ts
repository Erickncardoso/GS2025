
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    const method = req.method

    // Rota de login para administrador
    if (pathname === '/auth/login' && method === 'POST') {
      const body = await req.json()
      const { usuario, senha } = body

      // Login básico para demonstração (pode ser expandido)
      if (usuario === 'admin' && senha === '1234') {
        // Verificar se é usuário da Defesa Civil
        const { data: civilDefenseUser } = await supabaseClient
          .from('civil_defense_users')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single()

        return new Response(
          JSON.stringify({ 
            message: 'Login autorizado',
            token: 'admin123',
            user: civilDefenseUser || { role: 'admin' }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ message: 'Credenciais inválidas' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Rota para verificar token
    if (pathname === '/auth/verify' && method === 'GET') {
      const authHeader = req.headers.get('authorization')
      
      if (authHeader && authHeader === 'Bearer admin123') {
        return new Response(
          JSON.stringify({ valid: true, role: 'admin' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ valid: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Rota não encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na função de auth:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
