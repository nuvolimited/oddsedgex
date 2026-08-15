import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./drizzle";
import { users } from "./drizzle/schemas/user.schema";
import { eq, or } from "drizzle-orm";
import { verifyPassword } from "./lib/password_hasher";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if the credentials object contains a valid username and password
        if (!credentials?.username || !credentials.password) {
          throw new Error("Invalid credentials"); // Throw an error if either is missing
        }

        // Extract username and password from the credentials, ensuring they are of type string
        const username = credentials.username as string;
        const password = credentials.password as string;

        // Query the database to find the user by email or username depending on the format of the input
        const [user] = await db
          .select()
          .from(users)
          .where(or(eq(users.username, username), eq(users.email, username)));

        // If no user is found, throw an error indicating invalid credentials
        if (!user) throw new Error("Invalid credentials");

        // Verify the password against the stored hash for the user
        if (!(await verifyPassword(password, user.password))) {
          throw new Error("Invalid credentials"); // Throw an error if the password does not match
        }

        // Return the user's id, username, and role if credentials are valid
        return {
          id: user.id,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60, // 2 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store the user's id in the JWT token. This allows the user's id to
        // be accessed without having to query the database.
        token.id = user.id;
      }

      // Return the modified JWT token
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Extract the user's ID from the JWT token
        const userId = token.id as string;

        // Store the user's ID in the session
        session.user.id = userId;
        session.user.role = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, userId))
          .then((res) => res[0]?.role);
      }

      // Return the modified session
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

/**
 * Checks if the user is authenticated or not.
 *
 * @returns A boolean indicating whether the user is authenticated or not.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await auth();
  return !!session && session.user !== null;
};

/**
 * Checks if the user is authenticated as an admin or not.
 *
 * @returns A boolean indicating whether the user is authenticated as an admin or not.
 */
export const isAdmin = async (): Promise<boolean> => {
  const session = await auth();
  // The user is authenticated as an admin if the session is not null
  // and the user's role is "admin".
  return !!session && session.user?.role === "admin";
};
