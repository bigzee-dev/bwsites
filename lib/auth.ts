import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "USER",
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 1, // 1 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    disableSessionRefresh: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          const adminCount = await prisma.user.count({
            where: { role: "ADMIN" },
          });

          if (adminCount > 0) {
            throw new APIError("BAD_REQUEST", {
              message: "An admin account already exists.",
            });
          }

          return { data: { role: "ADMIN" } };
        },
      },
    },
  },
});
