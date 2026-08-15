import "@/env.config";
import { db } from "..";
import { users } from "../schemas/user.schema";
import { hashPassword } from "@/lib/password_hasher";
import { generateReferralCode } from "@/lib/db";
import { userFunds } from "../schemas";

/**
 * Seeds the database with initial admin users.
 */
export async function seedAdminUsers() {
  // Define the initial admin users
  const adminUsers = [
    {
      email: "wyke42@gmail.com",
      password: await hashPassword("Secret123_"),
      username: "wyke42",
      phone: "+2347000000001",
      name: "Silly Kid",
      referralCode: await generateReferralCode(),
    },
    {
      email: "multipurposestockgrowth@gmail.com",
      password: await hashPassword("12345678"),
      username: "surewinning",
      name: "Surewinning",
      phone: "+2348053652791",
      referralCode: await generateReferralCode(),
    },
  ];

  const insertedUsers = await db
    .insert(users)
    .values(adminUsers.map((user) => ({ ...user, role: "admin" as const }))) // Assign 'admin' role to each user
    .returning();

  await db.insert(userFunds).values(
    insertedUsers.map((user) => ({
      userId: user.id,
      amount: "50000.00",
    }))
  );

  console.log("✅", "\nAdmin users seeded");
}
