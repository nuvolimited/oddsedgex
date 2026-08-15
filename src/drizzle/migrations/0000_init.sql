CREATE TYPE "public"."kyc_verification_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."bet_status" AS ENUM('pending', 'paid');--> statement-breakpoint
CREATE TYPE "public"."payment_option_type" AS ENUM('bank', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "agents" (
	"user_id" uuid NOT NULL,
	"phone" varchar(15) NOT NULL,
	"state" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"kyc" jsonb,
	"status" "kyc_verification_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_locations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"agent_id" uuid NOT NULL,
	"state" varchar(255) NOT NULL,
	"lga" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"address" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arbitrage_games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_type" varchar(255) NOT NULL,
	"event" jsonb NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL,
	"min_bet" numeric(10, 2) DEFAULT '100.00' NOT NULL,
	"max_bet" numeric(10, 2),
	"outcome" varchar(255),
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arbitrage_game_bets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"booking_code" varchar(8) NOT NULL,
	"status" "bet_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "arbitrage_game_bets_booking_code_unique" UNIQUE("booking_code")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_options" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "payment_option_type" DEFAULT 'bank' NOT NULL,
	"details" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_deposit_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"details" jsonb NOT NULL,
	"proof" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_funds" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_funds_withdrawal_options" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "payment_option_type" DEFAULT 'bank' NOT NULL,
	"details" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_withdrawal_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"details" jsonb NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"username" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"referral_code" varchar(8) NOT NULL,
	"referrer_id" uuid,
	"role" "role" DEFAULT 'user' NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "prediction_games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_type" varchar(255) NOT NULL,
	"event" jsonb NOT NULL,
	"start" timestamp NOT NULL,
	"end" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"user_id" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_locations" ADD CONSTRAINT "agent_locations_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arbitrage_game_bets" ADD CONSTRAINT "arbitrage_game_bets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arbitrage_game_bets" ADD CONSTRAINT "arbitrage_game_bets_game_id_arbitrage_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."arbitrage_games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_deposit_history" ADD CONSTRAINT "user_deposit_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_funds" ADD CONSTRAINT "user_funds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_funds_withdrawal_options" ADD CONSTRAINT "user_funds_withdrawal_options_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_withdrawal_history" ADD CONSTRAINT "user_withdrawal_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;