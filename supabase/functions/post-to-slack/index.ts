import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SLACK_API_KEY) throw new Error("SLACK_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !userData.user) throw new Error("Not authenticated");

    const body = await req.json().catch(() => ({}));
    const { projectId, channelId } = body as {
      projectId?: string;
      channelId?: string;
    };
    if (!projectId || typeof projectId !== "string") {
      return new Response(JSON.stringify({ error: "projectId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!channelId || typeof channelId !== "string") {
      return new Response(JSON.stringify({ error: "channelId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch project (RLS scopes to user)
    const { data: project, error: projErr } = await supabase
      .from("projects")
      .select("title, spec, confidence, approved")
      .eq("id", projectId)
      .single();
    if (projErr || !project) throw new Error("Project not found");
    if (!project.approved) throw new Error("Project must be approved before sharing");

    const spec = (project.spec || "").trim();
    const truncated = spec.length > 2800 ? spec.slice(0, 2800) + "\n…(truncated)" : spec;

    const blocks = [
      {
        type: "header",
        text: { type: "plain_text", text: `📋 ${project.title}`, emoji: true },
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `*Confidence:* ${project.confidence ?? 0}% · Shared via SpecMirror` },
        ],
      },
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: "```" + truncated + "```" },
      },
    ];

    const res = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SLACK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelId,
        text: `${project.title} — shared from SpecMirror`,
        blocks,
        unfurl_links: false,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Slack postMessage failed: ${data.error || res.status}`);
    }

    return new Response(JSON.stringify({ success: true, ts: data.ts }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});