CREATE TABLE IF NOT EXISTS "historyLogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deviceId" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "historyLogs" ADD CONSTRAINT "historyLogs_deviceId_devices_id_fk" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
