import { seedAdminUsers } from "./user.seeder";

/**
 * Seeds the database with initial data.
 */
async function seed() {
  console.info("---> SEEDING...\n");

  // Try to seed the database with initial data
  try {
    // Seed the database with admin users
    await seedAdminUsers();
  } catch (error: unknown) {
    // If there's an error, print it to the console and exit the program
    if (error instanceof Error) {
      console.error("seeding failed", error);
    } else {
      console.error("seeding failed with unknown error type", error);
    }
    // Exit the program with a non-zero exit code to indicate failure
    process.exit(1);
  }

  console.info("\nSEEDING DONE <---");
  // Exit the program with a zero exit code to indicate success
  process.exit(0);
}

seed();
