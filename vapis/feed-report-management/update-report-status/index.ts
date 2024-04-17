/**
 *  @filename feed-report-management/update-report-status/index.ts
 */

import { createClient } from "npm:shaple@0.2.0";

const shaple = createClient({
  url: Deno.env.get("SHAPLE_URL") || "",
  anonKey: Deno.env.get("SHAPLE_ANON_KEY") || "",
});

interface UpdateReportStatusPayload {
  report_id: string;
  report_status: 'pending' | 'reviewed' | 'resolved';
  resolution_details?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "PUT") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { report_id, report_status, resolution_details }: UpdateReportStatusPayload = await req.json();

    // Basic validation
    if (!report_id || !report_status) {
      return new Response("Missing required fields", { status: 400 });
    }

    const updatePayload: any = { report_status };
    if (resolution_details) updatePayload.resolution_details = resolution_details;
    if (report_status === 'reviewed' || report_status === 'resolved') {
      updatePayload.review_date = new Date().toISOString();
    }

    const { data, error } = await shaple
      .from("feed_report.reports")
      .update(updatePayload)
      .match({ report_id });

    if (error) {
      console.error("Error updating report status:", error);
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
