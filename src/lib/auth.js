import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { admin } from "better-auth/plugins";

const defaultUserRole = "seeker";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        required: false,
        defaultValue: defaultUserRole,
      },
      plan: {
        type: "string",
        input: true,
        required: true,
        defaultValue: "seeker_free",
      },
      planStartedAt: {
        type: "date",
        input: false,
        required: false,
      },
      planExpiresAt: {
        type: "date",
        input: false,
        required: false,
      },
      status: {
        type: "string",
        input: false,
        required: false,
        defaultValue: "pending",
      },
      suspended: {
        type: "boolean",
        input: false,
        required: false,
        defaultValue: false,
      },
    },
  },
  plugins: [
    admin()
  ]
});
