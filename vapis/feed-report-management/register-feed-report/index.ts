/**
 *  @filename feed-report-management/register-feed-report/index.ts
 */

import { createClient } from "npm:shaple@0.2.0";

const shaple = createClient({
  url: Deno.env.get("SHAPLE_URL") || "",
  anonKey: Deno.env.get("SHAPLE_ANON_KEY") || "",
});

interface ReportPayload {
  feed_id: string;
  reporter_id: string;
  report_reason: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { feed_id, reporter_id, report_reason }: ReportPayload = await req.json();

    // Basic validation
    if (!feed_id || !reporter_id || !report_reason) {
      return new Response("Missing required fields", { status: 400 });
    }

    const { data, error } = await shaple.from("feed_report.reports").insert([
      { feed_id, reporter_id, report_reason }
    ]);

    if (error) {
      console.error("Error inserting report:", error);
      return new Response("Internal Server Error", { status: 500 });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
