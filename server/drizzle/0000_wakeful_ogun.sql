CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50),
	"passwordHash" varchar(64),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
