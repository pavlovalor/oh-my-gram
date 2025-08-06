CREATE SCHEMA "core";
--> statement-breakpoint
CREATE SCHEMA "relations";
--> statement-breakpoint
CREATE TYPE "core"."gender" AS ENUM('male', 'female', 'confused');--> statement-breakpoint
CREATE TYPE "core"."type" AS ENUM('regular', 'business');--> statement-breakpoint
CREATE TABLE "relations"."blacklist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"issuerId" uuid NOT NULL,
	"targetId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relations"."followings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issuerId" uuid NOT NULL,
	"targetId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"reverseFollowingId" uuid
);
--> statement-breakpoint
CREATE TABLE "core"."mentions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"postId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core"."profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"identityId" uuid NOT NULL,
	"username" varchar(16) NOT NULL,
	"displayName" varchar(64) NOT NULL,
	"type" "core"."type" DEFAULT 'regular' NOT NULL,
	"photoUri" varchar(128),
	"gender" "core"."gender",
	"externalUrl" text,
	"bio" text,
	"__followers" integer DEFAULT 0 NOT NULL,
	"__followings" integer DEFAULT 0 NOT NULL,
	"__posts" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "core"."restrictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profileId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"expiresAt" timestamp NOT NULL,
	"features" varchar(64)[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "relations"."blacklist" ADD CONSTRAINT "blacklist_issuerId_profile_id_fk" FOREIGN KEY ("issuerId") REFERENCES "core"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relations"."blacklist" ADD CONSTRAINT "blacklist_targetId_profile_id_fk" FOREIGN KEY ("targetId") REFERENCES "core"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relations"."followings" ADD CONSTRAINT "followings_reverseFollowingId_followings_id_fk" FOREIGN KEY ("reverseFollowingId") REFERENCES "relations"."followings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."restrictions" ADD CONSTRAINT "restrictions_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "core"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "branch_direction" ON "relations"."followings" USING btree ("issuerId","targetId");