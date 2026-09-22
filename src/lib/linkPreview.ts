import { supabase } from "./supabase";

export interface LinkPreview {
  name: string;
  description: string;
  screenshot: string | null;
  liveUrl: string;
}

// Calls the fetch-link-preview edge function (see supabase/functions), which
// fetches the URL server-side and pulls its title/description/og:image —
// the browser can't do this itself, since most sites don't send CORS
// headers for cross-origin reads.
export async function fetchLinkPreview(url: string): Promise<{ preview: LinkPreview | null; error: string | null }> {
  if (!supabase) return { preview: null, error: "Supabase isn't configured." };

  const { data, error } = await supabase.functions.invoke<LinkPreview & { error?: string }>("fetch-link-preview", {
    body: { url },
  });

  if (error) return { preview: null, error: error.message };
  if (data?.error) return { preview: null, error: data.error };
  if (!data) return { preview: null, error: "No response from the preview service." };
  return { preview: data, error: null };
}
