CREATE TABLE IF NOT EXISTS "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_devices" (
	"userId" uuid NOT NULL,
	"deviceId" uuid NOT NULL,
	"isOwner" boolean NOT NULL,
	CONSTRAINT "users_devices_userId_deviceId_pk" PRIMARY KEY("userId","deviceId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"nickname" varchar(50),
	"nfcCardId" varchar(255) NOT NULL,
	"deviceId" uuid NOT NULL,
	"isWhitelisted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "visitors_nfcCardId_unique" UNIQUE("nfcCardId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_devices" ADD CONSTRAINT "users_devices_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_devices" ADD CONSTRAINT "users_devices_deviceId_devices_id_fk" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visitors" ADD CONSTRAINT "visitors_deviceId_devices_id_fk" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
