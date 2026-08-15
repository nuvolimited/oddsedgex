import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import "@/env.config";

const { DATABASE_URL } = process.env;

// Create a Postgres client that we'll use to migrate the database. The
// `max` option is set to 1, which means that the client will only ever have
// one connection to the database. This is important because we only need
// one connection to perform the migration.
//
// The `DATABASE_URL` environment variable is expected to be set to a string
// that can be used to connect to the database. This string should be in the
// following format:
//
//     postgres://<username>:<password>@<host>:<port>/<database>
//
// The `postgres` function from the `postgres` package takes this string and
// returns a client object that we can use to connect to the database.
const migrationClient = postgres(DATABASE_URL as string, {
  max: 1,
});

/**
 * This function migrates the database. It takes no arguments, and it's
 * only called once when the `db:migrate` script is run.
 *
 * It uses the `migrate` function from `drizzle-orm` to perform the
 * migration. The `migrate` function takes two arguments: `db`, which is
 * the database client, and an options object.
 *
 * The `migrationsFolder` option is set to `./src/drizzle/migrations`, which
 * is the folder where all the migration files live. The `migrate` function
 * will look in this folder for files that match the naming convention
 * `[timestamp]_[name].sql`. The `[timestamp]` part is a Unix timestamp that
 * indicates when the migration was created, and the `[name]` part is a
 * description of what the migration does.
 *
 * When the `migrate` function finds a migration file, it will execute the
 * SQL in that file against the database. This will modify the database
 * schema so that it matches the schema described in the migration file.
 *
 * After all the migrations have been executed, the `migrate` function will
 * return a promise that resolves when all the migrations are complete.
 *
 * When the promise resolves, the `end` method of the database client is
 * called. This will close the database connection and release any resources
 * that were being used.
 */
async function main() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/drizzle/migrations",
  });

  await migrationClient.end();
}

main();
