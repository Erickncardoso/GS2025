
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    const method = req.method

    // Rota para criar novo relato
    if (pathname === '/flood-reports' && method === 'POST') {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('flood_reports')
        .insert({
          title: body.title || 'Relato de Enchente',
          message: body.message,
          severity: body.severity || 'moderate',
          latitude: body.latitude,
          longitude: body.longitude,
          neighborhood: body.neighborhood,
          address: body.address,
          water_level: body.water_level,
          affected_people: body.affected_people || 0,
          status: 'pending',
          user_id: body.user_id,
          report_date: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Erro ao criar relato:', error)
        return new Response(
          JSON.stringify({ error: `Erro ao salvar relato: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          message: 'Relato salvo (aguardando aprovação)',
          data: data[0]
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rota para listar relatos
    if (pathname === '/flood-reports' && method === 'GET') {
      const approved = url.searchParams.get('approved')
      
      let query = supabaseClient
        .from('flood_reports')
        .select('*')
        .order('report_date', { ascending: false })

      if (approved !== null) {
        const status = approved === '1' ? 'approved' : 'pending'
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao listar relatos: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rota para aprovar relato
    if (pathname.startsWith('/flood-reports/approve/') && method === 'PUT') {
      const reportId = pathname.split('/').pop()
      
      const { data, error } = await supabaseClient
        .from('flood_reports')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .select()

      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao aprovar relato: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: `Relato ${reportId} aprovado com sucesso.` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rota para deletar relato
    if (pathname.startsWith('/flood-reports/') && method === 'DELETE') {
      const reportId = pathname.split('/').pop()
      
      const { error } = await supabaseClient
        .from('flood_reports')
        .delete()
        .eq('id', reportId)

      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao deletar relato: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: `Relato ${reportId} deletado com sucesso.` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Rota não encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
