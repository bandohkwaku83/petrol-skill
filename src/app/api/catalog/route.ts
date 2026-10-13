import { getPublished } from "@/lib/site-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ ok: true, catalog: await getPublished() });
  } catch {
    return Response.json({ ok: false, error: "The website content could not be loaded." }, { status: 500 });
  }
}
