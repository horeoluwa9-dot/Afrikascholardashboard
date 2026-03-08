import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "generate_section":
        systemPrompt = `You are a senior academic research writing assistant specializing in African scholarship. Write in a formal, scholarly tone. Use precise academic language. Include in-text citations in ${context.citation_style || "APA"} format using realistic African and international author names. Structure the content with clear paragraphs and logical flow. The paper is titled "${context.title}" in the field of ${context.research_field || "general research"}.`;
        userPrompt = `Write the "${context.section}" section for this ${context.paper_type || "research paper"}. ${context.existing_content ? `Here is the existing content for context: ${context.existing_content}` : ""} Write approximately 3-5 paragraphs with academic rigor and citations.`;
        break;
      case "expand_section":
        systemPrompt = `You are a senior academic writing assistant. Expand the following section with more depth, evidence, and citations in ${context.citation_style || "APA"} format.`;
        userPrompt = `Expand this section titled "${context.section}":\n\n${context.content}\n\nAdd more detail, evidence, and at least 2-3 additional citations.`;
        break;
      case "rewrite_section":
        systemPrompt = `You are an academic editor. Rewrite the following section to improve clarity, flow, and academic rigor. Maintain ${context.citation_style || "APA"} citation format.`;
        userPrompt = `Rewrite this section:\n\n${context.content}`;
        break;
      case "simplify":
        systemPrompt = `You are an academic writing assistant. Simplify the language while maintaining academic tone and accuracy.`;
        userPrompt = `Simplify this text while keeping it academically appropriate:\n\n${context.content}`;
        break;
      case "generate_abstract":
        systemPrompt = `You are an academic writing assistant. Generate a structured abstract (Background, Objectives, Methods, Results, Conclusion) for the following research paper.`;
        userPrompt = `Generate an abstract for a ${context.paper_type} titled "${context.title}" in ${context.research_field}. Sections included: ${context.sections?.join(", ")}. ${context.existing_content ? `Content so far: ${context.existing_content}` : ""}`;
        break;
      case "find_sources":
        systemPrompt = `You are a research librarian specializing in African academic literature. Suggest relevant academic sources with full citation details. Include a mix of African and international journals. Format each source with: Title, Authors, Journal, Year, and a brief relevance note.`;
        userPrompt = `Find relevant academic sources for: ${context.query}. Field: ${context.research_field || "general"}. Provide 5-8 sources.`;
        break;
      case "chat":
        systemPrompt = `You are an AI research writing assistant for Afrika Scholar, specializing in African academic research. Help with writing, structuring, citations, methodology, and research questions. Be concise but thorough. The user is working on a ${context.paper_type || "research paper"} titled "${context.title || "untitled"}" in ${context.research_field || "general research"}.`;
        userPrompt = context.message;
        break;
      case "generate_bibliography":
        systemPrompt = `You are a citation manager. Generate a formatted bibliography from the provided sources in ${context.citation_style || "APA"} format.`;
        userPrompt = `Generate a bibliography for these sources:\n${JSON.stringify(context.sources)}`;
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-paper-assist error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
