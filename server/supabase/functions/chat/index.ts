import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import OpenAI from "https://esm.sh/openai@4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const openaiKey = Deno.env.get("GROQ_API_KEY")

    console.log("Keys present:", { 
      supabaseUrl: !!supabaseUrl, 
      supabaseKey: !!supabaseKey, 
      openaiKey: !!openaiKey 
    })

    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      return new Response(JSON.stringify({ error: "Missing environment variables" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    // ✅ Initialize OpenAI INSIDE the function, not outside
    const openai = new OpenAI({ 
  apiKey: openaiKey,
  baseURL: "https://api.groq.com/openai/v1"
})
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [
      { data: advisors },
      { data: courses },
      { data: profiles },
      { data: clubs },
      { data: enrollments },
      { data: advisingSessions },
    ] = await Promise.all([
      supabase.from("advisors").select("full_name, department"),
      supabase.from("courses").select("*"),
      supabase.from("profiles").select("full_name, email, role"),
      supabase.from("clubs").select("*"),
      supabase.from("enrollments").select("*"),
      supabase.from("advising_sessions").select("*"),
    ])

    console.log("Data fetched:", {
      advisors: advisors?.length,
      courses: courses?.length,
      profiles: profiles?.length,
      clubs: clubs?.length,
    })

    const context = `
      You are a helpful university assistant for uConnect.
      Answer questions using ONLY the data below. Be concise and friendly.
      If something isn't in the data, say you don't have that information.

      ADVISORS: ${JSON.stringify(advisors || [])}
      COURSES: ${JSON.stringify(courses || [])}
      STUDENT PROFILES: ${JSON.stringify(profiles || [])}
      CLUBS: ${JSON.stringify(clubs || [])}
      ENROLLMENTS: ${JSON.stringify(enrollments || [])}
      ADVISING SESSIONS: ${JSON.stringify(advisingSessions || [])}
    `

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    })

    const reply = response.choices[0].message.content
    console.log("Success! Reply length:", reply?.length)

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })

  } catch (error) {
    console.error("FULL ERROR:", error.message, error.stack)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})