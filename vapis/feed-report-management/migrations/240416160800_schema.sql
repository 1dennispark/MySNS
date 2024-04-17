-- schema.sql

CREATE SCHEMA IF NOT EXISTS feed_report;

CREATE TABLE IF NOT EXISTS feed_report.reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID NOT NULL REFERENCES feeds(feed_id),
    reporter_id UUID NOT NULL REFERENCES um.users(owner),
    report_reason TEXT NOT NULL,
    report_status TEXT DEFAULT 'pending' CHECK (report_status IN ('pending', 'reviewed', 'resolved')),
    report_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    review_date TIMESTAMP WITH TIME ZONE,
                              resolution_details TEXT
                              );

-- Enable RLS
ALTER TABLE feed_report.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY report_access_policy ON feed_report.reports
    FOR ALL
    USING (TRUE);