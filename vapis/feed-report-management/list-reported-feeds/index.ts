/**
 *  @filename feed-report-management/list-reported-feeds/index.ts
 */

import { createClient } from "npm:shaple@0.2.0";

const shaple = createClient({
  url: Deno.env.get("SHAPLE_URL") || "",
  anonKey: Deno.env.get("SHAPLE_ANON_KEY") || "",
});

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { data, error } = await shaple
      .from("feed_report.reports")
      .select("*")
      .eq("report_status", "pending");

    if (error) {
      console.error("Error fetching reported feeds:", error);
      return new Response("Internal Server Error", { status: 500 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
