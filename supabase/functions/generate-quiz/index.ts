import "jsr:@supabase/functions-js/cors";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface RequestBody {
  subject: string;
  topic: string;
  difficulty: string;
  count: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
      },
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const body: RequestBody = await req.json();
    const { subject, topic, difficulty, count } = body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Generate ${count} multiple choice questions about "${topic}" in ${subject} at ${difficulty} level. 
Return as JSON array with this structure:
[{"question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "A"}]
Only return valid JSON, nothing else.`,
          },
          {
            role: "user",
            content: `Generate quiz questions for ${subject} - ${topic}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    let questions = [];

    try {
      const content = data.choices?.[0]?.message?.content || "[]";
      questions = JSON.parse(content);
    } catch {
      questions = [];
    }

    return new Response(JSON.stringify({ questions }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate quiz", questions: [] }),
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
});
