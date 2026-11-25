export const dynamic = "force-static"

export function GET() {
  return new Response("# %%APP_NAME%%\n\n%%APP_DESCRIPTION%%\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
