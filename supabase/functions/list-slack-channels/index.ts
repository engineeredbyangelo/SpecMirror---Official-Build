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

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !userData.user) throw new Error("Not authenticated");

    // Fetch channels (paginate)
    const channels: Array<{ id: string; name: string; is_private: boolean }> = [];
    let cursor = "";
    do {
      const url = `${GATEWAY_URL}/conversations.list?limit=200&exclude_archived=true&types=public_channel,private_channel${
        cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""
      }`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": SLACK_API_KEY,
        },
      });
      const data = await res.json();
      if (!data.ok) throw new Error(`Slack error: ${data.error || res.status}`);
      for (const c of data.channels ?? []) {
        channels.push({ id: c.id, name: c.name, is_private: !!c.is_private });
      }
      cursor = data.response_metadata?.next_cursor || "";
    } while (cursor && channels.length < 1000);

    channels.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify({ channels }), {
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