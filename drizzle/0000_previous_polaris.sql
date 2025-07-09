CREATE TABLE "accounts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36),
	"provider" varchar(20) NOT NULL,
	"provider_account_id" varchar(50) NOT NULL,
	"access_token" varchar(200),
	"refresh_token" varchar(200),
	"token_type" varchar(20),
	"scope" varchar(100),
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"name" varchar(50),
	"avatar" varchar(200),
	"email_verified" boolean DEFAULT false,
	"password" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;