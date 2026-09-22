// Called from /admin (Projects tab -> "Add from link"). Requires a valid
// Supabase session JWT (deployed WITH JWT verification), so only a signed-in
// admin can trigger a fetch of an arbitrary URL from Supabase's infra.
//
// Flow: fetch the given URL's HTML server-side (the browser can't do this
// itself — most sites don't send CORS headers for cross-origin reads) ->
// pull <title>/og:title, og:description/description, and og:image out with
// lightweight regexes (no DOM parser dependency) -> return them so the admin
// form can prefill a new project instead of typing everything by hand.

const ALLOWED_ORIGINS = new Set([
  "https://portfolio-website-pi-henna-13.vercel.app",
  "http://localhost:5173",
]);

function corsHeadersFor(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    Vary: "Origin",
  };
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(req), "Content-Type": "application/json" },
  });
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => ENTITIES[m] ?? m).trim();
}

function extractMetaTags(html: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const tag of html.match(/<meta\s+[^>]*>/gi) ?? []) {
    const key = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1];
    const content = tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1];
    if (key && content !== undefined) tags[key.toLowerCase()] = content;
  }
  return tags;
}

// Blocks the obvious SSRF vectors (internal/link-local addresses and cloud
// metadata endpoints) by hostname pattern — this function is JWT-gated to
// signed-in admins already, so the residual risk is low, but there's no
// reason to let it touch internal infra either.
const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^\[?::1\]?$/,
  /^\[?fe80:/i,
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeadersFor(req) });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return json(req, { error: "url is required" }, 400);
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return json(req, { error: "That doesn't look like a valid URL." }, 400);
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return json(req, { error: "Only http/https links are supported." }, 400);
    }
    if (BLOCKED_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname))) {
      return json(req, { error: "That host isn't allowed." }, 400);
    }

    const pageResponse = await fetch(parsed.toString(), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StackfenLinkPreview/1.0)" },
      redirect: "follow",
    });

    if (!pageResponse.ok) {
      return json(req, { error: `Couldn't reach that URL (HTTP ${pageResponse.status}).` }, 502);
    }

    const html = await pageResponse.text();
    const meta = extractMetaTags(html);
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];

    const name = decodeEntities(meta["og:title"] || titleTag || "");
    const description = decodeEntities(meta["og:description"] || meta["description"] || "");
    let screenshot = meta["og:image"] || meta["twitter:image"] || null;
    if (screenshot) {
      try {
        screenshot = new URL(screenshot, parsed).toString();
      } catch {
        screenshot = null;
      }
    }

    return json(req, { name, description, screenshot, liveUrl: parsed.toString() });
  } catch (err) {
    return json(req, { error: String(err) }, 500);
  }
});
